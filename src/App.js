import React, { Component } from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import LoginForm from './components/LoginForm';
import './App.css';
import axios from 'axios';
import SimpleChart from './components/SimpleChart';

const setAuthorizationHeader = (token = null) => {
  if(token){
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
  else {
    delete axios.defaults.headers.common.Authorization;
  }
}

class App extends Component {

  state = {
    user : {
      token : null
    },
    data : []
  };

  login = token => {
    this.setState( {user: {token}});
    localStorage.tokenstore = token;
    setAuthorizationHeader(token);
  };

  componentWillUnmount() {
    this.setState({user: {token: null}});
    
  };

  componentWillMount() {
    axios.get('http://localhost:3001/api/parts')
    .then(res => this.setState({data: res.data}));
    localStorage.removeItem('tokenstore');
  }
componentDidMount(){
  if(localStorage.tokenstore){
    this.setState({user: {token:localStorage.tokenstore}});
    setAuthorizationHeader(localStorage.tokenstore);
  }
}

  render() {
    return (
        <BrowserRouter>
    <Switch>
        <Route exact path="/" render={(props) => <LoginForm {...props} login={this.login} />} />
        <Route path="/parts" render={(props)=> <SimpleChart {...props} data={this.state.data} />} />
    </Switch>
    </BrowserRouter>
    );
  }
}

export default App;
