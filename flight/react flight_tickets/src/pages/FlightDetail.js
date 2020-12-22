
import React, { Component } from 'react';

export default class FlightDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
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

    async componentDidMount () {
        const id = this.props.match.params.id;
        console.log(id)
        const response = await fetch('http://localhost:8080/api/v1.0/plane/' + id)
        let data = await response.json();
        data = data.plane
        console.log(data)
        this.setState({
            flightId: data.flightId,
            airlineName: data.airlineName,
            flightNumber: data.flightNumber,
            departure_cityName: data.departure_cityName,
            departure_airportName: data.departure_airportName,
            arrival_cityName: data.arrival_cityName,
            arrival_airportName: data.arrival_airportName,
            departureDate: data.departureDate,
            arrivalDate: data.arrivalDate,
            punctualityRate: data.punctualityRate,
            price: data.price,
            special_price: data.special_price
        })
    }




    render () {
        return (<div className="container" style={{ background: 'white', minHeight: '100%' }}>
            <a href="!#" onClick={(e) => { e.preventDefault(); this.props.history.goBack() }}>Back</a>

            <h3 >ID {this.state.flightId}</h3>

            <table class="table">
                <tbody>

                    <tr>
                        <th scope="row">Flight Number</th>
                        <td>{this.state.flightNumber}</td>

                    </tr>
                    <tr>
                        <th scope="row">Airline Name</th>
                        <td>{this.state.airlineName}</td>

                    </tr>
                    <tr>
                        <th scope="row">Departure City Name</th>
                        <td>{this.state.departure_cityName}</td>
                    </tr>
                    <tr>
                        <th scope="row">Departure Airport Name</th>
                        <td>{this.state.departure_airportName}</td>
                    </tr>
                    <tr>
                        <th scope="row">Arrival City Name</th>
                        <td>{this.state.arrival_cityName}</td>
                    </tr>
                    <tr>
                        <th scope="row">Arrival Airport Name</th>
                        <td>{this.state.arrival_airportName}</td>
                    </tr>
                    <tr>
                        <th scope="row">Departure Date</th>
                        <td>{this.state.departureDate}</td>
                    </tr>
                    <tr>
                        <th scope="row">Arrival Date</th>
                        <td>{this.state.arrivalDate}</td>
                    </tr>
                    <tr>
                        <th scope="row">Punctuality Rate</th>
                        <td>{this.state.punctualityRate}</td>
                    </tr>
                    <tr>
                        <th scope="row">Price</th>
                        <td>{this.state.price}</td>
                    </tr>
                    <tr>
                        <th scope="row">Special Price</th>
                        <td>{this.state.special_price}</td>
                    </tr>
                </tbody>
            </table>
        </div>)
    }
}