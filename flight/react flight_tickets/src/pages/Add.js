
import React, { Component } from 'react';

export default class Add extends Component {

    constructor(props) {
        super(props);
        this.state = {
            flightId: '',
            airlineName: '',
            flightNumber: '',
            departure_cityName: '',
            departure_airportName: '',
            arrival_cityName: '',
            arrival_airportName: '',
            departureDate: '',
            arrivalDate: '',
            punctualityRate: '',
            price: '',
            special_price: ''
        }
    }

    formatDate (date) {
        let d = new Date(date)
        let month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        let time = d.toTimeString();
        return [year, month, day].join('-') + " " + time.split(' ')[0];
    }


    async handleAdd (e) {
        e.preventDefault();
        console.log(this.state);
        let data = { ...this.state };
        data.departureDate = this.formatDate(data.departureDate);
        data.arrivalDate = this.formatDate(data.arrivalDate);
        let response = await fetch('http://localhost:8080/api/v1.0/plane', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (response.ok) {
            this.props.history.push('/manageflights');
        }

    }


    render () {
        return (<div className="container" style={{ background: 'white', minHeight: '100%' }}>
            <form onSubmit={e => this.handleAdd(e)} style={{ padding: '10px 50px' }}>
                <div className="form-group row">
                    <label htmlFor="flightId" className="col-sm-2 col-form-label">Flight Id</label>
                    <div className="col-sm-10">
                        <input type="text" value={this.state.flightId} onChange={(e) => { this.setState({ flightId: e.target.value }) }} className="form-control" id="airlineName" placeholder="Airline Name" required />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="airlineName" className="col-sm-2 col-form-label">Airline Name</label>
                    <div className="col-sm-10">
                        <input type="text" value={this.state.airlineName} onChange={(e) => { this.setState({ airlineName: e.target.value }) }} className="form-control" id="airlineName" placeholder="Airline Name" required />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="flightNumber" className="col-sm-2 col-form-label">Flight Number</label>
                    <div className="col-sm-10">
                        <input type="text" value={this.state.flightNumber} onChange={(e) => { this.setState({ flightNumber: e.target.value }) }} className="form-control" id="flightNumber" placeholder="Flight Number" required />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="departure_cityName" className="col-sm-2 col-form-label">Departure City</label>
                    <div className="col-sm-10">
                        <input type="text" value={this.state.departure_cityName} onChange={(e) => { this.setState({ departure_cityName: e.target.value }) }} className="form-control" id="departure_cityName" placeholder="Departure city Name" required />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="departure_airportName" className="col-sm-2 col-form-label">Departure Airport</label>
                    <div className="col-sm-10">
                        <input type="text" value={this.state.departure_airportName} onChange={(e) => { this.setState({ departure_airportName: e.target.value }) }} className="form-control" id="departure_airportName" placeholder="Departure Airport" required />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="arrival_cityName" className="col-sm-2 col-form-label">Arrival City</label>
                    <div className="col-sm-10">
                        <input type="text" value={this.state.arrival_cityName} onChange={(e) => { this.setState({ arrival_cityName: e.target.value }) }} className="form-control" id="arrival_cityName" placeholder="Arrival city Name" required />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="arrival_airportName" className="col-sm-2 col-form-label">Arrival Airport</label>
                    <div className="col-sm-10">
                        <input type="text" value={this.state.arrival_airportName} onChange={(e) => { this.setState({ arrival_airportName: e.target.value }) }} className="form-control" id="arrival_airportName" placeholder="Arrival Airport Name" required />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="departureDate" className="col-sm-2 col-form-label">Departure Date</label>
                    <div className="col-sm-10">
                        <input type="datetime-local" value={this.state.departureDate} onChange={(e) => { this.setState({ departureDate: e.target.value }) }} className="form-control" id="departureDate" placeholder="Departure Date" required />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="arrivalDate" className="col-sm-2 col-form-label">Arrival Date</label>
                    <div className="col-sm-10">
                        <input type="datetime-local" value={this.state.arrivalDate} onChange={(e) => { this.setState({ arrivalDate: e.target.value }) }} className="form-control" id="arrivalDate" placeholder="Arrival Date" required />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="punctualityRate" className="col-sm-2 col-form-label">Punctuality Rate</label>
                    <div className="col-sm-10">
                        <input type="text" max="100" value={this.state.punctualityRate} onChange={(e) => { this.setState({ punctualityRate: e.target.value }) }} className="form-control" id="punctualityRate" placeholder="Punctuality Rate" required />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="price" className="col-sm-2 col-form-label">Price</label>
                    <div className="col-sm-10">
                        <input type="number" value={this.state.price} onChange={(e) => { this.setState({ price: e.target.value }) }} className="form-control" id="price" placeholder="Price" required />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="special_price" className="col-sm-2 col-form-label">Special Price</label>
                    <div className="col-sm-10">
                        <input type="number" value={this.state.special_price} onChange={(e) => { this.setState({ special_price: e.target.value }) }} className="form-control" id="special_price" placeholder="Special Price" required />
                    </div>
                </div>
                <div className="form-group row">
                    {/* <div className="col-sm-6">
                      
                    </div> */}
                    <div className="col-sm-2">
                        <button type="submit" className="btn btn-warning">Add</button>
                    </div>
                </div>
            </form>
        </div>)
    }
}