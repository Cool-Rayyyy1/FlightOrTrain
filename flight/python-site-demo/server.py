#!flask/bin/python
from flask import Flask, jsonify, request, abort
from flask_httpauth import HTTPDigestAuth
from flask_cors import CORS
from flask_request_params import bind_request_params

import traceback
import json
import urllib
import pymysql

import time
import datetime
import decimal

conn = pymysql.connect(host= "localhost", port=32797, user="root", password="cs411", database="mysql")
cur = conn.cursor()

################################################################################
# Table create
################################################################################

def createTableIfNotExists():
    sql = """
    CREATE TABLE IF NOT EXISTS `passenger` (
        `ID` int(11) NOT NULL AUTO_INCREMENT,
        `name` varchar(255) DEFAULT NULL,
        `location` varchar(255) DEFAULT NULL,
        `target_city` varchar(255) DEFAULT NULL,
        `prefer_class` varchar(255) DEFAULT NULL,
        `prefer_train_degree` int(11) DEFAULT NULL,
        PRIMARY KEY (`ID`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    """
    cur.execute(sql)

    sql = """
    CREATE TABLE IF NOT EXISTS `user` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `username` varchar(255) NOT NULL,
        `password` varchar(255) NOT NULL,
        `comment` varchar(255) NOT NULL,
        PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    """
    cur.execute(sql)

    sql = """
    CREATE TABLE IF NOT EXISTS plane_data (
	    flightId VARCHAR(50),
        airlineName VARCHAR(10),
        flightNumber VARCHAR(15),
        departure_cityName VARCHAR(10),
        departure_airportName VARCHAR(10),
        arrival_cityName VARCHAR(10),
        arrival_airportName VARCHAR(10),
        departureDate VARCHAR(255),
        arrivalDate VARCHAR(255),
        punctualityRate VARCHAR(10),
        price INT,
        special_price VARCHAR(10),
        PRIMARY KEY(flightId)
    );
    """
    cur.execute(sql)

    sql = """
    CREATE TABLE IF NOT EXISTS direct_train_data(
        direct_train_id VARCHAR(20),
        start_date VARCHAR(10),
        trainName VARCHAR(10),
        startStationName VARCHAR(10),
        endStationName VARCHAR(10),
        startTime VARCHAR(10),
        endTime VARCHAR(10),
        second_price VARCHAR(10),
        second_tickets VARCHAR(10),
        first_price VARCHAR(10),
        first_tickets VARCHAR(10),
        PRIMARY KEY (direct_train_id)
    );
    """
    cur.execute(sql)

    sql = """
    CREATE TABLE IF NOT EXISTS transfer_train_data(
        transfer_train_id VARCHAR(30),
        trainNo VARCHAR(10),
        departTime VARCHAR(30),
        arriveTime VARCHAR(20),
        departStation VARCHAR(10),
        arriveStation VARCHAR(30),
        transferStation VARCHAR(10),
        showPriceText VARCHAR(10),
        PRIMARY KEY (transfer_train_id)
    );
    """
    cur.execute(sql)

################################################################################
# User create
################################################################################

def createDefaultUser():
    sql = "INSERT INTO `traffic`.`user`(`id`, `username`, `password`, `comment`) VALUES (1, 'admin', 'admin', 'administrator') ON DUPLICATE KEY UPDATE `id`=VALUES(`id`), `username`=VALUES(`username`), `password`=VALUES(`password`), `comment`=VALUES(`comment`);"
    cur.execute(sql)

################################################################################
# App init
################################################################################

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o,decimal.Decimal):
            return str(o)
        return json.JSONEncoder.default(self,o)

app = Flask(__name__, static_url_path='', static_folder='public', template_folder='template')
app.config['SECRET_KEY'] = 'secret_key_here'
auth = HTTPDigestAuth()
cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.before_request(bind_request_params)
app.json_encoder = JSONEncoder

################################################################################
# Auth
################################################################################

@auth.get_password
def get_pw(username):

    print(username)

    sql = "SELECT * FROM user WHERE username = '%s'" % (username)
    cur.execute(sql)

    results = cur.fetchall()

    user = {}
    for row in results:
        user["id"] = row[0]
        user["username"] = row[1]
        user["password"] = row[2]
        user["comment"] = row[3]

        if username == user["username"]:
            return user["password"]
    return None

################################################################################
# Index
################################################################################

@app.route("/")
def root():
    return app.send_static_file('index.html')

