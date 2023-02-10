import React from "react";
import PropTypes from "prop-types";

const SalaryEntry = (props) => {
  const namePronouns = <>{props.firstName} {props.lastName}{props.pronouns && <span>, {props.pronouns}</span>}</>

  return (
    <section  className="cardFlex">
      <p className="fullName">Salary Details:</p>
      <p>Salary: ${props.salary}</p>
      <p>Company: {props.company}</p>
      <p>Job Title: {props.jobTitle}</p>
      <p>Years of Experience: {props.yearsExperience}</p>
      {props.includeNameSalary === "Yes" && <p>{namePronouns}</p>}
      <p>Updated: {props.updated ? props.updated : props.created}</p>
      <p>************************************</p>
    </section>
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