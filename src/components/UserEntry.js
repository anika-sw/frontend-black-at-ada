import React from "react";
import PropTypes from "prop-types";


const UserEntry = (props) => {
  return (
    <div>
      <section className="directoryEntry">
        <p>{props.user.first_name} {props.user.last_name}</p>
        <p>{props.user.cohort}</p>
        <p>{props.user.location}</p> 
        <p>{props.user.email}</p>
        <p>{props.user.company}</p>
        <p>{props.user.linkedin}</p>
      </section>
    </div>
  );
};

UserEntry.propTypes = {
  user: PropTypes.shape({
    userId: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    cohort: PropTypes.string,
    location: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    company: PropTypes.string,
    linkedin: PropTypes.string,
    job_title: PropTypes.string,
    salary: PropTypes.number,
    years_experience: PropTypes.number,
    user_last_updated: PropTypes.string,
    event_id: PropTypes.number
  })
};

export default UserEntry;