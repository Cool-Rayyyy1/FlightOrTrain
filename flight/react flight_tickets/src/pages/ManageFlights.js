
import React, { Component } from 'react';
import Pagination from "react-js-pagination";

export default class ManageFlight extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activePage: 1,
            keyword: '',
            flights: [],
            display: [],
            search: [],
            totalItemsCount: 0,
        }
        this.handleSearch = this.handleSearch.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.edit = this.edit.bind(this);
        console.log(props)

    }

    async componentDidMount () {
        this.handleGetAll();

    }

    async handleGetAll () {
        let response = await fetch('http://localhost:8080/api/v1.0/plane')
        let data = await response.json();
        let flights = data.planes;

        this.setState({
            flights,
            display: flights.slice(0, 10),
            search: flights,
            totalItemsCount: flights.length
        })
    }

    handlePageChange (pageNumber) {
        console.log(`active page is ${pageNumber}`);
        this.setState({ activePage: pageNumber, display: this.state.search.slice((pageNumber -1) * 10, (pageNumber) * 10) });

    }

    edit (id) {
        this.props.history.push('/edit/flight/' + id)
    }

    async handleDelete (id) {
        console.log(id)
        const response = await fetch('http://localhost:8080/api/v1.0/plane/' + id, {
            method: 'DELETE',

        })
        if(response.ok){
            let flights = this.state.flights.filter((f)=>
                f.flightId !== id
            );
            this.setState({
                flights,
                display: flights.slice(0, 10),
                search: flights,
                totalItemsCount: flights.length
            })
        }
    }

    handleSearch (event) {
        // e.preventDefault();
        // console.log(this.state.flights.filter(e => e.flightNumber.toLowerCase().includes(e.target.value.toLowerCase())))
        let data = this.state.flights.filter(e => e.flightNumber.toLowerCase().includes(event.target.value.toLowerCase()));
        this.setState({
            search: data,
            activePage: 1,
            totalItemsCount: data.length,
            display: data.slice(0, 10)
        })
    }

    render () {
        return (<div className="container" style={{ background: 'white' }}>
            <br />
            <form className="form-inline" >
                <input className="form-control mr-sm-2" onChange={(e) => { this.handleSearch(e) }} type="search" placeholder="Search" aria-label="Search Flight Number" style={{ paddingBottom: '10px' }} />
                {/* <button className="btn btn-warning my-2 my-sm-0" type="submit">Search</button> */}
            </form>
            <br />
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
                        this.state.display.map((e, index) => <tr key={index}>
                            <th scope="row">{e.flightNumber}</th>
                            <td>{e.departure_cityName}</td>
                            <td>{e.arrival_cityName}</td>
                            <td>{e.departureDate}</td>
                            <td>${e.price}</td>
                            <td><button onClick={(event) => { this.edit(e.flightId) }} className="btn btn-warning btn-sm">Edit</button>
                        &nbsp;&nbsp;
                        <button onClick={(event) => { this.handleDelete(e.flightId) }} className="btn btn-danger btn-sm">Delete</button></td>
                        </tr>)
                    }

                </tbody>
            </table>
            <Pagination
                activePage={this.state.activePage}
                itemsCountPerPage={10}
                totalItemsCount={this.state.totalItemsCount}
                pageRangeDisplayed={10}
                onChange={this.handlePageChange.bind(this)}
            />
        </div>)
    }
}