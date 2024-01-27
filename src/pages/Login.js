import React, { useState } from "react";
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { TextField, InputAdornment, IconButton, Button, FormControlLabel, Checkbox, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import "../styles/Login.css";
import "../fonts/DressCode-Medium.ttf"

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
        <h1>Black<span className="at">@</span>Ada</h1>
        <p className="sub-heading">A virtual gathering space for Ada Developers Academy's Black students and alum</p>
      </div>
      <div className="login-container">
        <div className="grid-side-empty">
        </div>
        <form onSubmit={onFormSubmit}>
          <div className="text-input-flex">
            <>
              <TextField 
                required
                margin='normal'
                label="Email"
                className="email" 
                id="email"
                type="email"
                aria-describedby="email"
                variant="filled"
                minLength={1}
                value={email}
                onChange={addEmail}
                InputLabelProps={{
                  sx: { minWidth: '100%' }
                }}>
              </TextField>
            </>
            <>
              <TextField
                required 
                margin='normal'
                label="Password" 
                className="password"
                id="password" 
                type={passwordShown ? "text" : "password"}
                aria-describedby="password" 
                variant='filled'
                minLength={1}
                value={password}
                onChange={addPassword}
                InputLabelProps={{
                  sx: { minWidth: '100%' }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={showHidePassword}
                      >
                        {passwordShown ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}>
              </TextField>
            </>
            <div>
              <FormControlLabel 
                control={
                  <Checkbox 
                    sx={{
                      color: "white",
                    }}/>
                  } 
                label={
                  <Typography sx={{ fontFamily: 'Poppins', color: '#f7b402' }}>
                    Keep me logged in
                  </Typography>
                }
                id="checkbox">
              </FormControlLabel>
            </div>
            <div>
              <Button 
                fullWidth
                type="submit"
                variant="contained"
                sx={{
                  color: 'black',
                  fontSize: '20px',
                }}>
                  Log in
              </Button>
            </div>
          </div>
          <div className="tiny-text-container">
            <span>Forgot password?</span>
            <span onClick={routeChange}>New member? Register</span>
          </div>
        </form>
        <div className="grid-side-empty">
        </div>
      </div>
    </>
  );
};

export default Login;