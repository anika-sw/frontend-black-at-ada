import React, { useState } from "react";
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "../styles/Login.css";

const kBaseUrl = 'http://localhost:5000';


const Login = () => {

  const { login } = useAuth();

  const navigate = useNavigate();
  const routeChange = (event) => {
    navigate('/signup')
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);

  const addEmail = (event) => {
    setEmail(event.target.value);
  };

  const addPassword = (event) => {
    setPassword(event.target.value);
  };

  const authUser = async (requestBody) => {
    await axios.post(`${kBaseUrl}/login`, requestBody)
      .then(response => {
        if (Number.isInteger(response.data)) {
          login(response.data);
        } else {
          console.log(response.data);
          return response.data;
        }
      }
    )
      .catch(error => {
        console.log(error);
      }
    );
  };

  const showHidePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const onFormSubmit = (event) => {
    event.preventDefault();
    const loginRequest = { email, password }
    authUser(loginRequest);
  };


  return (
    <>
      <div className="login-header">
        <p>Now Entering...</p>
        <h1>Black<span className="at">@</span>Ada</h1>
        <p className="sm-text">A virtual gathering space for Ada Developer Academy's Black Students and alum</p>
      </div>
      <div className="login-flex">
        <form onSubmit={onFormSubmit} className="loginForm">
          <div className="form-row form-inline">
            <div className="col">
              <input
                type="email"
                className="form-control"
                id="email"
                aria-describedby="email"
                placeholder="Email"
                minLength={1}
                value={email}
                onChange={addEmail}
              ></input>
            </div>
            <div className="col">        
              <input
                type={passwordShown ? "text" : "password"}
                className="form-control"
                id="password"
                aria-describedby="password" 
                placeholder="Password"
                minLength={1}
                value={password}
                onChange={addPassword}
              ></input>
              <button type="button" className="btn btn-sm btn-secondary password-toggle" onClick={showHidePassword}>Show/Hide Password</button>
            </div>
          </div>
          <div className="btn-container">
            <button type="submit" className="btn login-btn">Login</button>
            <button type="button" className="btn login-btn" onClick={routeChange}>Sign Up</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;