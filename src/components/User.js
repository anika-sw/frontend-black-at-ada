import React from "react";
import PropTypes from "prop-types";


const User = (props) => {

  return (
    <div>
      <section  className="cardFlex">
        <p className="fullName">{props.user.first_name} {props.user.last_name}</p>
        <p className="fullName">{props.user.cohort}</p>
        <p className="fullName">{props.user.location}</p>
        <p className="fullName">{props.user.email}</p>
        <div className="tinyFlexWrapper">
          <p>Flag User</p>
        </div>
      </section>
    </div>
  );
};

User.propTypes = {
  user: PropTypes.shape({
    userId: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    cohort: PropTypes.string,
    location: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    event_id: PropTypes.number, 
  })
}

export default User;