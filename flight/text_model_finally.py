import requests
import json
import pymysql
import datetime
import time
import random
import re

def plane_data(dcity, acity, date):
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET CLR 2.0.50727; Media Center PC 6.0)",
        "Content-Type": "application/json",  # 声明文本类型为 json 格式
        "referer": r"https://flights.ctrip.com/itinerary/oneway/SHA-TAO?date=%s"%date
    }
    city = {'重庆': 'CKG', '上海': 'SHA'}
    url = 'http://flights.ctrip.com/itinerary/api/12808/products'
    request_payload = {"flightWay": "Oneway",
                       "classType": "ALL",
                       "hasChild": 'false',
                       "hasBaby": 'false',
                       "searchIndex": 1,
                       'date': date,
                       "airportParams": [
                           {"dcity": city.get(dcity), "acity": city.get(acity), "dcityname": dcity, "acityname": acity,
                            "date": date, 'dcityid': 4, 'acityid': 2}]
                    }
    # 这里传进去的参数必须为 json 格式
    response = requests.post(url, data=json.dumps(request_payload), headers=headers).text

    # 主键相同就更新，不同就插入

    sql_insert = """   
     insert into plane_data(flightId,airlineName,flightNumber,departure_cityName,departure_airportName,arrival_cityName,arrival_airportName,departureDate,arrivalDate,punctualityRate,price,special_price) 
     values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) 
     on DUPLICATE key update  
     departureDate=values(departureDate),
     arrivalDate=values(arrivalDate),
     punctualityRate=values(punctualityRate),
     price=values(price),
     special_price=values(special_price)
     """
    try:
        routeList = json.loads(response).get('data').get('routeList')
        for route in routeList:
            if len(route.get('legs')) == 1:
                info = {}
                legs = route.get('legs')[0]
                flight = legs.get('flight')
                cabins = legs.get('cabins')[0]

                airlineName = flight.get('airlineName')  # company
                flightNumber = flight.get('flightNumber')  # companyid
                departure_cityName = flight.get('departureAirportInfo').get('cityName')
                departure_airportName = flight.get('departureAirportInfo').get('airportName')  # portname
                arrival_cityName = flight.get('arrivalAirportInfo').get('cityName')
                arrival_airportName = flight.get('arrivalAirportInfo').get('airportName')
                departureDate = flight.get('departureDate')  # starttime
                arrivalDate = flight.get('arrivalDate')  # endtime
                flightId = flight.get('flightNumber') + departureDate  # id
                punctualityRate = flight.get('punctualityRate')  # rate
                cabins = legs.get('cabins')
                price = legs.get('cabins')[0].get('price').get('price')#经济舱价格
                special_price = '无'
                for i in range(len(cabins)):
                    cabin = cabins[i]
                    specialClass = cabin.get('specialClass')
                    if specialClass != None:
                        name = cabin.get('specialClass').get('typeName')
                        if '公务' in name:
                            special_price = cabin.get('price').get('price')#公务舱价格
                            break

                T = (flightId,airlineName,flightNumber,departure_cityName,departure_airportName,arrival_cityName,arrival_airportName,departureDate,arrivalDate,punctualityRate,price,special_price)
                try:
                    cursor.execute(sql_insert, T)
                except Exception as e:
                    print(e)
                    conn.rollback()
        print('plane_data--------%s' % date)
    except TypeError:
        print('访问频繁，被限制获取数据')
    except json.decoder.JSONDecodeError:
        print('429 Too Many Requests')


def direct_train_data(dcity, acity, date):
    #直达
    url = 'https://trains.ctrip.com/pages/booking/searchTrainList'
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:75.0) Gecko/20100101 Firefox/75.0",
        'content-type': 'application/json;charset=UTF-8',
        'origin': 'https://trains.ctrip.com',
        'accept': 'application/json, text/plain, */*',#指定接受数据为json
   }

    request_payload = {
        "departCityName": dcity,
        "arriveCityName":acity,
        "departDate": date,
        'trainNum': "",
    }
    response = requests.post(url, data=json.dumps(request_payload), headers=headers).text

    # 主键相同就更新，不同就插入
    sql_insert = """   
         insert into direct_train_data(direct_train_id,startStationName,endStationName,train_type_name,station_train_code,start_time,arrive_time,price)
         values(%s,%s,%s,%s,%s,%s,%s,%s)
         on DUPLICATE key update
         start_time=values(start_time),
         arrive_time=values(arrive_time)
         
         """
    try:
        trainList = json.loads(response).get('data').get('trainList')
        for train in trainList:
            start_date = date
            station_train_code = train.get('trainName')
            startStationName = train.get('startStationName')
            endStationName = train.get('endStationName')
            startTime = train.get('startTime')
            train_id = station_train_code + start_date#主键值
            endTime = train.get('endTime')
            price = train.get('seatBookingItem')[0].get('price')#二等票价格
            train_type_name = '直通'
            start_time = start_date + '-' + startTime
            arrive_time = start_date + '-' + endTime
            print(train_id,startStationName,endStationName,train_type_name,station_train_code,start_time,arrive_time,price)
            T = (train_id,startStationName,endStationName,train_type_name,station_train_code,start_time,arrive_time,price)
            try:
                cursor.execute(sql_insert, T)
            except Exception as e:
                print(e)
                conn.rollback()
        print('train_data--------%s' % date)
    except TypeError:
        print('访问频繁，被限制获取数据')
    except json.decoder.JSONDecodeError:
        print('429 Too Many Requests')


