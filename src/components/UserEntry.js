import React from "react";
import PropTypes from "prop-types";


const UserEntry = (props) => {

  const url = props.user.linkedin;
  const connectLink = <a href={url}>Connect with me on LinkedIn</a>;
  const mailTo = <a href={`mailto:${props.user.email}`}>{props.user.email}</a>;


  return (
    <div>
      <img src={props.user.profilePicUrl} alt='' height="200" />
      <section className="directoryEntry">
        <span>{props.user.firstName} {props.user.lastName}</span>{props.user.pronouns && <span>, {props.user.pronouns}</span>}
        <p>Cohort {props.user.cohort}</p>
        <p>{props.user.company}</p>
        <p>{mailTo}</p>
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
    profilePicUrl: PropTypes.string,
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