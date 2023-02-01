import React from "react";
import PropTypes from "prop-types";
import "../styles/EventEntry.css";

// include image date, time, and target audience, location

const EventEntry = (props) => {
  return (
    <div>
      <section  className="cardFlex">
        <p className="fullName">Title: {props.event.title}</p>
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

export default EventEntry;