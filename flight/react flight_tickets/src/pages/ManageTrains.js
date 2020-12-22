
import React, { Component } from 'react';
// import Pagination from "react-js-pagination";

export default class ManageTrain extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // activePage: 1,
            keyword: '',
            trains:[],
        }
        this.handleSearch = this.handleSearch.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.edit = this.edit.bind(this);
        console.log(props)
        
    }

    componentDidMount(){
        this.handleGetAll();
       
    }

    handleGetAll(){
        let trains = [{
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
        }, {
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
        }, {
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
        }];
        this.setState({trains})
    }

    // handlePageChange (pageNumber) {
    //     console.log(`active page is ${pageNumber}`);
    //     this.setState({ activePage: pageNumber });
    // }


    edit (id) {
        this.props.history.push('/edit/train/' + id)
    }

    handleDelete (id) {
        console.log(id)
    }

    handleSearch (e) {
        e.preventDefault();
        console.log(this.state.keyword)
    }

    render () {
        return (<div className="container" style={{background:'white',height:'100%'}}>
            <br/>
            <form className="form-inline" onSubmit={this.handleSearch}>
                <input className="form-control mr-sm-2" onChange={(e)=>{this.setState({keyword:e.target.value})}} type="search" placeholder="Search" aria-label="Search" style={{ paddingBottom: '10px' }} />
                <button className="btn btn-warning my-2 my-sm-0" type="submit">Search</button>
            </form>
            <br/>
            <table className="table table-striped ">
                <thead>
                    <tr>
                        <th scope="col">Flight Number</th>
                        <th scope="col">Departure City</th>
                        <th scope="col">Arrival City</th>
                        <th scope="col">Departure Date</th>
                        <th scope="col">Price</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.trains.map((e,index)=> <tr key={index}>
                        <th scope="row">{e.id}</th>
                        <td>{e.departure_cityName}</td>
                        <td>{e.arrival_cityName}</td>
                        <td>{e.departureDate}</td>
                        <td>${e.price}</td>
                        <td><button onClick={() => { this.edit(1) }} className="btn btn-warning btn-sm">Edit</button>
                        &nbsp;&nbsp;
                        <button onClick={() => { this.handleDelete(1) }} className="btn btn-danger btn-sm">Delete</button></td>
                    </tr>)
                    }
                
                </tbody>
            </table>
        </div>)
    }
}