################################################################################
# Server status
################################################################################

@app.route('/status')
@auth.login_required
def index():
    return "Hello, {}! Our server is running on localhost:5000".format(auth.username())

################################################################################
# User management
################################################################################

@app.route('/api/v1.0/user/<int:user_id>', methods=['GET'])
def get_user(user_id):

    sql = "SELECT * FROM user WHERE id = %s" % (user_id)
    cur.execute(sql)

    results = cur.fetchall()

    actual = {}
    user = {}
    found = False
    for row in results:
        user["id"] = row[0]
        user["username"] = row[1]
        user["password"] = row[2]
        user["comment"] = row[3]
        if (user["id"] == user_id):
            found = True
            actual = user

    if (found):
        return jsonify({'user': actual})
    else:
        abort(404)

@app.route('/api/v1.0/user', methods=['POST'])
def create_user():
    if not request.json or not 'username' in request.json:
        abort(400)
    
    sql = "INSERT INTO user(`username`, `password`, `comment`) VALUES('%s','%s','%s')" % (request.json["username"], request.json["password"], request.json["comment"])

    print(sql)
    cur.execute(sql)
    conn.commit()

    user = {
        'username': request.json["username"],
        'password': request.json["password"],
        'comment': request.json["comment"]
    }
    return jsonify({'user': user}), 200

@app.route('/api/v1.0/user', methods=['GET'])
def list_user():

    sql = "SELECT * FROM user"
    cur.execute(sql)

    results = cur.fetchall()

    users = []
    found = False
    for row in results:
        user = {}
        user["id"] = row[0]
        user["username"] = row[1]
        user["password"] = row[2]
        user["comment"] = row[3]
        users.append(user)

    return jsonify({'users': users}), 200

################################################################################
# Business
################################################################################

# 列出飞机票信息
@app.route('/api/v1.0/plane', methods=['GET'])
def list_plane():                      #list all data from plane_data

    sql = "SELECT * FROM plane_data"
    cur.execute(sql)

    results = cur.fetchall()

    planes = [] # Use [] instead of {}
    found = False
    for row in results:
        plane_data = {}
        plane_data["flightId"] = row[0]
        plane_data["airlineName"] = row[1]
        plane_data["flightNumber"] = row[2]
        plane_data["departure_cityName"] = row[3]
        plane_data["departure_airportName"] = row[4]
        plane_data["arrival_cityName"] = row[5]
        plane_data["arrival_airportName"] = row[6]
        plane_data["departureDate"] = row[7]
        plane_data["arrivalDate"] = row[8]
        plane_data["punctualityRate"] = row[9]
        plane_data["price"] = row[10]
        plane_data["special_price"] = row[11]
        planes.append(plane_data)

    return jsonify({'planes': planes}), 200

# 获取飞机票信息
@app.route('/api/v1.0/plane/<string:flight_id>', methods=['GET'])
def get_plane(flight_id):

    sql = "SELECT * FROM plane_data where flightId = '%s'" % (flight_id)
    cur.execute(sql)

    results = cur.fetchall()

    result = {}
    found = False
    for row in results:
        plane_data = {}
        plane_data["flightId"] = row[0]
        plane_data["airlineName"] = row[1]
        plane_data["flightNumber"] = row[2]
        plane_data["departure_cityName"] = row[3]
        plane_data["departure_airportName"] = row[4]
        plane_data["arrival_cityName"] = row[5]
        plane_data["arrival_airportName"] = row[6]
        plane_data["departureDate"] = row[7]
        plane_data["arrivalDate"] = row[8]
        plane_data["punctualityRate"] = row[9]
        plane_data["price"] = row[10]
        plane_data["special_price"] = row[11]
        result = plane_data

    return jsonify({'plane': result}), 200

