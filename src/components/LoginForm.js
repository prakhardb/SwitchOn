import React, { Component } from 'react'
import PropTypes from 'prop-types';
import axios from 'axios';
class LoginForm extends Component {
usernameRef = React.createRef();
passwordRef = React.createRef();
 handleClick = (event) =>{
     event.preventDefault();
    var apiBaseUrl = "http://localhost:3001/api/auth";
    console.log(this.usernameRef);
    axios.post(apiBaseUrl,{username : this.usernameRef.current.value,password : this.passwordRef.current.value})
    .then(response => {
        console.log(response.data.token);
        this.props.login(response.data.token);
        this.props.history.push('/parts');
    })
    .catch(function (error) {
    console.log(error);
    });
    }
render() {
    return (
      <div className="d-flex justify-content-center align-items-center container">	
	    <div className="row">
	    <h2><strong>Login </strong> <br/></h2><br/>
		  <div className="col-md-4 offset-md-4 text-center">
       <form onSubmit={this.handleClick}>
        <div className="form-group">
         <label>username</label>
         <input type="text" ref={this.usernameRef} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter username"/>
          </div>
         <div className="form-group">
          <label>Password</label>
          <input type="password" ref={this.passwordRef} className="form-control" name="password" id="password" placeholder="Password"/>
          </div>
         <div className="form-check">
          <button type="submit" className="btn btn-primary">Submit</button>
           </div>
          </form>
		    </div>
      	</div>
      </div>
    );
  }
}

LoginForm.propTypes = {
    login : PropTypes.func.isRequired
};

export default LoginForm;