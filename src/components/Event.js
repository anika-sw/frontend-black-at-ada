import React from "react";
import PropTypes from "prop-types";

const Event = (props) => {
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
        <br />
        <br />
      </section>
    </div>
  );
};

Event.propTypes = {
  event: PropTypes.shape({
    eventId: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    location: PropTypes.string,
    organizerFirstName: PropTypes.string,
    organizerLastName: PropTypes.string,
    organizerEmail: PropTypes.string,
    targetAudience: PropTypes.string
  }),  
};

export default Event;