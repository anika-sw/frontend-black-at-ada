import React, { useState, useEffect, useNavigate } from "react";
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import AutocompleteAddressBar from "./AutocompleteAddressBar";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import "../styles/NewForms.css";

const kBaseUrl = 'http://localhost:5000';


const UpdateUser = (props) => {

  // const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [tempUserData, setTempUserData] = useState({});
  const [password, setPassword] = useState();

  const user = localStorage.getItem('user')

  const { logout } = useAuth();

  const updateUserInApi = (jsUser) => {
    const {firstName, lastName, locationName, locationLat, locationLng, includeNameSalary, jobTitle, yearsExperience, ...rest} = jsUser;
    const apiUser = {first_name: firstName, last_name: lastName, location_name: locationName, location_lat: locationLat, location_lng: locationLng, include_name_salary: includeNameSalary, job_title: jobTitle, years_experience: yearsExperience, ...rest};
    // console.log(apiUser);
    const requestBody = {...apiUser};
    axios.patch(`${kBaseUrl}/users/${user}`, requestBody)
      .then(response => {
        console.log("Response:", response.data);
        return convertFromApi(response.data);
      })
      .catch(error => {
        console.log(error);
      });
    };

  const convertFromApi = (apiUser) => {
		const { first_name, last_name, location_name, location_lat, location_lng, include_name_salary, job_title, years_experience, ...rest } = apiUser;
		const jsUser = {firstName: first_name, lastName: last_name, locationName: location_name, locationLat: location_lat, locationLng: location_lng, includeNameSalary: include_name_salary, jobTitle: job_title, yearsExperience: years_experience, ...rest };
    return jsUser;
	};

  useEffect(() => {
    axios
      .get(`${kBaseUrl}/users/${user}`, {})
      .then((response) => {
        const convertedData = convertFromApi(response.data.user);
        setUserData(convertedData);
        setTempUserData(convertedData);
        });
  }, [user]);

  const deleteUser = () => {
    axios
      .delete(`${kBaseUrl}/users/${userData.id}`)
      .then(response => {
        console.log("Response:", response.data);
        logout();
      })
      .catch(error => {
        console.log(error);
      });
  };


  // const [yearsExperience, setYearsExperience] = useState("N/A");
  // const [includeNameSalary, setIncludeNameSalary] = useState("No");


  const handleSelect = (location) => {
    geocodeByAddress(location)
    .then(results => getLatLng(results[0]))
    .then(latLng => {
      console.log('Success', latLng);
      const latStr = latLng['lat'].toString();
      const lngStr = latLng['lng'].toString();
      setTempUserData({
        ...tempUserData, locationName: location, locationLat: latStr, locationLng: lngStr})
      })
    .catch(error => console.error('Error', error));
  };


  const changePassword = (event) => {
    // setPassword(event.target.value)
    setTempUserData({password: event.target.value})
    }

  const onRadioSelection = (event) => {
    if (tempUserData.includeNameSalary !== event.target.value) {
      setTempUserData({
        ...tempUserData, includeNameSalary: event.target.value})
      }}



  const onFormSubmit = (event) => {
    event.preventDefault();
    updateUserInApi(tempUserData);
    // console.log(tempUserData);
  };

	return (
    <div>
      <form className="newUserForm" onSubmit={onFormSubmit}>
        <h1>Your Information</h1>
        <p>All fields marked with an * are required. Your name, pronouns (if provided), cohort, LinkedIn link (if provided), email, and picture will be posted in the Black Adie Directory.</p>
        <label htmlFor="firstName">*First Name</label>
        <input
          type="text"
          minLength={1}
          maxLength={30}
          value={tempUserData.firstName}
          // className={!firstName ? "error" : ""}
          onChange={(event) => {
            setTempUserData({
              ...tempUserData, firstName: event.target.value})
            }}
        ></input>
        <br />
        <br />
        <label htmlFor="lastName">*Last Name</label>
        <input
          type="text"
          minLength={1}
          maxLength={30}
          value={tempUserData.lastName}
          // className={!lastName ? "error" : ""}
          onChange={(event) => {
            setTempUserData({
              ...tempUserData, lastName: event.target.value})
            }}
        ></input>
        <br />
        <br />
        <label htmlFor="pronouns">Pronouns</label>
        <input
          type="text"
          minLength={1}
          maxLength={30}
          value={tempUserData.pronouns || ''}
          onChange={(event) => {
            setTempUserData({
              ...tempUserData, pronouns: event.target.value})
            }}
        ></input>
        <br />
        <br />
        <label htmlFor="cohort">*Cohort</label>
        <input
          type="text"
          minLength={1}
          maxLength={3}
          value={tempUserData.cohort}
          // className={!cohort ? "error" : ""}
          onChange={(event) => {
            setTempUserData({
              ...tempUserData, cohort: event.target.value})
            }}
        ></input>
        <br />
        <br />
        <label htmlFor="location">*Location (saved): {userData.locationName}</label>
        <br />
        <label htmlFor="location">
          New Location (Enter your current city and state/country, zip code,
          or post code)
        </label>
        <AutocompleteAddressBar selectLocation={handleSelect}/>
        <br />
        <br />
        <label htmlFor="linkedin">LinkedIn Profile URL</label>
        <input
          type="text"
          minLength={1}
          maxLength={60}
          value={tempUserData.linkedin || ''}
          onChange={(event) => {
            setTempUserData({
              ...tempUserData, linkedin: event.target.value})
            }}
        ></input>
        <br />
        <br />
        <label htmlFor="email">*Email</label>
        <input
          type="text"
          minLength={1}
          maxLength={30}
          value={tempUserData.email}
          // className={!email ? "error" : ""}
          onChange={(event)=> {
            setTempUserData({
              ...tempUserData, email: event.target.value})
            }}
        ></input>
        <br />
        <br />
        <label htmlFor="password">*Password</label>
        <p>Change Password</p>
        <input
          type="text"
          minLength={8}
          maxLength={15}
          value={password}
          // className={!password ? "error" : ""}
          onChange={changePassword}
          placeholder={"Enter a new password"}
        ></input>
        <br />
        <br />
        {/* <div>
        <h2>Upload A Profile Picture</h2>
        {profilePic && (
          <div>
          <img alt="Not found" width={"250px"} src={URL.createObjectURL(profilePic)} />
          <br />
          <button onClick={()=>setProfilePic((profilePic) => null)}>Remove</button>
          </div>
        )}
        <br />
        <br />
        <input
          type="file"
          className="profilePic"
          onChange={(event) => {
            setProfilePic(event.target.files[0]);
          }}
        />
        </div> */}
        <h2>Company & Salary Information</h2>
        <p>Providing information about your current company and salary can be very helpful for our community. By default, company and salary information will be posted anonmously unless otherwise indicated.</p>
        <br />
        <label htmlFor="company">Company</label>
        <input
          type="text"
          minLength={1}
          maxLength={30}
          value={tempUserData.company || ''}
          onChange={(event) => {
            setTempUserData({
              ...tempUserData, company: event.target.value})
            }}
        ></input>
        <br />
        <br />
        <label htmlFor="jobTitle">Job Title</label>
        <input
          type="text"
          minLength={1}
          maxLength={30}
          value={tempUserData.jobTitle || ''}
          onChange={(event) => {
            setTempUserData({
              ...tempUserData, jobTitle: event.target.value})
            }}
        ></input>
        <br />
        <br />
        <label htmlFor="salary">Annual Salary</label>
        <input
          type="text"
          minLength={1}
          maxLength={60}
          value={tempUserData.salary || ""}
          onChange={(event) => {
            setTempUserData({
              ...tempUserData, salary: event.target.value})
            }}
        ></input>
        <br />
        <br />
        <p>Years of Experience (saved): {tempUserData.yearsExperience}</p>
        <label htmlFor="input">
          Years of Experience:
          <select className="experience" >
            <option className="experience" value="N/A">
              N/A
            </option>
            <option className="experience" value="< 1">
              &lt; 1
            </option>
            <option className="experience" value="1 - 3">
              1 - 3
            </option>
            <option className="experience" value="3 - 5">
              3 - 5
            </option>
            <option className="experience" value="5 - 10">
              5 - 10
            </option>
            <option className="experience" value="10+">
              10+
            </option>
          </select>
        </label>
        <br />
        <br />
        <input
          type="radio"
          className="includeName"
          value="No"
          checked={tempUserData.includeNameSalary === "No"}
          onChange={onRadioSelection}
        ></input>
        <label htmlFor="no"> No, do not include my name with my salary post.</label>
        <br />
        <input
          type="radio"
          className="includeName"
          value="Yes"
          checked={tempUserData.includeNameSalary === "Yes"}
          onChange={onRadioSelection}
        />
        <label htmlFor="yes"> Yes, include my name with my salary post.</label>
        <br />
        <br />
        <br />
        <section className="buttonGrid">
          <input
            type="submit"
            value="Update Profile"
            className="button"
          ></input>
        </section>
      </form>
      <button type='button' onClick={deleteUser}>Delete Profile</button>
    </div>
	);
};

export default UpdateUser;
