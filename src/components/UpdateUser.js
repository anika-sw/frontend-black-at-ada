import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import AutocompleteAddressBar from "./AutocompleteAddressBar";
import ImagePreview from '../components/ImagePreview';
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

  const [userData, setUserData] = useState({});
  const [tempUserData, setTempUserData] = useState({});
  const [password, setPassword] = useState();
  const [passwordShown, setPasswordShown] = useState(false);
  const [image, setImage] = useState('');

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
			location_name,
			location_lat,
			location_lng,
      profile_pic_url,
			include_name_salary,
			job_title,
			years_experience,
			...rest
		} = apiUser;

		const jsUser = {
			firstName: first_name,
			lastName: last_name,
			locationName: location_name,
			locationLat: location_lat,
			locationLng: location_lng,
      profilePicUrl: profile_pic_url,
			includeNameSalary: include_name_salary,
			jobTitle: job_title,
			yearsExperience: years_experience,
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

  const changePassword = (event) => {
    setPassword(event.target.value);
    setTempUserData({...tempUserData, password: event.target.value});
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
      }
    )
      .catch(error => {
        console.log(error);
      }
    )
  };

  const ref = useRef();

  const resetImage = (event) => {
    ref.current.value = "";
  };

  const showHidePassword = (event) => {
    setPasswordShown(!passwordShown);
  };

  const updateYearsExperience = (event) => {
    if (tempUserData.yearsExperience !== event.target.value) {
      setTempUserData({...tempUserData, yearsExperience: event.target.value});
    }
  };

  const onRadioSelection = (event) => {
    if (tempUserData.includeNameSalary !== event.target.value) {
      setTempUserData({...tempUserData, includeNameSalary: event.target.value})
    };
  };

  const onFormSubmit = (event) => {
    event.preventDefault();
    updateUserInApi(tempUserData);
  };

	return (
		<form className="newUserForm" onSubmit={onFormSubmit}>
			<h1>Your Information</h1>
			<p>
				All fields marked with an * are required. Your name, pronouns
				(if provided), cohort, LinkedIn link (if provided), company (if
				provided), email, and picture will be posted in the Black Adie
				Directory.
			</p>
			<label htmlFor="firstName">*First Name</label>
			<input
				type="text"
				minLength={1}
				maxLength={30}
				value={tempUserData.firstName}
				onChange={(event) => {
					setTempUserData({...tempUserData, firstName: event.target.value});
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
				onChange={(event) => {
					setTempUserData({...tempUserData, lastName: event.target.value});
				}}
			></input>
			<br />
			<br />
			<label htmlFor="pronouns">Pronouns</label>
			<input
				type="text"
				minLength={1}
				maxLength={30}
				value={tempUserData.pronouns || ""}
				onChange={(event) => {
					setTempUserData({...tempUserData, pronouns: event.target.value});
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
				onChange={(event) => {
					setTempUserData({...tempUserData, cohort: event.target.value});
				}}
			></input>
			<br />
			<br />
			<label htmlFor="location">
				*Location (saved): {userData.locationName}
			</label>
			<br />
			<label htmlFor="location">
				New Location (Enter your current city and state/country, zip
				code, or post code)
			</label>
			<AutocompleteAddressBar selectLocation={updateLocation} />
			<br />
			<br />
			<label htmlFor="linkedin">LinkedIn Profile URL</label>
			<input
				type="text"
				minLength={1}
				maxLength={60}
				value={tempUserData.linkedin || ""}
				onChange={(event) => {
					setTempUserData({...tempUserData, linkedin: event.target.value});
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
				onChange={(event) => {
					setTempUserData({...tempUserData, email: event.target.value});
				}}
			></input>
			<br />
			<br />
			<label htmlFor="password">*Password</label>
			<p>Change Password</p>
			<input
        type={passwordShown ? "text" : "password"} 
        minLength={8}
				maxLength={15}
				value={password}
				onChange={changePassword}
				placeholder={"Enter a new password"}
			></input>
      <button type="button" onClick={showHidePassword}>
        Show/Hide Password
      </button>
			<br />
			<br />
      <div>
      <label htmlFor="image">*Profile Pic</label>
      {image && (
        <>
          <ImagePreview src={image} alt="" />
          <button type="button" onClick={resetImage}>Remove</button>
          <button type="button" onClick={handleImageUpload}>Save</button>
        </>
      )}
      <br />
      <br />
      <input
        type="file"
        ref={ref}
        onChange={(event) => {setImage(event.target.files[0])}}
      />
      </div>
      <br />
      <br />
      <h2>Company & Salary Information</h2>
      <p>
        Providing information about your current company and salary can
        be very helpful for our community. By default, company and
        salary information will be posted anonmously unless otherwise
        indicated.
      </p>
      <br />
      <label htmlFor="company">Company</label>
      <input
        type="text"
        minLength={1}
        maxLength={30}
        value={tempUserData.company || ""}
        onChange={(event) => {
          setTempUserData({...tempUserData, company: event.target.value});
        }}
      ></input>
      <br />
      <br />
      <label htmlFor="jobTitle">Job Title</label>
      <input
        type="text"
        minLength={1}
        maxLength={30}
        value={tempUserData.jobTitle || ""}
        onChange={(event) => {
          setTempUserData({...tempUserData, jobTitle: event.target.value});
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
          setTempUserData({...tempUserData, salary: event.target.value});
        }}
      ></input>
      <br />
      <br />
      <p>Years of Experience (saved): {tempUserData.yearsExperience}</p>
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
      <br />
      <br />
      <input
        type="radio"
        className="includeName"
        value="No"
        checked={tempUserData.includeNameSalary === "No"}
        onChange={onRadioSelection}
      ></input>
      <label htmlFor="no">
        No, do not include my name with my salary post.
      </label>
      <br />
      <input
        type="radio"
        className="includeName"
        value="Yes"
        checked={tempUserData.includeNameSalary === "Yes"}
        onChange={onRadioSelection}
      />
      <label htmlFor="yes">
        Yes, include my name with my salary post.
      </label>
      <br />
      <br />
      <br />
      <section className="buttonGrid">
        <input
          type="submit"
          value="Update Profile"
          className="button"
          disabled={
            !tempUserData.firstName ||
            !tempUserData.lastName ||
            !tempUserData.cohort ||
            !tempUserData.locationName ||
            !tempUserData.email ||
            !password ||
            !image
          }
        ></input>
        <button type="button" onClick={deleteUser}>
          Delete Profile
        </button>
      </section>
		</form>
	);
};

export default UpdateUser;
