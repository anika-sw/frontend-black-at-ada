import React, { useState } from "react";
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from "react-router-dom";
import axios from 'axios';


const kBaseUrl = 'http://localhost:5000';


const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);


  const { login } = useAuth();

  const addEmail = (event) => {
    setEmail(event.target.value);
  };

  const addPassword = (event) => {
    setPassword(event.target.value);
  };

  const navigate = useNavigate();
  const routeChange = (event) => {
    navigate('/signup')
  };

  const authUser = async (requestBody) => {
    await axios.post(`${kBaseUrl}/login`, requestBody)
    .then(response => {
      console.log("Response:", response.data);
      login(response.data);
    })
    .catch(error => {
      console.log(error);
    });
  };

  const togglePassword = () => {
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    setPasswordShown(!passwordShown);
  };


  const onFormSubmit = (event) => {
    event.preventDefault();
    const loginRequest = { email, password }
    authUser(loginRequest);
  };


  return (
    <div>
      <form onSubmit={onFormSubmit} className="loginForm">
        <label htmlFor="email">Email</label>
        <input
          type="text"
          minLength={1}
          value={email}
          className={!email ? "error" : ""}
          onChange={addEmail}
        ></input>
        <label htmlFor="password">Password</label>
        <input
          type={passwordShown ? "text" : "password"} 
          minLength={1}
          value={password}
          className={!email ? "error" : ""}
          onChange={addPassword}
        ></input>
        <button type="button" onClick={togglePassword}>Show Password</button>
        <section className="buttonGrid">  
          <button type="submit" value="Login">Login</button>
          <button type="button" onClick={routeChange}>Sign Up</button>
        </section>
      </form>
    </div>
  );
};

export default Login;