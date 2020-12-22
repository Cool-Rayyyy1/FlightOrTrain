import React, { Component, Fragment } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link, Redirect
} from "react-router-dom";
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import ManageFlights from './pages/ManageFlights';
// import ManageTrains from './pages/ManageTrains';
import Edit from './pages/Edit';
import Add from './pages/Add';
import Landing from './pages/Landing';
import FlightDetail from './pages/FlightDetail';
import TrainDetail from './pages/TrainDetail';

function PrivateRoute ({ component: Component, authed, user, ...rest }) {
  console.log(user, authed)
  return (
    <Route
      {...rest}
      render={(props) => authed
        ? <Component {...props} user={user} {...rest} />
        : <Redirect to={{ pathname: '/', state: { from: props.location } }} />}
    />
  )
}

class App extends Component {

  constructor() {
    super()
    this.state = {
      user: null,
      authed: false,
    }
    this.setUser = this.setUser.bind(this)
  }

  setUser (user) {
    this.setState({
      user,
      authed: true
    })
  }

  render () {
    return (
      <div className="App">
        <Router>
          {/* <div> */}
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="!#" onClick={(e) => e.preventDefault()}>Navbar</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div className="navbar-nav">
                {/* <Link className="nav-item nav-link" to="/">Home</Link> */}
                {
                  // !this.state.user ? <Link className="nav-item nav-link" to="/login">Login</Link> : ''
                  !this.state.user ? <Link className="nav-item nav-link" to="/">Home</Link> : ''
                }
                {
                  this.state.user && this.state.user.admin ?
                    (<Fragment><Link className="nav-item nav-link" to="/manageflights">Manage Flights</Link>
                      {/* <Link className="nav-item nav-link" to="/managetrains">Manage Trains</Link> */}
                      <Link className="nav-item nav-link" to="/add">Add Flight</Link>
                      <a className="nav-item nav-link" href="!#" onClick={(e) => { e.preventDefault(); this.setState({ user: null, authed: false }); }}>Log out </a>
                    </Fragment>) : ''
                }
              </div>
            </div>
          </nav>

          <Switch>

            <Route path="/manageflights" >
              <PrivateRoute authed={this.state.authed} user={this.state.user} setUser={this.setUser} component={ManageFlights}></PrivateRoute>
            </Route>
            
            {/* <Route path="/managetrains" >
              <PrivateRoute authed={this.state.authed} user={this.state.user} setUser={this.setUser} component={ManageTrains}></PrivateRoute>
            </Route> */}
            <Route path="/add" >
              <PrivateRoute authed={this.state.authed} user={this.state.user} setUser={this.setUser} component={Add}></PrivateRoute>
            </Route>
            <Route path="/edit/flight/:id" >
              <PrivateRoute authed={this.state.authed} user={this.state.user} setUser={this.setUser} component={Edit}></PrivateRoute>
            </Route>
            {/* <Route path="/edit/trains/:id" >
              <PrivateRoute authed={this.state.authed} user={this.state.user} setUser={this.setUser} component={Edit}></PrivateRoute>
            </Route> */}
            <Route path="/flight/detail/:id" render={props => <FlightDetail  {...props}></FlightDetail>}>
              
            </Route>
            <Route path="/train/detail/:id" render={props => <TrainDetail  {...props}></TrainDetail>}>
              
            </Route>
            <Route path="/Login" render={props => <Login  {...props} setUser={this.setUser}></Login>}>

            </Route>
            <Route path="/search" render={props => <Home {...props} />}>

            </Route>
            <Route path="/" render={props => <Landing  {...props} ></Landing>}>

            </Route>

          </Switch>
          {/* </div> */}
        </Router>
      </div>
    );
  }

}


export default App;
