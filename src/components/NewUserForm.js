import React, { useState } from "react";
import AutocompleteAddressBar from  "../components/AutocompleteAddressBar";
import PropTypes from 'prop-types';
import "../styles/NewForms.css";

const NewUserForm = (props) => {
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cohort, setCohort] = useState("");
  //look up what validation needs to happen with this, how to use autocomplete
  const [location, setLocation] = useState({
    locationName: "",
    locationLat: "",
    locationLon:""
  }); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [salary, setSalary] = useState("");
  const [yearsExperience, setYearsExperience] = useState("Less than 1");
  const [userLastUpdated, setUserLastUpdated] = useState("");

  console.log(yearsExperience)
  
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

  const addCompany = (event) => {
      setCompany(event.target.value);
    };
  const addLinkedIn = (event) => {
      setLinkedIn(event.target.value);
    };
  const addJobTitle = (event) => {
      setJobTitle(event.target.value);
    };
  const addSalary = (event) => {
      setSalary(event.target.value);
    };
  const addYearsExperience = (event) => {
    if (yearsExperience !== event.target.value) {
      setYearsExperience((yearsExperience) => event.target.value);
    }
  };

  const addUserLastUpdated = (event) => {
      setUserLastUpdated(event.target.value);
    };

  const onFormSubmit = (event) => {
    event.preventDefault();
    props.addNewUser({ firstName, lastName, cohort, location, email, password, userLastUpdated });
  };

  return (
    <form onSubmit={onFormSubmit} className="newUserForm">
      <label htmlFor="firstName">First Name</label>
      <input
        type="text"
        minLength={1}
        maxLength={30}
        value={firstName}
        className={!firstName ? "error" : ""}
        onChange={addFirstName}
      ></input>
      <br />
      <br />
      <label htmlFor="lastName">Last Name</label>
      <input
        type="text"
        minLength={1}
        maxLength={30}
        value={lastName}
        className={!lastName ? "error" : ""}
        onChange={addLastName}
      ></input>
      <br />
      <br />
      <label htmlFor="cohort">Cohort</label>
      <input
        type="text"
        minLength={1}
        maxLength={3}
        value={cohort}
        className={!cohort ? "error" : ""}
        onChange={addCohort}
      ></input>
      <br />
      <br />
      <label htmlFor="location">Location (Enter your current city and state/country, zip code, or post code)</label>
      <AutocompleteAddressBar />
      <br />
      <br />
      <label htmlFor="email">Email</label>
      <input
        type="text"
        minLength={1}
        maxLength={30}
        value={email}
        className={!email ? "error" : ""}
        onChange={addEmail}
      ></input>
      <br />
      <br />
      <label htmlFor="password">Password</label>
      <input
        type="text"
        minLength={1}
        maxLength={15}
        value={password}
        className={!password ? "error" : ""}
        onChange={addPassword}
      ></input>
      <br />
      <br />
      <label htmlFor="company">Company</label>
      <input
        type="text"
        minLength={1}
        maxLength={30}
        value={company}
        onChange={addCompany}
      ></input>
      <br />
      <br />
      <label htmlFor="linkedIn">Your LinkedIn Profile URL</label>
      <input
        type="text"
        minLength={1}
        maxLength={60}
        value={linkedIn}
        onChange={addLinkedIn}
      ></input>
      <br />
      <br />
      <label htmlFor="jobTitle">Your Job Title</label>
      <input
        type="text"
        minLength={1}
        maxLength={30}
        value={jobTitle}
        onChange={addJobTitle}
      ></input>
      <br />
      <br />
      <label htmlFor="salary">Annual Salary</label>
      <input
        type="text"
        minLength={1}
        maxLength={60}
        value={salary}
        onChange={addSalary}
      ></input>
      <br />
      <br />
      <label htmlFor="input">Years of Experience:
        <select className="experience" onChange={addYearsExperience}>
          <option className="experience" value="Less than 1">Less than 1</option>
          <option className="experience" value="1 - 3">1 - 3</option>
          <option className="experience" value="3 - 5">3 - 5</option>
          <option className="experience" value="5 - 10">5 - 10</option>
          <option className="experience" value="10+">10+</option>
        </select>
      </label>
      <br />
      <br />
      <input
        type="text"
        value={userLastUpdated}
        onChange={setUserLastUpdated}
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