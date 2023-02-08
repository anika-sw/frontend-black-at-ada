import React, { useState, useEffect } from "react";
import EventMap from "./EventMap";
import DateTimePicker from "react-datetime-picker";
import PropTypes from 'prop-types';
import  { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import "../styles/NewForms.css";

// save draft and delete event capabilities for user creating event

const NewEventForm = (props) => {

  const user = localStorage.getItem('user')

  const updateEventInApi = (jsUser) => {
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
    // console.log(apiUser)
		const { first_name, last_name, location_name, location_lat, location_lng, include_name_salary, job_title, years_experience, ...rest } = apiUser;
		const jsUser = {firstName: first_name, lastName: last_name, locationName: location_name, locationLat: location_lat, locationLng: location_lng, includeNameSalary: include_name_salary, jobTitle: job_title, yearsExperience: years_experience, ...rest };
    // console.log(jsUser)
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

  const [eventData, setEventData] = useState({});
  
  const [value, onChange] = useState(new Date());
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoConfLink, setVideoConfLink] = useState("");
  const [radioSelection, setRadioSelection] = useState("Online");
  const [isMapShowing, setIsMapShowing] = useState(false);
  const [locationAddress, setLocationAddress] = useState(""); 
  const [locationLat, setLocationLat] = useState("");
  const [locationLng, setLocationLng] = useState("");
  const [organizerFirstName, setOrganizerFirstName] = useState(""); //look up what validation needs to happen with this
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [stopTime, setStopTime] = useState('');
  const [organizerLastName, setOrganizerLastName] = useState("");
  const [organizerEmail, setOrganizerEmail] = useState("");
  const [targetAudience, setTargetAudience] = useState("Everyone");
  const [createdBy, setCreatedBy] = useState(user)

  const addLocation = (location) => {
    geocodeByAddress(location)
    .then(results => getLatLng(results[0]))
    .then(latLng => {
      console.log('Success', latLng);
      setLocationAddress(location);
      const latStr = latLng['lat'].toString();
      const lngStr = latLng['lng'].toString();
      setLocationLat(latStr);
      setLocationLng(lngStr);
    })
    .catch(error => console.error('Error', error));
  };
  
  const addTitle = (event) => {
    setTitle(event.target.value);
  };
  
  const addDescription = (event) => {
      setDescription(event.target.value);
    };

  const onRadioSelection = (event) => {
    if (radioSelection !== event.target.value) {
      setRadioSelection((radioSelection) => event.target.value);
      setIsMapShowing((isMapShowing) => !isMapShowing)
    }
  }

  const addDate = (event) => {
      setDate(event.target.value);
    };

  const addOrganizerFirstName = (event) => {
      setOrganizerFirstName(event.target.value);
    };

  const addOrganizerLastName = (event) => {
      setOrganizerLastName(event.target.value);
    };
  const addVideoConfLink = (event) => {
      setVideoConfLink(event.target.value);
    };

  const addOrganizerEmail = (event) => {
      setOrganizerEmail(event.target.value);
    };

  const handleAudience = (event) => {
      setTargetAudience((targetAudience) => event.target.value);
    };

  const onFormSubmit = (event) => {
    event.preventDefault();
    props.addNewUser({ title, description, locationAddress, organizerFirstName, organizerLastName, organizerEmail });
  };

  // selectLocation={handleSelect}/>

  return (
    <form onSubmit={onFormSubmit} className="newEventForm">
      <label htmlFor="title">Event Title</label>
      <input
        type="text"
        minLength={1}
        maxLength={40}
        value={title}
        className={!title ? "error" : ""}
        onChange={addTitle}
      ></input>
      <br />
      <br />
      <label htmlFor="description">Description</label>
      <input
        type="text"
        minLength={1}
        maxLength={40}
        value={description}
        className={!description ? "error" : ""}
        onChange={addDescription}
      ></input>
      <br />
      <br />
      <input
        type="radio"
        className="location"
        value="Online"
        checked={radioSelection === "Online"}
        onChange={onRadioSelection}
      />
      <label htmlFor="online"> Online</label>
      <br />
      <p>Link or Meeting ID</p>
      <input
        type="text"
        minLength={1}
        maxLength={60}
        value={videoConfLink}
        className={!videoConfLink ? "error" : ""}
        onChange={addVideoConfLink}
      ></input>
      <p>Key, if any</p>
      <input
        type="text"
        minLength={1}
        maxLength={40}
        value={videoConfLink}
        className={!videoConfLink ? "error" : ""}
        onChange={addVideoConfLink}
      ></input>
      <br />
      <input
        type="radio"
        className="location"
        value="In-Person"
        checked={radioSelection === "In-Person"}
        onChange={onRadioSelection}
      />
      <label htmlFor="inPerson"> In-Person</label>
      <br />
      {isMapShowing && (
          <div className="map">
            <EventMap 
            selectLocation={addLocation}/>
          </div>
        )}
      <br />
      <DateTimePicker onChange={onChange} value={value} />
      <br />
      <br />
      <label htmlFor="organizerFirstName">Organizer's First Name</label>
      <input
        type="text"
        minLength={1}
        maxLength={30}
        value={organizerFirstName}
        className={!organizerFirstName ? "error" : ""}
        onChange={addOrganizerFirstName}
      ></input>
      <br />
      <br />
      <label htmlFor="organizerLastName">Organizer's Last Name</label>
      <input
        type="text"
        minLength={1}
        maxLength={30}
        value={organizerLastName}
        className={!organizerLastName ? "error" : ""}
        onChange={addOrganizerLastName}
      ></input>
      <br />
      <br />
      <label htmlFor="organizerEmail">Organizer's Email</label>
      <input
        type="text"
        minLength={1}
        maxLength={60}
        value={organizerEmail}
        className={!organizerEmail ? "error" : ""}
        onChange={addOrganizerEmail}
      ></input>
      <br />
      <br />
    <input 
      type="radio" 
      className="audience" 
      value="Everyone"
      checked={targetAudience === "Everyone"}
      onChange={handleAudience}>
    </input>
    <label htmlFor="everyone"> All Black Adies</label><br />
    <input 
      type="radio" 
      className="audience" 
      value="Adie Alum"
      checked={targetAudience === "Adie Alum"}
      onChange={handleAudience}>
    </input>
    <label htmlFor="adieAlum"> Black Adie Alum</label><br />
    <input 
      type="radio" 
      className="audience" 
      value="Internship Adies"
      checked={targetAudience === "Internship Adies"}
      onChange={handleAudience}>
    </input>
    <label htmlFor="internshipAdies"> Internship Black Adies</label><br />
    <input 
      type="radio" 
      className="audience" 
      value="Classroom Adies"
      checked={targetAudience === "Classroom Adies"}
      onChange={handleAudience}>
    </input>
    <label htmlFor="classroomAdies"> Classroom Black Adies</label><br />
    <input 
      type="radio" 
      className="audience" 
      value="Not Black@Ada Specific"
      checked={targetAudience === "Not Black@Ada Specific"}
      onChange={handleAudience}>
    </input>
    <label htmlFor="anyone"> Not Black@Ada Specific</label><br />
      <br />
      <br />
      <p>Event added by: User ID {createdBy}</p>
      <br />
      <br />
      <section className="buttonGrid">  
        <input
          type="submit"
          value="Submit"
          className="button"
          disabled={!title || !description || !organizerFirstName || !organizerLastName || !organizerEmail}
        ></input>
        <button>Save Draft</button>
        <button>Delete Event</button>
      </section>
    </form>
  );
};

export default NewEventForm;