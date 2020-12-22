import React, { Component, Fragment } from 'react'



export default class Home extends Component {


    constructor(props) {
        super(props);
        this.state = {
            name: '',
            from: '',
            to: '',
            departure: '',
            type: 0,
            flights: [],
            trains: [],
            showFligths: false,
            selected: {},
            passenger: [{
                name: 'Yunzhe Zhang',
                from: '上海',
                to: '重庆'
            }, {
                name: 'Lanjin Xuan',
                from: '上海',
                to: '重庆'
            }, {
                name: 'Jian Chen',
                from: '重庆',
                to: '上海',
            }, {
                name: 'Taoyu Cai',
                from: '重庆',
                to: '上海',
            }]
        }

        this.handleSubmit.bind(this);
    }

    async handleSubmit (e) {
        e.preventDefault();
        //   console.log(this.state)
        let ld = this.state.departure.split('T')[0]
        let response = await fetch(`http://localhost:8080/api/v1.0/passenger/list_plane_inrank?name=${this.state.name}&date=${ld}`)

        if (response.ok) {
            let flights = [];
            let trains = []
            let data = await response.json();
            flights = data.flights
            console.log(flights)
            this.setState({
                flights,
                trains,
                showFligths: true
            })
        }

        if (this.state.type === 1) {
            let date = this.state.departure.replace('T', ' ') + ':00'
            response = await fetch(`http://localhost:8080/api/v1.0/traval/rank?name=${this.state.name}&date=${date}`)

            if (response.ok) {
                let trains = []
                let flights = []
                let data = await response.json();

                data.forEach(element => {
                    if (element.type === "train")
                        trains.push(element)
                    else
                        flights.push(element)
                });
                console.log(data)
                this.setState({
                    trains,
                    flights,
                    showFligths: true
                })
            }
        }

    }

    select (name) {
        let p = this.state.passenger.find(e => e.name === name)
        this.setState({ from: p.from, to: p.to, name: p.name })
    }
    render () {
        return (
            <div className="container">
                <div className="jumbotron" style={{ padding: "1rem 1rem", backgroundColor: 'rgba(0,0,0,0.75)', color: '#fff', marginTop: '5%' }}>
                    <div className="container">
                        <h4 >Search Flights</h4>

                        <div className="row">
                            <div className="col-3">
                                <button onClick={() => { this.setState({ type: 0 }) }} className={"tab-btn " + (this.state.type === 0 ? 'on' : '')}>
                                    <i className="fa fa-plane" aria-hidden="true"></i>
                                    <br />
                                    <span>Flight</span>
                                </button>
                            </div>
                            <div className="col-3">
                                <button onClick={() => { this.setState({ type: 1 }) }} className={"tab-btn " + (this.state.type === 1 ? 'on' : '')}>
                                    <i className="fa fa-plane" aria-hidden="true"></i>
                  &nbsp;
                  &nbsp;
                  <i className="fa fa-train" aria-hidden="true"></i>
                                    <br />
                                    <span>Flight + Train</span>
                                </button>
                            </div>
                        </div>
                        <br />
                        <form onSubmit={(e) => { e.preventDefault(); this.handleSubmit(e) }}>
                            <div id="leftNav" className="col-6" style={{ paddingLeft: '0px' }}>
                                <div className="form-group" id="holder">
                                    <small id="label" htmlFor="input">Passenger</small>
                                    <select type="text" onChange={(e) => { this.select(e.target.value) }} className="form-control" style={{ paddingTop: '.6rem', paddingBottom: '0px' }} id="input">
                                        <option selected="true" disabled>---choose one---</option>
                                        {
                                            this.state.passenger.map((e) =>
                                                <option value={e.name}>{e.name}</option>
                                            )
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                <div id="leftNav" className="col-6">
                                    <div className="form-group" id="holder">
                                        <small id="label" htmlFor="input">Flight from</small>
                                        <input type="text" value={this.state.from} onChange={(e) => { this.setState({ from: e.target.value }) }} className="form-control" style={{ paddingTop: '.6rem', paddingBottom: '0px' }} id="input" placeholder="City or Airport" />
                                    </div>
                                </div>

                                <div className="col-6">
                                    <div className="form-group" id="holder">
                                        <small id="label" htmlFor="input">Going to</small>
                                        <input type="text" value={this.state.to} onChange={(e) => { this.setState({ to: e.target.value }) }} className="form-control" style={{ paddingTop: '.6rem', paddingBottom: '0px' }} id="input" placeholder="City or Airport" />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-4">
                                    <div className="form-group" id="holder">
                                        <small id="label" htmlFor="input">Departing</small>
                                        <input type="datetime-local" value={this.state.departure} onChange={(e) => { let date = e.target.value; this.setState({ departure: date }) }} className="form-control" style={{ paddingTop: '.6rem', paddingBottom: '0px' }} id="input" placeholder="City or Airport" />
                                    </div>
                                </div>
                            </div>
                            <br />
                            <div className="row">
                                <div className="col">
                                    <button type="submit" className="btn btn-warning btn-lg" >Search</button>
                                </div>
                            </div>
                        </form>
                    </div>

                </div>
                {
                    this.state.showFligths ? (<div className="flights">
                        <button onClick={() => { this.setState({ showFligths: false }) }} className="btn btn-danger btn-sm" style={{ margin: '10px', float: 'right' }}><strong>X</strong></button>
                        <Fligths flights={this.state.flights} trains={this.state.trains} {...this.props}></Fligths>
                    </div>) : ''
                }
            </div>
        )
    }
}


function Fligths (props) {
    console.log(props)
    return (<div className="container" style={{ width: '100%', overflowY: 'scroll', height: '100%' }}>
        {

            <Fragment>
                <br />
                <h4>Fligths  {props.flights.length} results</h4>
                <div className="list-group">
                    {props.flights.map((e) =>
                        <a href="!#" onClick={(event) => { event.preventDefault() }} className="list-group-item list-group-item-action">
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1">{e.departure_cityName} -- {e.arrival_cityName}</h5>
                                <small>Departure {e.departureDate}</small>
                                <small>Arrival {e.arrivalDate}</small>
                                <button onClick={() => { props.history.push('/flight/detail/' + e.flightId) }} className="btn btn-warning btn-sm">Detail</button>
                            </div>
                            <p className="mb-1">
                                {
                                    e.special_price === '无' ? <strong style={{ color: '#23c523' }}>${e.price}</strong>
                                        : (<Fragment><s style={{ color: 'red', fontSize: '12px' }}>${e.price}</s>
                                            <strong style={{ color: '#23c523' }}>${e.special_price}</strong></Fragment>)
                                }
                            </p>
                            <small>{e.departure_airportName}</small>
                        </a>)}
                </div> </Fragment>
        }
        {

            <Fragment>
                <br />
                <h4>Trains {props.trains.length} results</h4>
                <div className="list-group">
                    {props.trains.map((e, index) =>
                        <a href="!#" key={index} onClick={(event) => { event.preventDefault() }} className="list-group-item list-group-item-action">
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1">{e.startStationName} -- {e.endStationName}</h5>
                                <small>Departure {e.start_time} </small>
                                <small>Arrival {e.arrive_time} </small>
                                {/* <button onClick={() => { props.history.push('/train/detail/' + e.id) }} className="btn btn-warning btn-sm">Detail</button> */}
                            </div>
                            <p className="mb-1">¥{e.price}</p>
                            <small>{e.trainName}</small> 
                            <small>{e.train_type_name}</small>
                        </a>)}
                </div> </Fragment>
        }

    </div>)
}