# 插入飞机票信息
@app.route('/api/v1.0/plane', methods=['POST'])
def create_plane_data():
    if not request.json or not 'flightId' in request.json:
        abort(400)
    print('ok')
    sql = """INSERT INTO plane_data(`flightId`, `airlineName`, `flightNumber`, `departure_cityName`, 
            `departure_airportName`, `arrival_cityName`, `arrival_airportName`, `departureDate`, 
            `arrivalDate`, `punctualityRate`, `price`, `special_price`) 
            VALUES('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s')""" % (request.json["flightId"], request.json["airlineName"], request.json["flightNumber"], request.json["departure_cityName"], request.json["departure_airportName"], request.json["arrival_cityName"], request.json["arrival_airportName"], request.json["departureDate"], request.json["arrivalDate"], request.json["punctualityRate"], request.json["price"], request.json["special_price"])

    print(sql)
    cur.execute(sql)
    conn.commit()

    plane_data = {
        'flightId': request.json["flightId"],
        'airlineName': request.json["airlineName"],
        'flightNumber': request.json["flightNumber"],
        'departure_cityName': request.json["departure_cityName"],
        'departure_airportName': request.json["departure_airportName"],
        'arrival_cityName': request.json["arrival_cityName"],
        'arrival_airportName': request.json["arrival_airportName"],
        'departureDate': request.json["departureDate"],
        'arrivalDate': request.json["arrivalDate"],
        'punctualityRate': request.json["punctualityRate"],
        'price': request.json["price"],
        'special_price': request.json["special_price"]
    }
    return jsonify({'plane_data': plane_data}), 200

# 删除飞机票信息
@app.route('/api/v1.0/plane/<string:flight_id>', methods=['DELETE'])
def delete_plane(flight_id):

    sql = "SELECT * FROM plane_data WHERE flightId = '%s'" % (flight_id)
    cur.execute(sql)

    results = cur.fetchall()

    if len(results) == 0:
        return jsonify({"message": "No such flight"}), 404
    
    sql = "DELETE FROM plane_data WHERE flightId = '%s'" % (flight_id)
    cur.execute(sql)
    conn.commit()
    return jsonify({"message": "Success"}), 200

# 修改飞机票信息
@app.route('/api/v1.0/plane/<string:flight_id>', methods=['PUT'])
def update_plane(flight_id):

    sql = "SELECT * FROM plane_data WHERE flightId = '%s'" % (flight_id)
    cur.execute(sql)

    results = cur.fetchall()

    if len(results) == 0:
        return jsonify({"message": "No such flight"}), 404

    sql = """update plane_data SET `airlineName` = '%s', `flightNumber`= '%s', `departure_cityName`= '%s', 
            `departure_airportName`= '%s', `arrival_cityName`= '%s', `arrival_airportName`= '%s', `departureDate`= '%s', 
            `arrivalDate`= '%s', `punctualityRate`= '%s', `price`= '%s', `special_price`= '%s' WHERE flightId = '%s'""" % \
                (request.json["airlineName"], request.json["flightNumber"], request.json["departure_cityName"], \
                    request.json["departure_airportName"], request.json["arrival_cityName"], request.json["arrival_airportName"], \
                        request.json["departureDate"], request.json["arrivalDate"], request.json["punctualityRate"], request.json["price"], request.json["special_price"], flight_id)
    print(sql)
    cur.execute(sql)
    conn.commit()

    plane_data = {
        'flightId': request.json["flightId"],
        'airlineName': request.json["airlineName"],
        'flightNumber': request.json["flightNumber"],
        'departure_cityName': request.json["departure_cityName"],
        'departure_airportName': request.json["departure_airportName"],
        'arrival_cityName': request.json["arrival_cityName"],
        'arrival_airportName': request.json["arrival_airportName"],
        'departureDate': request.json["departureDate"],
        'arrivalDate': request.json["arrivalDate"],
        'punctualityRate': request.json["punctualityRate"],
        'price': request.json["price"],
        'special_price': request.json["special_price"]
    }

    return jsonify({'plane_data': plane_data}), 200


# 列出所有的供 passenger 选择
@app.route('/api/v1.0/passenger/names', methods=['GET'])
def list_passenger():
    sql=("SELECT name from passenger")
    cur.execute(sql)

    names = []
    for row in cur.fetchall():
        names.append(row[0])

    return jsonify({"names": names}), 200

