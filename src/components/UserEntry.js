import React from "react";
import PropTypes from "prop-types";


const UserEntry = (props) => {
  const url = props.user.linkedin
  const connectLink = <a href={url}>Connect with me on LinkedIn</a>


  return (
    <div>
      <section className="directoryEntry">
        <p>{props.user.firstName} {props.user.lastName}, {props.user.pronouns}</p>
        <p>Cohort {props.user.cohort}</p>
        <p>{props.user.company}</p>
        <p>{props.user.email}</p>
        {url && connectLink}
        <p>*********************************</p>
      </section>
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
    // profilePic: PropTypes.any,
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