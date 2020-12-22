
import React, { Component } from 'react';

export default class TrainDetail extends Component {

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

    componentDidMount () {
        const id = this.props.match.params.id;
        console.log(id)
        this.setState({
            id: '3U89712',
            airlineName: '四川航空',
            flightNumber: '3U8971',
            departure_cityName: '重庆',
            departure_airportName: '江北国际机场',
            arrival_cityName: '上海',
            arrival_airportName: '浦东国际机场',
            departureDate: '2020-07-23 07:20:00',
            arrivalDate: '2020-07-23 09:40:00',
            punctualityRate: '83',
            price: '670',
            special_price: '1190'
        })
    }




    render () {
        return (<div className="container" style={{ background: 'white', minHeight: '100%' }}>
            <a href="!#" onClick={(e) => { e.preventDefault(); this.props.history.goBack() }}>Back</a>

            <h3 >ID {this.state.id}</h3>

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