import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import EventMap from "./EventMap";
import axios from 'axios';
import DateTimePicker from "react-datetime-picker";
import  { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import ImagePreview from '../components/ImagePreview';
import "../styles/NewForms.css";

const kBaseUrl = 'http://localhost:5000';


const NewEventForm = () => {

  const user = localStorage.getItem('user')

  const navigate = useNavigate();
  const routeChange = () => {
    navigate('/events')
  };

  const [userData, setUserData] = useState({});
  const [organizerData, setOrganizerData] = useState({})
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState('');
  const [imageSaved, setImageSaved] = useState(false);
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
  const [targetAudience, setTargetAudience] = useState("Everyone");

  const addNewEventToApi = (jsEvent) => {
    const {
      imageUrl,
      dateTimeStart,
      dateTimeStop,
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
      createdById,
      ...rest
    } = jsEvent;

    const apiEvent = {
      image_url: imageUrl,
      date_time_start: dateTimeStart,
      date_time_stop: dateTimeStop,
      video_conf_link: videoConfLink,
      meeting_key: meetingKey,
      radio_selection: radioSelection,
      is_map_showing: isMapShowing,
      location_address: locationAddress,
      location_lat: locationLat,
      location_lng: locationLng,
      organizer_first_name: organizerFirstName,
      organizer_last_name: organizerLastName,
      organizer_pronouns: organizerPronouns,
      organizer_email: organizerEmail,
      target_audience: targetAudience,
      created_by_id: createdById,
      ...rest,
    };

    const requestBody = {...apiEvent};
    console.log(requestBody)

    axios.post(`${kBaseUrl}/events`, requestBody)
      .then(response => {
        console.log('New event created: success');
      }
    )
      .catch(error => {
        console.log(error);
      }
    );
  };

  const convertUserFromApi = (apiUser) => {
		const {
			first_name,
			last_name,
			location_name,
			location_lat,
			location_lng,
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
        const convertedData = convertUserFromApi(response.data.user);
        setUserData(convertedData);
        setOrganizerData({
          organizerFirstName: convertedData.firstName,
          organizerLastName: convertedData.lastName,
          organizerPronouns: convertedData.pronouns || '',
          organizerEmail: convertedData.email
        });
      });
  }, [user]);

  //upload profile pic to cloud storage
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
        setImageUrl(response.data.url);
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
    setImage('');
    setImageSaved(false);
    ref.current.value = "";
  };

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
    setRadioSelection(event.target.value);
    setIsMapShowing(!isMapShowing);
  };

  const addVideoConfLink = (event) => {
    setVideoConfLink(event.target.value);
  };

  const addMeetingKey = (event) => {
    setMeetingKey(event.target.value);
  };

  const handleAudience = (event) => {
    setTargetAudience(event.target.value);
  };

  const createdByName = `${userData.firstName} ${userData.lastName}`
  const createdById = userData.id

  const onFormSubmit = (event) => {
    event.preventDefault();
    const {
      organizerFirstName,
      organizerLastName,
      organizerPronouns,
      organizerEmail,
    } = organizerData;
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
      createdById
    });
    routeChange();
  };
  

  return (
		<form onSubmit={onFormSubmit} className="newEventForm container">
      <p className="instructions">All fields marked with an * are required.</p>
      <div className="form-group row">
        <label className="col-sm-2 col-form-label" htmlFor="title">*Event Title</label>
        <input
          type="text"
          className="form-control"
          id="eventTitle"
          minLength={1}
          maxLength={100}
          value={title}
          onChange={addTitle}
        ></input>
      </div>
      <div className="form-row"> 
        <div className="col calendar">
          <label htmlFor="startTime">*Start: Date & Time</label>
          <DateTimePicker
            format="MMMM dd yyyy   h:mm aa"
            disableClock={true}
            value={dateTimeStart}
            onChange={onChangeStart}
          />
        </div>
        <div className="col calendar">
          <label htmlFor="endTime">End: Date & Time</label>
          <DateTimePicker
            format="MMMM dd yyyy   h:mm aa"
            value={dateTimeStop}
            disableClock={true}
            onChange={onChangeStop}
          />
        </div>
        <div className="col">
          <label htmlFor="*timezone">*Time Zone</label>
          <input
            type="text"
            className="form-control"
            id="timezone"
            minLength={1}
            maxLength={40}
            value={timezone}
            onChange={addTimezone}
          ></input>
        </div>
      </div>
      <div className="form-group row">
        <label className="col-sm-2 col-form-label" htmlFor="description">Description</label>
        <textarea
          type="text"
          className="form-control"
          id="description"
          rows="3"
          minLength={1}
          maxLength={500}
          value={description}
          onChange={addDescription}
        ></textarea>
      </div>
      <fieldset className="form-row">
        <legend className="col-form-label col-sm-1 float-sm-left pt-0">Location</legend>
        <div className="col">
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="location"
              id="online"
              value="Online"
              checked={radioSelection === "Online"}
              onChange={onRadioSelection}
              ></input>
            <label className="form-check-label" htmlFor="online">Online</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="location"
              id="inPerson"
              value="In-Person"
              checked={radioSelection === "In-Person"}
              onChange={onRadioSelection}
            ></input>
            <label className="form-check-label" htmlFor="inPerson">In-Person</label>
          </div>
        </div>
        <div className="col">
          <label htmlFor="linkMeetingId">Link or Meeting ID</label>
          <input
            type="text"
            className="form-control"
            id="linkMeetingId"
            minLength={1}
            maxLength={60}
            value={videoConfLink}
            onInput={addVideoConfLink}
          ></input>
        </div>
        <div className="col">
          <label htmlFor="key">Key, if any</label>
          <input
            type="text"
            className="form-control"
            id="meetingKey"
            minLength={1}
            maxLength={40}
            value={meetingKey}
            onInput={addMeetingKey}
          ></input>
        </div>
      </fieldset>
      <div className="form-row">
        <div className="col">
          <p>Use the map and search bar to provide an address for in-person events</p> 
            <div className="map">
              <EventMap selectLocation={addLocation} />
            </div>
        </div>
        <div className="col">
          <label className="form-label" htmlFor="image">Upload an event-related image</label>
            {image ? 
              <>
                <ImagePreview src={image} alt="" />
                <button type="button" onClick={resetImage}>Remove</button>
                <button type="button" onClick={handleImageUpload}>{imageSaved ? "Saved" : "Save"}</button>
                <p>Click save to confirm upload of your image</p>
              </>
            : ''}
          <input
            type="file"
            className="form-control-file"
            id="image"
            ref={ref}
            onChange={(event) => {setImage(event.target.files[0])}}
          ></input>
        </div>
      </div>
      <div className="form-row">
        <div className="col">
          <label className="form-control-label" htmlFor="organizerFirstName">Organizer's First Name</label>
          <input
            type="text"
            className="form-control"
            id="firstName"
            minLength={1}
            maxLength={30}
            value={organizerData.organizerFirstName || ''}
            onChange={(event) => {
              setOrganizerData({...organizerData, organizerFirstName: event.target.value});
            }}
          ></input>
        </div>
        <div className="col">
          <label className="form-control-label" htmlFor="organizerLastName">Organizer's Last Name</label>
          <input
            type="text"
            className="form-control"
            id="lastName"
            minLength={1}
            maxLength={30}
            value={organizerData.organizerLastName || ''}
            onChange={(event) => {
              setOrganizerData({...organizerData, organizerLastName: event.target.value});
            }}
          ></input>
        </div>
        <div className="col">
          <label className="form-control-label" htmlFor="organizerPronouns">Organizer's Pronouns, if known</label>
          <input
            type="text"
            className="form-control"
            id="pronouns"
            minLength={1}
            maxLength={30}
            value={organizerData.organizerPronouns || ""}
            onChange={(event) => {
              setOrganizerData({...organizerData, organizerPronouns: event.target.value});
            }}
          ></input>
        </div>
      </div>
      <div className="form-group row">
        <label className="col-sm-2 col-form-label"  htmlFor="organizerEmail">Organizer's Email</label>
        <input
          type="email"
          className="form-control"
          id="email"
          minLength={1}
          maxLength={60}
          value={organizerData.organizerEmail || ''}
          onChange={(event) => {
            setOrganizerData({...organizerData, organizerEmail: event.target.value});
          }}
        ></input>
      </div>
      <fieldset className="form-group row">
        <legend className="col-form-label col-sm-2 float-sm-left pt-0">Target Audience</legend>
        <div className="col-sm-10">
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="audience"
              id="everyone"
              value="Everyone"
              checked={targetAudience === "Everyone"}
              onChange={handleAudience}
            ></input>
            <label className="form-check-label" htmlFor="everyone">All Black Adies</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="audience"
              id="adieAlum"
              value="Adie Alum"
              checked={targetAudience === "Adie Alum"}
              onChange={handleAudience}
            ></input>
            <label className="form-check-label" htmlFor="adieAlum">Black Adie Alum</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="audience"
              id="internshipAdies"
              value="Internship Adies"
              checked={targetAudience === "Internship Adies"}
              onChange={handleAudience}
            ></input>
            <label className="form-check-label" htmlFor="internshipAdies">Internship Black Adies</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="audience"
              id="classroomAdies"
              value="Classroom Adies"
              checked={targetAudience === "Classroom Adies"}
              onChange={handleAudience}
            ></input>
            <label className="form-check-label" htmlFor="classroomAdies">Classroom Black Adies</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="audience"
              id="anyone"
              value="Not Black@Ada Specific"
              checked={targetAudience === "Not Black@Ada Specific"}
              onChange={handleAudience}
            ></input>
            <label className="form-check-label" htmlFor="anyone">Not Black@Ada Specific</label>
          </div>
        </div>
      </fieldset>
      <p>Event added by: {createdByName}</p>
      <br />
      <br />
      <input
        type="submit"
        value="Submit"
        className="button"
        disabled={
          !title ||
          !dateTimeStart ||
          !timezone
        }
      ></input>
		</form>
  );
};

export default NewEventForm;