# 输入了 passenger 姓名和 date
@app.route('/api/v1.0/passenger/list_plane_inrank', methods=['GET'])
def list_plane_inrank():
    # <string:user_id>,<string:custermor_name>,<string:leave_date>
    name = request.args.get("name")
    leave_date = request.args.get("date")
    
    # sql="""SELECT 
    #             plane_data.flightId, 
    #             plane_data.airlineName,
    #             plane_data.flightNumber,
    #             plane_data.departure_cityName,
    #             plane_data.departure_airportName ,
    #             plane_data.arrival_cityName, 
    #             plane_data.arrival_airportName,
    #             plane_data.departureDate, 
    #             plane_data.arrivalDate, 
    #             plane_data.punctualityRate,
    #             plane_data.price ,
    #             plane_data.special_price 
    #         FROM passenger, plane_data 
    #         WHERE passenger.location = plane_data.departure_cityName AND plane_data.departureDate LIKE '%s%%' AND passenger.name = '%s' 
    #         ORDER BY plane_data.price DESC""" % (leave_date, name)
    
    # print(sql)
    # cur.execute(sql)

    sql ="""SELECT 
                B.flightId, 
                B.airlineName,
                B.flightNumber,
                B.departure_cityName,
                B.departure_airportName,
                B.arrival_cityName, 
                B.arrival_airportName,
                B.departureDate, 
                B.arrivalDate, 
                B.punctualityRate,
                B.price,
                B.special_price
            FROM 
                airline_data A NATURAL join plane_data B join passenger C on (C.location = B.departure_cityName)
            WHERE 
                A.rating >=4 and B.departureDate LIKE '%s%%' AND C.name = '%s' 
                AND B.price in (SELECT min(E.price) 
                                FROM airline_data D NATURAL join plane_data E join passenger F on (F.location = E.departure_cityName)
                                WHERE 
                                D.rating >=4 and E.departureDate LIKE '%s%%' AND F.name = '%s' and B.airlineName = E.airlineName
                                group by E.airlineName)""" % (leave_date, name, leave_date, name)  
    print(sql)
    cur.execute(sql)

    results = cur.fetchall()

    planes = [] 
    for row in results:
        plane_data = {}
        plane_data["flightId"] = row[0]
        plane_data["airlineName"] = row[1]
        plane_data["flightNumber"] = row[2]
        plane_data["departure_cityName"] = row[3]
        plane_data["departure_airportName"] = row[4]
        plane_data["arrival_cityName"] = row[5]
        plane_data["arrival_airportName"] = row[6]
        plane_data["departureDate"] = row[7]
        plane_data["arrivalDate"] = row[8]
        plane_data["punctualityRate"] = row[9]
        plane_data["price"] = row[10]
        plane_data["special_price"] = row[11]
        planes.append(plane_data)

    return jsonify({'flights': planes})

################################################################################
# added at 2020-08-02
################################################################################

