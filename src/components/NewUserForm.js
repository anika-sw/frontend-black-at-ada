import React, { useState } from "react";
import axios from 'axios';
import AutocompleteAddressBar from  "../components/AutocompleteAddressBar";
import  { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import "../styles/NewForms.css";

const kBaseUrl = 'http://localhost:5000';

const addNewUserToApi = (jsUser) => {
  const {firstName, lastName, locationName, locationLat, locationLng, jobTitle, yearsExperience, ...rest} = jsUser;
  const apiUser = {first_name: firstName, last_name: lastName, location_name: locationName, location_lat: locationLat, location_lng: locationLng, job_title: jobTitle, years_experience: yearsExperience, ...rest};
  console.log('api', apiUser);
  const requestBody = {...apiUser};
  // console.log(requestBody);

  axios.post(`${kBaseUrl}/users`, requestBody)
    .then(response => {
      console.log("Response:", response.data);
      // return convertFromApi(response.data);
    })
    .catch(error => {
      console.log(error);
    });
  };

const NewUserForm = () => {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cohort, setCohort] = useState("");
  const [locationName, setLocationName] = useState('') 
  const [locationLat, setLocationLat] = useState('')
  const [locationLng, setLocationLng] = useState('')
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [linkedin, setlinkedin] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [salary, setSalary] = useState(null);
  const [yearsExperience, setYearsExperience] = useState("N/A");


  const handleSelect = (location) => {
    geocodeByAddress(location)
    .then(results => getLatLng(results[0]))
    .then(latLng => {
      console.log('Success', latLng);
      setLocationName(location);
      const latStr = latLng['lat'].toString();
      const lngStr = latLng['lng'].toString();
      setLocationLat(latStr);
      setLocationLng(lngStr);
    })
    .catch(error => console.error('Error', error));
  };
  
  const addFirstName = (event) => {
    setFirstName(event.target.value);
  };
  
  const addLastName = (event) => {
      setLastName(event.target.value);
    };

  const addCohort = (event) => {
      const cohortInt = parseInt(event.target.value);
      setCohort(cohortInt);
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
  const addLinkedin = (event) => {
      setlinkedin(event.target.value);
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

  // const createUser = (user) => {
  //   console.log(user);
  //   axios
  //     .post(
  //       "http://localhost:5000/users", user
  //     )
  //     .then((response) => {
  //       console.log("Response:", response.data.users);
  //       // setUsersData(users);
  //     })
  //     .catch((error) => {
  //       console.log("Error:", error);
  //       alert("Error creating profile");
  //   });
  // };

  // const onFormSubmit = (data) => {
  //   addNewUserApi(data)
  //     .then(newUser => {
  //       setUserData([...userData, newUser])
  //     })
  //     .catch(e => console.log(e));
  // }

  const onFormSubmit = (event) => {
    event.preventDefault();
    addNewUserToApi({ 
      firstName, 
      lastName, 
      cohort, 
      locationName,
      locationLat,
      locationLng,
      email,
      password,
      company,
      linkedin,
      jobTitle,
      salary,
      yearsExperience
    });
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
      <AutocompleteAddressBar 
      selectLocation={handleSelect}/>
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
      <label htmlFor="linkedin">Your linkedin Profile URL</label>
      <input
        type="text"
        minLength={1}
        maxLength={60}
        value={linkedin}
        onChange={addLinkedin}
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
          <option className="experience" value="N/A">N/A</option>
          <option className="experience" value="< 1">&lt;  1</option>
          <option className="experience" value="1 - 3">1 - 3</option>
          <option className="experience" value="3 - 5">3 - 5</option>
          <option className="experience" value="5 - 10">5 - 10</option>
          <option className="experience" value="10+">10+</option>
        </select>
      </label>
      <br />
      <br />
      <section className="buttonGrid">  
        <input
          type="submit"
          value="Sign Up"
          className="button"
          disabled={!firstName || !lastName || !cohort || !email || !password}
        ></input>
      </section>
    </form>
  );
};

export default NewUserForm;