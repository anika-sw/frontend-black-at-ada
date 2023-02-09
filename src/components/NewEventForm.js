import React, { useState, useEffect } from "react";
import EventMap from "./EventMap";
import axios from 'axios';
import DateTimePicker from "react-datetime-picker";
import PropTypes from 'prop-types';
import  { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import ImagePreview from '../components/ImagePreview';
import "../styles/NewForms.css";

const kBaseUrl = 'http://localhost:5000';
const BASE_URL = 'http://localhost:4000';


// save draft and delete event capabilities for user creating event

const NewEventForm = (props) => {

  const user = localStorage.getItem('user')

  const [userData, setUserData] = useState({});
  const [eventData, setEventData] = useState({});
  const [tempEventData, setTempEventData] = useState({})
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState('')
  const [dateTimeStart, onChangeStart] = useState(new Date());
  const [dateTimeStop, onChangeStop] = useState(new Date());
  const [timezone, setTimezone] = useState("");
  const [videoConfLink, setVideoConfLink] = useState("");
  const [meetingKey, setMeetingKey] = useState('');
  const [radioSelection, setRadioSelection] = useState("Online");
  const [isMapShowing, setIsMapShowing] = useState(false);
  const [locationAddress, setLocationAddress] = useState(""); 
  const [locationLat, setLocationLat] = useState("");
  const [locationLng, setLocationLng] = useState("");
  const [organizerFirstName, setOrganizerFirstName] = useState(''); //look up what validation needs to happen with this
  const [organizerPronouns, setOrganizerPronouns] = useState(""); //look up what validation needs to happen with this
  const [organizerLastName, setOrganizerLastName] = useState("");
  const [organizerEmail, setOrganizerEmail] = useState("");
  const [targetAudience, setTargetAudience] = useState("Everyone");
  const [createdBy, setCreatedBy] = useState(user)

  const addNewEventToApi = (jsEvent) => {
    // console.log('jsevent', jsEvent);
    const {imageUrl, dateTimeStart, dateTimeStop, videoConfLink, meetingKey, radioSelection, isMapShowing, locationAddress, locationLat, locationLng, organizerFirstName, organizerLastName, organizerPronouns, organizerEmail, targetAudience, createdBy, ...rest} = jsEvent;
    const apiEvent = {image_url: imageUrl, date_time_start: dateTimeStart, date_time_stop: dateTimeStop, video_conf_link: videoConfLink, meeting_key: meetingKey, radio_selection: radioSelection, is_map_showing: isMapShowing, location_address: locationAddress, location_lat: locationLat, location_lng: locationLng, organizer_first_name: organizerFirstName, organizer_last_name: organizerLastName, organizer_pronouns: organizerPronouns, organizer_email: organizerEmail, target_audience: targetAudience, created_by: createdBy, ...rest};
    console.log(apiEvent);
    const requestBody = {...apiEvent};
    axios.post(`${kBaseUrl}/events`, requestBody)
      .then(response => {
        console.log("Response:", response.data);
        // return convertFromApi(response.data);
        // do something here to push to directory
      })
      .catch(error => {
        console.log(error);
      });
    };

  const convertUserFromApi = (apiUser) => {
		const { first_name, last_name, location_name, location_lat, location_lng, include_name_salary, job_title, years_experience, ...rest } = apiUser;
		const jsUser = {firstName: first_name, lastName: last_name, locationName: location_name, locationLat: location_lat, locationLng: location_lng, includeNameSalary: include_name_salary, jobTitle: job_title, yearsExperience: years_experience, ...rest };
    return jsUser;
	};

  useEffect(() => {
    axios
      .get(`${kBaseUrl}/users/${user}`, {})
      .then((response) => {
        const convertedData = convertUserFromApi(response.data.user);
        setUserData(convertedData);
        setTempEventData({
          ...tempEventData, organizerFirstName: convertedData.firstName, organizerLastName: convertedData.lastName, organizerPronouns: convertedData.pronouns, organizerEmail: convertedData.email});
      });
  }, [user, tempEventData]);

  // const newEvent = {
  //   dateTimeStart,
  //   dateTimeStop,
  //   title,
  //   description, 
  //   videoConfLink,
  //   meetingKey,
  //   radioSelection, 
  //   isMapShowing, 
  //   locationAddress,  
  //   locationLat, 
  //   locationLng,
  //   organizerFirstName,
  //   organizerLastName,
  //   organizerPronouns,
  //   organizerEmail,
  //   targetAudience,
  //   createdBy
  // };



  // console.log('temp', tempEventData)

  const addImageUrl = (event) => {
    setImageUrl(event.target.files[0]);
  };

  const handleImageUpload = async () => {
    //upload image to server
    const formData = new FormData();
    formData.append('imageUrl', imageUrl);
    await axios.post(`${BASE_URL}/images/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    
    setImageUrl('')
  }

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

  const addTimezone = (event) => {
      setTimezone(event.target.value);
    };

  const onRadioSelection = (event) => {
    if (radioSelection !== event.target.value) {
      setRadioSelection((radioSelection) => event.target.value);
      setIsMapShowing((isMapShowing) => !isMapShowing)
    }
  }

  const addOrganizerFirstName = (event) => {
      setOrganizerFirstName(event.target.firstName);
    };

  const addOrganizerLastName = (event) => {
      setOrganizerLastName(event.target.value);
    };
  const addVideoConfLink = (event) => {
      setVideoConfLink(event.target.value);
    };

  const addMeetingKey = (event) => {
      setMeetingKey(event.target.value);
    };

  const addOrganizerEmail = (event) => {
      setOrganizerEmail(event.target.value);
    };

  const handleAudience = (event) => {
      setTargetAudience((targetAudience) => event.target.value);
    };

  const onFormSubmit = (event) => {
    event.preventDefault();
    const { organizerFirstName, organizerLastName, organizerPronouns, organizerEmail } = tempEventData
    addNewEventToApi({
      title,
      description,
      imageUrl, 
      dateTimeStart,
      dateTimeStop,
      timezone,
      videoConfLink,
      meetingKey,
      radioSelection, 
      isMapShowing, 
      locationAddress,  
      locationLat, 
      locationLng,
      organizerFirstName,
      organizerLastName,
      organizerPronouns,
      organizerEmail,
      targetAudience,
      createdBy
    });
  };
  
  return (
    <form onSubmit={onFormSubmit} className="newEventForm">
      <label htmlFor="title">Event Title</label>
      <input
        type="text"
        minLength={1}
        maxLength={100}
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
        maxLength={300}
        value={description}
        className={!description ? "error" : ""}
        onChange={addDescription}
      ></input>
      <br />
      <br />
      <div className="image">
        <p>Upload Event Image</p>
        <label className="btn">
          <input hidden type="file" accept="image/*" onChange={addImageUrl}/>
          Select Image
        </label>
        {imageUrl && (
          <>
            <ImagePreview src={imageUrl} alt='' />
            <button className='btn' onClick={handleImageUpload}>Upload Image</button>
          </>
        )}
      </div>
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
        value={meetingKey}
        onChange={addMeetingKey}
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
      <p>Start</p>
      <DateTimePicker onChange={onChangeStart} value={dateTimeStart} disableClock={true}
      format="MMMM dd yyyy   h:mm aa"
              />
      <br />
      <p>End</p>
      <DateTimePicker onChange={onChangeStop} value={dateTimeStop} disableClock={true}
      format="MMMM dd yyyy   h:mm aa"/>
      <br />
      <p>Timezone</p>
      <input
        type="text"
        minLength={1}
        maxLength={40}
        value={timezone}
        onChange={addTimezone}
      ></input>
      <br />
      <label htmlFor="organizerFirstName">Organizer's First Name</label>
      <input
        type="text"
        minLength={1}
        maxLength={30}
        value={tempEventData.organizerFirstName}
        // className={!firstName ? "error" : ""}
        onChange={(event) => {
          setTempEventData({
            ...tempEventData, organizerFirstName: event.target.value})
          }}
      ></input>
      <br />
      <br />
      <label htmlFor="organizerLastName">Organizer's Last Name</label>
      <input
        type="text"
        minLength={1}
        maxLength={30}
        value={tempEventData.organizerLastName}
        // className={!lastName ? "error" : ""}
        onChange={(event) => {
          setTempEventData({
            ...tempEventData, organizerLastName: event.target.value})
          }}
      ></input>
      <br />
      <br />
      <label htmlFor="pronouns">Organizer's Pronouns, if known</label>
        <input
          type="text"
          minLength={1}
          maxLength={30}
          value={tempEventData.organizerPronouns || ''}
          onChange={(event) => {
            setTempEventData({
              ...tempEventData, organizerPronouns: event.target.value})
            }}
        ></input>
      <br />
      <br />
      <label htmlFor="organizerEmail">Organizer's Email</label>
      <input
        type="text"
        minLength={1}
        maxLength={60}
        value={tempEventData.organizerEmail}
        // className={!email ? "error" : ""}
        onChange={(event)=> {
          setTempEventData({
            ...tempEventData, organizerEmail: event.target.value})
          }}
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
      <p>Event added by: {userData.firstName} {userData.lastName}</p>
      <br />
      <br />
      <section className="buttonGrid">  
        <input
          type="submit"
          value="Submit"
          className="button"
          // disabled={!title || !description || !organizerFirstName || !organizerLastName || !organizerEmail}
        ></input>
        <button>Save Draft</button>
        <button>Delete Event</button>
      </section>
    </form>
  );
};

export default NewEventForm;