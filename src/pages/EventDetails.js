import React, { useEffect, useState } from "react";
import axios from "axios";
import EventMap from  "../components/EventMap";
import "../styles/EventInfo.css";

//get one event
//pass the map location detail props

const EventInfo = (props) => {

  const [eventsData, setEventsData] = useState([])

  useEffect(() => {
    axios
      .get("http://localhost:5000/events", {})
      .then((response) => {
        setEventsData(response.data);
    });
  }, []);

  return (
    <div>
      <section  className="cardFlex">
        <p className="fullName">Title: {props.event.title}</p>
        <p className="fullName">Description: {props.event.description}</p>
        <p className="fullName">Location: {props.event.location}</p>
        <p className="fullName">Organized by: {props.event.organizer_first_name} {props.event.organizer_last_name}</p>
        <p className="fullName">Contact: {props.event.organizer_email}</p>
        <p className="fullName">{props.event.target_audience}</p>
        <div className="tinyFlexWrapper">
          <p>Flag Event</p>
        </div>
        <div className="eventEntryMap">
          <EventMap />
        </div>
        <br />
        <br />
      </section>
      <button>RSVP</button>
    </div>
  )
};  

export default EventInfo;