def transfer_train_data(dcity, acity, date):
    #中转
    url = 'https://trains.ctrip.com/pages/booking/getTransferList?departureStation={}&arrivalStation={}&departDateStr={}'.format(dcity, acity, date)
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:75.0) Gecko/20100101 Firefox/75.0",
        "Content-Type": "application/json",  # 声明文本类型为 json 格式
        #"referer": r"https://flights.ctrip.com/itinerary/oneway/SHA-TAO?date=%s" % date
    }
    res = requests.get(url, headers=headers).text

    sql_insert = """   
         insert into transfer_train_data(transfer_train_id,startStationName,endStationName,train_type_name, station_train_code, start_time, arrive_time,price) 
         values(%s,%s,%s,%s,%s,%s,%s,%s) 
         on DUPLICATE key update  
         start_time=values(start_time),
         arrive_time = values(arrive_time)
         """


    try:
        transferList = json.loads(res).get('data').get('transferList')
        for transfer in transferList:
            station_train_code = transfer.get('trainTransferInfos')[0].get('trainNo')
            start_time = transfer.get('trainTransferInfos')[0].get('departDate') + transfer.get('trainTransferInfos')[0].get('departTime')
            arrive_time = transfer.get('trainTransferInfos')[1].get('arriveDate') + transfer.get('trainTransferInfos')[1].get('arriveTime')
            startStationName = transfer.get('departStation')#起始站
            endStationName = transfer.get('arriveStation')#终点站
            train_type_name = '转乘'
            price_1 = transfer.get('showPriceText')#最低价格
            price = re.findall(r"\d+\.?\d*",price_1)[0]#只取数字
            train_id = station_train_code + start_time + price
            print(startStationName,endStationName,train_type_name, station_train_code, start_time, arrive_time,price)
            T = (train_id,startStationName,endStationName,train_type_name, station_train_code, start_time, arrive_time,price)
            try:
                cursor.execute(sql_insert, T)
            except Exception as e:
                print(e)
                conn.rollback()
        print('transfer_train_data----%s'%date)
    except TypeError as e:
        print(e)
        print('访问频繁，被限制获取数据')
    except json.decoder.JSONDecodeError:
        print('429 Too Many Requests')



if __name__ == "__main__":
    dcity = "重庆"
    acity = "上海"
    date = "2020-07-25"

    conn = pymysql.connect(host='192.168.99.100', user='root', password='admin', db='traffic', port=3306, charset='utf8')
    print('连接数据库成功')
    cursor = conn.cursor()
    cursor.execute('set names utf8')

    # dcity = input('请输入起始地点：')
    # acity = input('请输入目的地：')
    # date = input('请输入时间（示例：2020-07-21）：')

    try:
        for i in range(0, 8):#从今天到后7天
            tag = 1
            #调取三个接口
            plane_data(dcity, acity, date)
            time.sleep(random.uniform(1, 2))
            direct_train_data(dcity, acity, date)
            time.sleep(random.uniform(1, 2))
            transfer_train_data(dcity, acity, date)


            # 把date变为日期格式
            date = datetime.datetime.strptime(date, '%Y-%m-%d').date()
            date = date + datetime.timedelta(days=tag)
            # 转回字符串
            date = datetime.datetime.strftime(date, '%Y-%m-%d')
            #每得到一次数据提交一次到数据库
            conn.commit()
            time.sleep(random.uniform(20,25))
            print('-----------------------------------------------------------------------')

    finally:
        cursor.close()
        conn.close()
        print('关闭数据库成功')




