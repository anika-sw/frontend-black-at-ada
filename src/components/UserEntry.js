import React from "react";
import PropTypes from "prop-types";
import "../styles/UserEntry.css";


const UserEntry = (props) => {

  const url = props.user.linkedin;
  const connectLink = <a href={url}>Connect with me on LinkedIn</a>;
  const mailTo = <a href={`mailto:${props.user.email}`}>{props.user.email}</a>;
  const namePronouns = <>{props.user.firstName} {props.user.lastName}{props.user.pronouns && <>, {props.user.pronouns}</>}</>


  return (
    <div className="directory-card-container directory-card-flex">
      <div className="directory-card-img">
        <img src={props.user.profilePicFile} alt="..." />
      </div>
      <div className="directory-card-body">
        <p className="card-title">{namePronouns}</p>
        <p className="card-text">Cohort {props.user.cohort}</p>
        <p className="card-text">{props.user.company ? props.user.company : "-"}</p>
        <p className="card-text">{mailTo}</p>
        <p className="card-text">{url ? url && connectLink : "-"}</p>
      </div>
    </div>
  );
};

UserEntry.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    pronouns: PropTypes.string,
    cohort: PropTypes.number,
    locationName: PropTypes.string,
    locationLat: PropTypes.string,
    locationLng: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    profilePicFile: PropTypes.string,
    company: PropTypes.string,
    linkedin: PropTypes.string,
    jobTitle: PropTypes.string,
    salary: PropTypes.number,
    yearsExperience: PropTypes.string,
    includeNameSalary: PropTypes.string,
    user_first_created: PropTypes.string,
    user_last_updated: PropTypes.string,
    event_id: PropTypes.number
  })
};

export default UserEntry;