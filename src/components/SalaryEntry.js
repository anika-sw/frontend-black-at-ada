import React from "react";
import PropTypes from "prop-types";
import "../styles/SalaryEntry.css";


const SalaryEntry = (props) => {
  const namePronouns = <>{props.firstName} {props.lastName}{props.pronouns && <>, {props.pronouns}</>}</>

  return (
    <div class="card border-success bg-transparent salary-card">
      <div class="card-body">
        <h5 class="card-title">Salary: ${props.salary}</h5>
        <p class="card-text">Company: {props.company}</p>
        <p class="card-text">Job Title: {props.jobTitle}</p>
        <p class="card-text">Years of Experience: {props.yearsExperience}</p>
        <p class="card-text">{props.includeNameSalary === "Yes" && <p>{namePronouns}</p>}</p>
        <p class="card-text"><small class="text-muted">Updated: {props.updated ? props.updated : props.created}</small></p>
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