# 获取用户名、要求出发的日期和时间
# 飞机和铁路的评级列表
@app.route('/api/v1.0/traval/rank', methods=['GET']) 
def travalmsg():
    # 用户日期时间
    # Jian Chen
    user_name = request.args.get("name")
    # 2020-08-01 20:20:20
    user_date = request.args.get("date")

    optinals = []

    # 获取航空公司评级信息
    sql = "select * from passenger where name ='%s'" %(user_name)
    cur.execute(sql)
    u = cur.fetchall ()

    user = u[0]
    print("user: ", user)

    timestamp = time.mktime(datetime.datetime.strptime(user_date, "%Y-%m-%d %H:%M:%S").timetuple())
    offset = 24 * 60 * 60
    before = timestamp  - offset
    after = timestamp + offset

    print("timestamp: ", timestamp)

    print("before: ", before)
    print("after: ", after)

    maxDistance = 24 * 60 * 60

    departureCityName = user[2]
    startStationNameLike = user[2]


    print(user_name, user_date)

    ##########################################################################################
    # Airline Part
    ##########################################################################################

    # sample
    # SELECT a.airlineName, a.departureDate, a.punctualityRate, a.price, a.special_price, UNIX_TIMESTAMP(a.departureDate), ABS(UNIX_TIMESTAMP(a.departureDate) - 1596284420.0) distance, b.rating FROM plane_data a, airline_data b WHERE a.airlineName = b.airlineName AND 1596198020.0 < UNIX_TIMESTAMP(a.departureDate) and UNIX_TIMESTAMP(a.departureDate) < 1596370820.0 ORDER BY distance ASC;
    sql = "SELECT a.airlineName, a.departureDate, a.punctualityRate, a.price, a.special_price, UNIX_TIMESTAMP(a.departureDate),"
    sql += " ABS(UNIX_TIMESTAMP(a.departureDate) - %s) distance, b.rating, a.special_price, a.flightId, a.arrivalDate,a.departure_cityName,a.arrival_cityName  FROM plane_data a, airline_data b WHERE a.airlineName = b.airlineName " % (timestamp)
    sql += " AND %s < UNIX_TIMESTAMP(a.departureDate) and UNIX_TIMESTAMP(a.departureDate) < %s AND departure_cityName LIKE '%%%s%%' ORDER BY distance ASC" % (before, after, departureCityName)
    cur.execute(sql)
    plane_lst = cur.fetchall()

    print("plane_lst length: ", len(plane_lst))

    # 分值计算：时间因素30分，用户偏好30分（是否是该航空公司vip），准点率20分，舱位10分，航空公司评级10分；
    # 时间因素30分，用户偏好20分，是否是该航空公司vip20，准点率10分，舱位10分，航空公司评级10分；

    for plane in plane_lst:
        row = {}
        # factor
        row["factor"] = 0.0
        # base args
        row["airlineName"] = plane[0]
        row["departureDate"] = plane[1]
        row["punctualityRate"] = plane[2]
        row["price"] = plane[3]
        row["special_price"] = plane[4]
        row["departureDateUT"] = plane[5]
        row["distance"] = plane[6]
        row["rating"] = plane[7]
        row["special_price"] = plane[8]
        row["flightId"] = plane[9]
        row["arrivalDate"] = plane[10]
        row["departure_cityName"] = plane[11]
        row["arrival_cityName"] = plane[12]
        row["type"] = "plane"

        # 时间因素
        distance = plane[6]
        timeScore = (abs(maxDistance - distance) / maxDistance) * 30

        row["factor"] += float(timeScore)

        # 用户偏好 of plane
        userFavorScore = (abs(100 - user[5]) / 100) * 20
        row["factor"] += float(userFavorScore)

        # 是否是该航空公司VIP
        if user[6] == row["airlineName"]:
            row["factor"] += 20.0

        # 准点率
        if ("" == row["punctualityRate"]):
            row["factor"] += 0.0
        else:
            punctualityRate = row["punctualityRate"].strip('%')
            punctualityScore = float(punctualityRate) / 100 * 10
            row["factor"] += punctualityScore
        
        # 舱位
        if user[4] == "Business" and row["special_price"] == "无":
            # 期望商务舱，没有商务舱，不得分
            row["factor"] += 0.0
        else:
            # 不关注
            row["factor"] += 10.0
        
        # 航空公司评级

        airlineLevelScore = abs(5 - row["rating"]) / 5 * 10
        row["factor"] += float(airlineLevelScore)

        if row["factor"] > 100:
            print(row)

        optinals.append(row)

    ##########################################################################################
    # Train Part
    ##########################################################################################

    # 火车计算方式：时间因素（比例方式同飞机计算）50分，用户偏好30分（prefer_train_degree），是否直达20分；

    sql = "SELECT `train_id`, `startStationName`, `endStationName`, `train_type_name`, `station_train_code`, `start_time`, `arrive_time`, `price`, "
    sql += "UNIX_TIMESTAMP(start_time), ABS(UNIX_TIMESTAMP(start_time) - %s) distance FROM train_data WHERE " % (timestamp)
    sql += "%s < UNIX_TIMESTAMP(start_time) and UNIX_TIMESTAMP(start_time) < %s AND startStationName LIKE '%%%s%%' ORDER BY distance ASC" % (before, after, startStationNameLike)

    print(sql)
    cur.execute(sql)
    train_lst = cur.fetchall()

    for train in train_lst:
        row = {}
        # factor
        row["factor"] = 0.0

        row["train_id"] = train[0]
        row["startStationName"] = train[1]
        row["endStationName"] = train[2]
        row["train_type_name"] = train[3]
        row["station_train_code"] = train[4]
        row["start_time"] = train[5]
        row["arrive_time"] = train[6]
        row["price"] = train[7]
        row["start_timeUT"] = train[8]
        row["distance"] = train[9]
        row["type"] = "train"

        distance = row["distance"]
        
        # 时间因素    
        timeScore = (abs(maxDistance - distance) / maxDistance) * 50
        row["factor"] += float(timeScore)

        # 用户偏好 of train
        userFavorScore = (abs(user[5]) / 100) * 30
        row["factor"] += float(userFavorScore)

        # 是否直达
        if row["train_type_name"] == "直通":
            row["factor"] += 20.0
    
        optinals.append(row)

    optinals.sort(key=sortByFactor, reverse=True)

    if len(optinals) > 20:
        optinals = optinals[0:20]

    print(len(optinals))

    return jsonify(optinals), 200

def sortByFactor(elem):
    return elem["factor"]

################################################################################
# end
################################################################################


if __name__ == '__main__':

    app.run(debug=True, port=8080)