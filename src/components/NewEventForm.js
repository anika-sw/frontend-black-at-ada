import React, { useState } from "react";
import EventMap from "./EventMap";
// import DatePicker from "react-date-picker";
import DateTimePicker from "react-datetime-picker";
import PropTypes from 'prop-types';
import "../styles/NewForms.css";

// save draft and delete event capabilities for user creating event

const NewEventForm = (props) => {
  
  const [value, onChange] = useState(new Date());
  console.log(value)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoConfLink, setVideoConfLink] = useState("");
  const [radioSelection, setRadioSelection] = useState("Online");
  const [isMapShowing, setIsMapShowing] = useState(false);
  const [location, setLocation] = useState({
    locationName: "",
    locationLat: "",
    locationLon:""
  });   
  const [organizerFirstName, setOrganizerFirstName] = useState(""); //look up what validation needs to happen with this
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [organizerLastName, setOrganizerLastName] = useState("");
  const [organizerEmail, setOrganizerEmail] = useState("");
  const [targetAudience, setTargetAudience] = useState("Everyone");

  console.log(radioSelection, isMapShowing)
  
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

  const addLocation = (event) => {
      setLocation(event.target.value);
    };

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
    props.addNewUser({ title, description, location, organizerFirstName, organizerLastName, organizerEmail });
  };

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
            <EventMap />
          </div>
        )}
      <br />
      <input
        type="text"
        minLength={1}
        maxLength={40}
        value={location}
        className={!location ? "error" : ""}
        onChange={addLocation}
      ></input>
      <br />
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
    <label htmlFor="everyone"> Everyone</label><br />
    <input 
      type="radio" 
      className="audience" 
      value="Classroom Adies"
      checked={targetAudience === "Classroom Adies"}
      onChange={handleAudience}>
    </input>
    <label htmlFor="classroomAdies"> Classroom Adies</label><br />
    <input 
      type="radio" 
      className="audience" 
      value="Internship Adies"
      checked={targetAudience === "Internship Adies"}
      onChange={handleAudience}>
    </input>
    <label htmlFor="internshipAdies"> Internship Adies</label><br />
    <input 
      type="radio" 
      className="audience" 
      value="Adie Alum"
      checked={targetAudience === "Adie Alum"}
      onChange={handleAudience}>
    </input>
    <label htmlFor="adieAlum"> Adie Alum</label><br /><br />
      <section className="buttonGrid">  
        <input
          type="submit"
          value="Submit"
          className="button"
          disabled={!title || !description || !location || !organizerFirstName || !organizerLastName || !organizerEmail}
        ></input>

        <button>Save Draft</button>
        <button>Delete Event</button>
      </section>
    </form>
  );
};

NewEventForm.propTypes = {
  addNewEvent: PropTypes.func
};

export default NewEventForm;