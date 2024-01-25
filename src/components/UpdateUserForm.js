import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import AutocompleteAddressBar from "./AutocompleteAddressBar";
import ImagePreview from './ImagePreview';
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import "../styles/NewForms.css";

const kBaseUrl = 'http://localhost:5000';


const UpdateUser = () => {

  const user = localStorage.getItem('user')

  const { logout } = useAuth();
  
  const navigate = useNavigate();
  const routeChange = () => {
    navigate('/home')
  };

  const [newPassword, setNewPassword] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);
  const [image, setImage] = useState('');
  const [imageSaved, setImageSaved] = useState(true);
  const [userData, setUserData] = useState({});
  const [tempUserData, setTempUserData] = useState({
    firstName: '', 
    lastName: '',
    pronouns: '', 
    cohort: '', 
    locationName: '',
    locationLat: '',
    locationLng: '',
    email: '',
    password: '',
    profilePicUrl: '',
    includeNameSalary: '',
    company: '',
    linkedin: '',
    jobTitle: '',
    salary: '',
    yearsExperience: ''
  });

  const updateUserInApi = (jsUser) => {
    const {
      firstName,
      lastName,
      locationName,
      locationLat,
      locationLng,
      profilePicUrl,
      includeNameSalary,
      jobTitle,
      yearsExperience,
      ...rest
    } = jsUser;

    const apiUser = {
      first_name: firstName,
      last_name: lastName,
      location_name: locationName,
      location_lat: locationLat,
      location_lng: locationLng,
      profile_pic_url: profilePicUrl,
      include_name_salary: includeNameSalary,
      job_title: jobTitle,
      years_experience: yearsExperience,
      ...rest,
    };

    const requestBody = {...apiUser};

    axios.patch(`${kBaseUrl}/users/${user}`, requestBody)
      .then(response => {
        console.log("Profile update: success");
        routeChange();
      }
    )
      .catch(error => {
        console.log(error);
      }
    );
  };

  const convertFromApi = (apiUser) => {
		const {
			first_name,
			last_name,
      pronouns,
			location_name,
			location_lat,
			location_lng,
      profile_pic_url,
      company,
      linkedin,
      salary,
			include_name_salary,
			job_title,
			years_experience,
			...rest
		} = apiUser;

		const jsUser = {
			firstName: first_name || '',
			lastName: last_name || '',
      pronouns: pronouns || '',
			locationName: location_name || '',
			locationLat: location_lat || '',
			locationLng: location_lng || '',
      profilePicUrl: profile_pic_url || '',
      company: company || '',
      linkedin: linkedin || '', 
			jobTitle: job_title || '',
      salary: salary || null,
			includeNameSalary: include_name_salary || '',
			yearsExperience: years_experience || '',
			...rest,
		}; 
    return jsUser;
	};

  useEffect(() => {
    axios.get(`${kBaseUrl}/users/${user}`, {})
    .then((response) => {
      const convertedData = convertFromApi(response.data.user);
      setUserData(convertedData);
      setTempUserData(convertedData);
    }
    );
  }, [user]);
  
  const deleteUser = () => {
    axios.delete(`${kBaseUrl}/users/${userData.id}`)
      .then(response => {
        console.log("Response:", response.data);
        logout();
      }
    )
      .catch(error => {
        console.log(error);
      }
    );
  };
    
  const updateLocation = (location) => {
    geocodeByAddress(location)
    .then(results => getLatLng(results[0]))
    .then(latLng => {
      console.log('Set location: success');
      const latStr = latLng['lat'].toString();
      const lngStr = latLng['lng'].toString();
      setTempUserData({
        ...tempUserData,
        locationName: location,
        locationLat: latStr,
        locationLng: lngStr,
      });
    }
  )
    .catch(error => console.error('Error', error));
  };

  //update profile pic in cloud storage
  const handleImageUpload = () => {
    const formData = new FormData();
    formData.append('image', image);
    axios.post(`${kBaseUrl}/images/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      } 
    }
  )
      .then(response => {
        console.log('Image URL: success');
        setTempUserData({...tempUserData, profilePicUrl: response.data});
        setImageSaved(true);
      }
    )
      .catch(error => {
        console.log(error);
      }
    )
  };

  const ref = useRef();

  const resetImage = (event) => {
    setTempUserData({...tempUserData, profilePicUrl: ''});
    setImageSaved(false);
    ref.current.value = "";
  };

  const showHidePassword = (event) => {
    setPasswordShown(!passwordShown);
  };

  const changePassword = (event) => {
    const eventValue = event.target.value
    setNewPassword(eventValue);
    setTempUserData({...tempUserData, password: eventValue});
  };

  const updateYearsExperience = (event) => {
    setTempUserData({...tempUserData, yearsExperience: event.target.value});
  };

  const onRadioSelection = (event) => {
    setTempUserData({...tempUserData, includeNameSalary: event.target.value})
  };

  const onFormSubmit = (event) => {
    event.preventDefault();
    updateUserInApi(tempUserData);
  };

	return (
		<form className="newUserForm" onSubmit={onFormSubmit}>
      <h1>My Profile</h1>
      <p>
        All fields marked with an * are required. Your name, pronouns
        (if provided), cohort, LinkedIn link (if provided), company (if
        provided), email, and picture will be posted in the Black Adie
        Directory.
      </p>
      <div className="form-row">
        <div className="col">
          <label htmlFor="firstName">*First Name</label>
          <input
            type="text"
            className="form-control"
            id="firsttName"
            minLength={1}
            maxLength={30}
            value={tempUserData.firstName}
            onChange={(event) => {
              setTempUserData({...tempUserData, firstName: event.target.value});
            }}
          ></input>
        </div>
        <div className="col">
          <label htmlFor="lastName">*Last Name</label>
          <input
            type="text"
            className="form-control"
            id="lasttName"
            minLength={1}
            maxLength={30}
            value={tempUserData.lastName}
            onChange={(event) => {
              setTempUserData({...tempUserData, lastName: event.target.value});
            }}
          ></input>
        </div>
        <div className="col"> 
          <label htmlFor="pronouns">Pronouns</label>
          <input
            type="text"
            className="form-control"
            id="pronouns"
            minLength={1}
            maxLength={30}
            value={tempUserData.pronouns || ""}
            onChange={(event) => {
              setTempUserData({...tempUserData, pronouns: event.target.value});
            }}
          ></input>
        </div>
      </div>
      <div className="form-row">
        <div className="col"> 
          <label htmlFor="cohort">*Cohort</label>
          <input
            type="text"
            className="form-control"
            id="cohort"
            minLength={1}
            maxLength={3}
            value={tempUserData.cohort}
            onChange={(event) => {
              setTempUserData({...tempUserData, cohort: event.target.value});
            }}
          ></input>
        </div>
        <div className="col">  
          <label htmlFor="location">
            *Location (saved): <span className="saved-location">{userData.locationName}</span>
          </label>
          <div>
            <label>
              Update Location (city, country, or post code)
            </label>
          </div>
          <AutocompleteAddressBar selectLocation={updateLocation} />
        </div>
        <div className="col">  
          <label htmlFor="linkedin">LinkedIn Profile URL</label>
          <input
            type="text"
            className="form-control"
            id="linkedin"
            minLength={1}
            maxLength={60}
            value={tempUserData.linkedin || ""}
            onChange={(event) => {
              setTempUserData({...tempUserData, linkedin: event.target.value});
            }}
          ></input>
        </div>
      </div>
      <div className="form-row">
        <div className="col"> 
          <label htmlFor="email">*Email</label>
          <input
            type="email"
            className="form-control"
            id="email"            
            minLength={1}
            maxLength={30}
            value={tempUserData.email}
            onChange={(event) => {
              setTempUserData({...tempUserData, email: event.target.value});
            }}
          ></input>
        </div>
        <div className="col">                
          <label>Change Password</label>
          <input
            type={passwordShown ? "text" : "password"} 
            className="form-control"
            id="password" 
            minLength={8}
            maxLength={15}
            value={newPassword}
            onChange={changePassword}
            placeholder={"Type new password"}
          ></input>
          <button type="button" className="password-btn" onClick={showHidePassword}>
            Show/Hide Password
          </button>
        </div>
        <div className="col">               
          <label htmlFor="image">*Profile Pic</label>
          {(tempUserData.profilePicUrl || image) ?
            <>
              <ImagePreview src={tempUserData.profilePicUrl || image} alt='' />
              <button type="button" onClick={resetImage}>Remove</button>
              <button type="button" onClick={handleImageUpload}>{imageSaved ? "Saved" : "Save"}</button>
              <label>Click save to confirm upload of your image</label>
            </>
          : ''}
          <br />
          <br />
          <input
            type="file"
            className="form-control-file"
            id="profilePic" 
            ref={ref}
            onChange={(event) => {setImage(event.target.files[0])}}
          ></input>
        </div>
      </div>
      <h2>Company & Salary Information</h2>
      <p>
        Providing information about your current company and salary can
        be very helpful for our community. By default, company and
        salary information will be posted anonmously unless otherwise
        indicated.
      </p>
      <div className="form-row">
        <div className="col"> 
          <label htmlFor="company">Company</label>
          <input
            type="text"
            className="form-control"
            id="company" 
            minLength={1}
            maxLength={30}
            value={tempUserData.company || ""}
            onChange={(event) => {
              setTempUserData({...tempUserData, company: event.target.value});
            }}
          ></input>
        </div>
        <div className="col">                
          <label htmlFor="jobTitle">Job Title</label>
          <input
            type="text"
            className="form-control"
            id="jobTitle" 
            minLength={1}
            maxLength={30}
            value={tempUserData.jobTitle || ""}
            onChange={(event) => {
              setTempUserData({...tempUserData, jobTitle: event.target.value});
            }}
          ></input>
        </div>
        <div className="col">                
          <label htmlFor="salary">Annual Salary</label>
          <input
            type="text"
            className="form-control"
            id="salary" 
            minLength={1}
            maxLength={60}
            value={tempUserData.salary || ""}
            onChange={(event) => {
              setTempUserData({...tempUserData, salary: event.target.value});
            }}
          ></input>
        </div>
      </div>
      <div className="form-row">
        <div className="col">   
          <div><label>Years of Experience (saved): <span className="saved-location">{userData.yearsExperience}</span></label></div>
          <div>
            <label htmlFor="experience">Years of Experience:
              <select className="experience" onChange={updateYearsExperience}>
                <option className="experience" value="N/A">N/A</option>
                <option className="experience" value="< 1">&lt; 1</option>
                <option className="experience" value="1 - 3">1 - 3</option>
                <option className="experience" value="3 - 5">3 - 5</option>
                <option className="experience" value="5 - 10">5 - 10</option>
                <option className="experience" value="10+">10+</option>
              </select>
            </label>
          </div>
        </div>
        <div className="col">
          <div className="form-check">           
            <input
              type="radio"
              className="form-check-input"
              name="includeName"
              id="noNameWithSalary"
              value="No"
              checked={tempUserData.includeNameSalary === "No"}
              onChange={onRadioSelection}
            ></input>
            <label className="form-check-label" htmlFor="no">
              No, do not include my name with my salary post.
            </label>
          </div>
          <div className="form-check">               
            <input
              type="radio"
              className="form-check-input"
              name="includeName"
              id="yesNameWithSalary"                
              value="Yes"
              checked={tempUserData.includeNameSalary === "Yes"}
              onChange={onRadioSelection}
            ></input>
            <label className="form-check-label" htmlFor="yes">
              Yes, include my name with my salary post.
            </label>
          </div>
        </div>
        <div className="btn-flex">
          <input 
            type="submit"
            value="Update Profile"
            className="update-btn"
            disabled={
              !tempUserData.firstName ||
              !tempUserData.lastName ||
              !tempUserData.cohort ||
              !tempUserData.locationName ||
              !tempUserData.email ||
              !imageSaved
            }
          ></input>
          <button type="button" className="delete-btn" onClick={deleteUser}>
            Delete Profile
          </button>
        </div>
      </div>
		</form>
	);
};

export default UpdateUser;
