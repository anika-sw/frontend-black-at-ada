import React from "react";
import PropTypes from "prop-types";
import "../styles/SalaryEntry.css";


const SalaryEntry = (props) => {
  const namePronouns = <>{props.firstName} {props.lastName}{props.pronouns && <>, {props.pronouns}</>}</>

  return (
    <div className="card border-success bg-transparent salary-card-container">
      <div className="salary-card-col">
        <div className="salary-card">
          <p className="salary-card-title">Salary: ${props.salary}</p>
          <p className="card-text">Company: {props.company}</p>
          <p className="card-text">Job Title: {props.jobTitle}</p>
          <p className="card-text">Years of Experience: {props.yearsExperience}</p>
          <p className="card-text">{props.includeNameSalary === "Yes" ? <span>{namePronouns}</span> : "-"}</p>
          <p className="card-text"><small className="text-muted">Updated: {props.updated ? props.updated : props.created}</small></p>
        </div>
      </div>
    </div>
  );
};

SalaryEntry.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  pronouns: PropTypes.string,
  salary: PropTypes.number,
  company: PropTypes.string,
  jobTitle: PropTypes.string,
  yearsExperience: PropTypes.string,
  includeNameSalary: PropTypes.string,
  created: PropTypes.string,
  updated: PropTypes.string
};

export default SalaryEntry;