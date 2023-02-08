import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import AutocompleteAddressBar from  "../components/AutocompleteAddressBar";
import  { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import ImagePreview from './components/ImagePreview';
import "../styles/NewForms.css";

const kBaseUrl = 'http://localhost:5000';
const BASE_URL = 'http://localhost:4000';



const NewUserForm = () => {

  const navigate = useNavigate();
  const routeChange = () => {
    navigate('/home')
  };

  const [userData, setUserData] = useState({});

  const [ada, setAda] = useState(false);
  const [black, setBlack] = useState(false);

  const checkHandler = (event) => {
    if (event.target.id === 'ada') {
      setAda((ada) => !ada);
    } else if (event.target.id === 'black') {
      setBlack((black) => !black);
    }
  };

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [cohort, setCohort] = useState("");
  const [locationName, setLocationName] = useState('') 
  const [locationLat, setLocationLat] = useState('')
  const [locationLng, setLocationLng] = useState('')
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [company, setCompany] = useState("");
  const [linkedin, setlinkedin] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [salary, setSalary] = useState(null);
  const [yearsExperience, setYearsExperience] = useState("N/A");
  const [includeNameSalary, setIncludeNameSalary] = useState("No");

  const addNewUserToApi = (jsUser) => {
    const {firstName, lastName, locationName, locationLat, locationLng, profilePicUrl, includeNameSalary, jobTitle, yearsExperience, ...rest} = jsUser;
    const apiUser = {first_name: firstName, last_name: lastName, location_name: locationName, location_lat: locationLat, location_lng: locationLng, profile_pic_url: profilePicUrl, include_name_salary: includeNameSalary, job_title: jobTitle, years_experience: yearsExperience, ...rest};
    console.log(apiUser);
    const requestBody = {...apiUser};
    axios.post(`${kBaseUrl}/signup`, requestBody)
      .then(response => {
        console.log("Response:", response.data);
        // return convertFromApi(response.data);
        // do something here to push to directory
      })
      .catch(error => {
        console.log(error);
      });
    };
  
  const addFirstName = (event) => {
    setFirstName(event.target.value);
  };
  
  const addLastName = (event) => {
      setLastName(event.target.value);
    };

  const addPronouns = (event) => {
      setPronouns(event.target.value);
    };

  const addCohort = (event) => {
      const cohortInt = parseInt(event.target.value);
      setCohort(cohortInt);
    };

  const addLocation = (locationName) => {
    geocodeByAddress(locationName)
    .then(results => getLatLng(results[0]))
    .then(latLng => {
      console.log('Success', latLng);
      setLocationName(locationName);
      const latStr = latLng['lat'].toString();
      const lngStr = latLng['lng'].toString();
      setLocationLat(latStr);
      setLocationLng(lngStr);
    })
    .catch(error => console.error('Error', error));
    };

  const addEmail = (event) => {
      setEmail(event.target.value);
    };

  const addPassword = (event) => {
      setPassword(event.target.value);
    };

  const addProfilePicUrl = (event) => {
      setProfilePicUrl(event.target.files[0]);
    };
  
  const handleImageUpload = async () => {
    //upload image to server
    const formData = new FormData();
    formData.append('profilePicUrl', profilePicUrl);
    await axios.post(`${BASE_URL}/images/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    
    setProfilePicUrl('')
  }

  const addCompany = (event) => {
      setCompany(event.target.value);
    };
  const addLinkedin = (event) => {
      setlinkedin(event.target.value);
    };

  const onRadioSelection = (event) => {
    if (includeNameSalary !== event.target.value) {
      setIncludeNameSalary((includeNameSalary) => event.target.value);
    }
  }

  const addJobTitle = (event) => {
      setJobTitle(event.target.value);
    };
  const addSalary = (event) => {
      setSalary(parseInt(event.target.value));
    };

  const addYearsExperience = (event) => {
    if (yearsExperience !== event.target.value) {
      setYearsExperience((yearsExperience) => event.target.value);
    }
  };

  const onFormSubmit = (event) => {
    event.preventDefault();
    addNewUserToApi({  
      firstName, 
      lastName,
      pronouns, 
      cohort, 
      locationName,
      locationLat,
      locationLng,
      email,
      password,
      profilePicUrl,
      includeNameSalary,
      company,
      linkedin,
      jobTitle,
      salary,
      yearsExperience});
  };

  return (
    <form onSubmit={onFormSubmit} className="newUserForm">
      <div>
        <section>
          <h1>Attestation</h1>
          <input 
            value={ada} 
            type="checkbox" 
            id="ada" 
            onChange={checkHandler}>
          </input>
          <label htmlFor="ada">
            I am an Ada Developers Academy student (classroom or internship) or alum.
          </label>
          <br />
          <input 
          value={black} 
          type="checkbox" 
          id="black" 
          onChange={checkHandler}/>
          <label htmlFor="checkbox">I identify as Black.</label>
          <br />
          {/* <input
            type="submit"
            value="Confirm"
            className="button"
            disabled={!ada || !black}
            onClick={routeChange}
          ></input> */}
        </section>
        <section>
          {ada && black &&
          <div>
            <h1>Your Information</h1>
            <p>All fields marked with an * are required. Your name, pronouns (if provided), cohort, LinkedIn link (if provided), email, and picture will be posted in the Black Adie Directory.</p>
            <label htmlFor="firstName">*First Name</label>
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
            <label htmlFor="lastName">*Last Name</label>
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
            <label htmlFor="pronouns">Pronouns</label>
            <input
              type="text"
              minLength={1}
              maxLength={30}
              value={pronouns}
              onChange={addPronouns}
            ></input>
            <br />
            <br />
            <label htmlFor="cohort">*Cohort</label>
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
            <label htmlFor="location">*Location (Enter your current city and state/country, zip code, or post code)</label>
            <AutocompleteAddressBar 
            selectLocation={addLocation}/>
            <br />
            <br />
            <label htmlFor="linkedin">LinkedIn Profile URL</label>
            <input
              type="text"
              minLength={1}
              maxLength={60}
              value={linkedin}
              onChange={addLinkedin}
            ></input>
            <br />
            <br />
            <label htmlFor="email">*Email</label>
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
            <label htmlFor="password">*Password</label>
            <input
              type="text"
              minLength={8}
              maxLength={15}
              value={password}
              className={!password ? "error" : ""}
              onChange={addPassword}
            ></input>
            <br />
            <br />
            <div className="profilePic">
              <p>Upload a Profile Pic</p>
              <label className="btn">
                <input hidden type="file" accept="image/*" onChange={addProfilePicUrl}/>
                Select Image
              </label>
              {profilePicUrl && (
                <>
                  <ImagePreview src={profilePicUrl} alt='' />
                  <button className='btn' onClick={handleImageUpload}>Upload Image</button>
                </>
              )}
            </div>
            <h2>Company & Salary Information</h2>
            <p>Providing information about your current company and salary can be very helpful for our community. By default, company and salary information will be posted anonmously unless otherwise indicated.</p>
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
            <label htmlFor="jobTitle">Job Title</label>
            <input
              type="text"
              minLength={1}
              maxLength={30}
              value={jobTitle}
              onChange={addJobTitle}
            ></input>
            <br />
            <br />
            <label htmlFor="salary">Annual Salary $</label>
            <input
              type="text"
              minLength={1}
              maxLength={20}
              value={salary || ""}
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
            <input
              type="radio"
              className="includeName"
              value="No"
              checked={includeNameSalary === "No"}
              onChange={onRadioSelection}
            ></input>
            <label htmlFor="no"> No, do not include my name with my salary post.</label>
            <br />
            <input
              type="radio"
              className="includeName"
              value="Yes"
              checked={includeNameSalary === "Yes"}
              onChange={onRadioSelection}
            />
            <label htmlFor="yes"> Yes, include my name with my salary post.</label>
            <br />
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
          </div>}
        </section>
      </div>
    </form>
  );
};

// selectLocation: PropTypes.func

export default NewUserForm;