import React from "react";
import PropTypes from "prop-types";

const SalaryEntry = (props) => {
  return (
    <div>
      <section  className="cardFlex">
        <p className="fullName">Salary Details: {props.event.title}</p>
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

export default SalaryEntry;