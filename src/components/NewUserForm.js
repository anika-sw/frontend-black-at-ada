import React, { useState } from "react";
import PropTypes from 'prop-types';
import "../styles/NewForms.css";

const NewUserForm = (props) => {
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cohort, setCohort] = useState("");
  const [location, setLocation] = useState(""); //look up what validation needs to happen with this
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const addFirstName = (event) => {
    setFirstName(event.target.value);
  };
  
  const addLastName = (event) => {
      setLastName(event.target.value);
    };

  const addCohort = (event) => {
      setCohort(event.target.value);
    };

  const addLocation = (event) => {
      setLocation(event.target.value);
    };

  const addEmail = (event) => {
      setEmail(event.target.value);
    };

  const addPassword = (event) => {
      setPassword(event.target.value);
    };

  const onFormSubmit = (event) => {
    event.preventDefault();
    props.addNewUser({ firstName, lastName, cohort, location, email, password });
  };

  return (
    <form onSubmit={onFormSubmit} className="newUserForm">
      <label htmlFor="firstName">First Name</label>
      <br />
      <input
        type="text"
        minLength={1}
        maxLength={40}
        value={firstName}
        className={!firstName ? "error" : ""}
        onChange={addFirstName}
      ></input>
      <br />
      <br />
      <label htmlFor="lastName">Last Name</label>
      <br />
      <input
        type="text"
        minLength={1}
        maxLength={40}
        value={lastName}
        className={!lastName ? "error" : ""}
        onChange={addLastName}
      ></input>
      <label htmlFor="cohort">Cohort</label>
      <br />
      <input
        type="text"
        minLength={1}
        maxLength={40}
        value={cohort}
        className={!cohort ? "error" : ""}
        onChange={addCohort}
      ></input>
      <br />
      <br />
      <label htmlFor="location">Location</label>
      <br />
      <input
        type="text"
        minLength={1}
        maxLength={60}
        value={location}
        className={!location ? "error" : ""}
        onChange={addLocation}
      ></input>
      <label htmlFor="email">Email</label>
      <br />
      <input
        type="text"
        minLength={1}
        maxLength={40}
        value={email}
        className={!email ? "error" : ""}
        onChange={addEmail}
      ></input>
      <br />
      <br />
      <label htmlFor="password">Password</label>
      <br />
      <input
        type="text"
        minLength={1}
        maxLength={60}
        value={password}
        className={!password ? "error" : ""}
        onChange={addPassword}
      ></input>
      <section className="buttonGrid">  
        <input
          type="submit"
          value="Sign Up"
          className="button"
          disabled={!firstName || !lastName || !cohort || !location || !email || !password}
        ></input>
      </section>
    </form>
  );
};

NewUserForm.propTypes = {
  addNewUser: PropTypes.func
};

export default NewUserForm;