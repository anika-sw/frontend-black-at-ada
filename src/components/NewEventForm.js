import React, { useState } from "react";
import PropTypes from 'prop-types';
import "../styles/NewForms.css";

const NewEventForm = (props) => {
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [organizerFirstName, setOrganizerFirstName] = useState(""); //look up what validation needs to happen with this
  const [organizerLastName, setOrganizerLastName] = useState("");
  const [organizerEmail, setOrganizerEmail] = useState("");
  
  const addTitle = (event) => {
    setTitle(event.target.value);
  };
  
  const addDescription = (event) => {
      setDescription(event.target.value);
    };

  const addLocation = (event) => {
      setLocation(event.target.value);
    };

  const addOrganizerFirstName = (event) => {
      setOrganizerFirstName(event.target.value);
    };

  const addOrganizerLastName = (event) => {
      setOrganizerLastName(event.target.value);
    };

  const addOrganizerEmail = (event) => {
      setOrganizerEmail(event.target.value);
    };

  const onFormSubmit = (event) => {
    event.preventDefault();
    props.addNewUser({ title, description, location, organizerFirstName, organizerLastName, organizerEmail });
  };

  return (
    <form onSubmit={onFormSubmit} className="newUserForm">
      <label htmlFor="title">Event Title</label>
      <br />
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
      <br />
      <input
        type="text"
        minLength={1}
        maxLength={40}
        value={description}
        className={!description ? "error" : ""}
        onChange={addDescription}
      ></input>
      <label htmlFor="location">Location</label>
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
      <label htmlFor="organizerFirstName">Organizer's First Name</label>
      <br />
      <input
        type="text"
        minLength={1}
        maxLength={60}
        value={organizerFirstName}
        className={!organizerFirstName ? "error" : ""}
        onChange={addOrganizerFirstName}
      ></input>
      <label htmlFor="organizerLastName">Organizer's Last Name</label>
      <br />
      <input
        type="text"
        minLength={1}
        maxLength={40}
        value={organizerLastName}
        className={!organizerLastName ? "error" : ""}
        onChange={addOrganizerLastName}
      ></input>
      <br />
      <br />
      <label htmlFor="organizerEmail">Organizer's Email</label>
      <br />
      <input
        type="text"
        minLength={1}
        maxLength={60}
        value={organizerEmail}
        className={!organizerEmail ? "error" : ""}
        onChange={addOrganizerEmail}
      ></input>
      <section className="buttonGrid">  
        <input
          type="submit"
          value="Submit"
          className="button"
          disabled={!title || !description || !location || !organizerFirstName || !organizerLastName || !organizerEmail}
        ></input>
      </section>
    </form>
  );
};

NewEventForm.propTypes = {
  addNewEvent: PropTypes.func
};

export default NewEventForm;