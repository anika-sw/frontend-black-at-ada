import React from "react";

const Event = (props) => {

  return (
    <div>
      <section  className="cardFlex">
        <p className="fullName">{title}</p>
        <p className="fullName">{description}</p>
        <p className="fullName">{location}</p>
        <p className="fullName">{organizerFirstName, organizerLastName}</p>
        <p className="fullName">{organizerEmail}</p>
        <p className="fullName">{targetAudience}</p>
        <div className="tinyFlexWrapper">
          <p>Flag Event</p>
        </div>
      </section>
    </div>
  );
};

Event.propTypes = {
  event: PropTypes.shape({
    eventId: PropTypes.number,
    cards: PropTypes.arrayOf(PropTypes.shape({
      card_id: PropTypes.number,
      likes: PropTypes.number,
      message: PropTypes.string
    })),
    title: PropTypes.string,
    owner: PropTypes.string
  }),  }

export default Event;