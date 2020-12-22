
import React, { Component } from 'react';

export default class Landing extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render () {
        return (<div className="container " style={{ marginTop: '15%', justifyItems: "center",alignItems:'center' }}>
            <div className="row ">
                
                <div className="col-md-6" style={{textAlign:"center"}}>
                    <div style={{padding:"2.5rem 5rem",width:"300px", fontSize:'25px',color:'white'}}  onClick={() => this.props.history.push('/Login')} className="btn btn-secondary btn-lg" > Admin</div>
                </div>
                <div className="col-md-6 " style={{textAlign:"center"}}>
                    <div style={{padding:"2.5rem 5rem",width:"300px", fontSize:'25px',color:'white'}} onClick={() => this.props.history.push('/search')} className="btn btn-secondary btn-lg" > Passenger</div>
                </div>
            </div>
        </div>)
    }
}