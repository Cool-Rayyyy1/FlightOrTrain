
import React, { Component } from 'react';
import './Login.css'
export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            error: ''
        }
        // this.history = useHistory();
        this.handleLogin.bind(this);
    }

    handleLogin (e) {
        e.preventDefault();
        this.setState({ error: '' })
        fetch('http://localhost:8080/')
        if (this.state.username === 'admin'
            && this.state.password === 'admin') {
            this.props.setUser({ username: this.state.username, admin: true })
            this.props.history.push("/manageflights");
            return;
        } else {
            this.setState({ error: 'Authtication Error' })
        }
    }

    render () {
        return (<div className="container " style={{ marginTop: '5%' }}>
            <div className="row">
                <div className="col-md-3"></div>
                <div className="col-md-6 login-form">
                    <h3>Login</h3>
                    <form onSubmit={(e) => { this.handleLogin(e) }}>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Your Username" onChange={(e) => this.setState({ username: e.target.value })} value={this.state.username} />
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control" placeholder="Your Password" onChange={(e) => this.setState({ password: e.target.value })} value={this.state.password} />
                        </div>
                        <div className="form-group">
                            <input type="submit" className="btnSubmit" value="Login" />
                        </div>
                    </form>
                </div>

            </div>
            {
                this.state.error!==''? <div class="alert alert-primary" role="alert">
                {this.state.error}
            </div>:''
            }
           
        </div>)
    }
}