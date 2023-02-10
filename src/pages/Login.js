import React, { useState } from "react";
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

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
    <form onSubmit={onFormSubmit} className="loginForm">
      <label htmlFor="email">Email</label>
      <input
        type="text"
        minLength={1}
        value={email}
        onChange={addEmail}
      ></input>
      <label htmlFor="password">Password</label>
      <input
        type={passwordShown ? "text" : "password"} 
        minLength={1}
        value={password}
        onChange={addPassword}
      ></input>
      <button type="button" onClick={showHidePassword}>Show/Hide Password</button>
      <section className="buttonGrid">  
        <button type="submit" value="Login">Login</button>
        <button type="button" onClick={routeChange}>Sign Up</button>
      </section>
    </form>
  );
};

export default Login;