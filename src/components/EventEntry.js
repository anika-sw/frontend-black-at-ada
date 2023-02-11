import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import TimeStamp from "../components/TimeStamp";
import PropTypes from "prop-types";
import { setItemInLocalStorage } from "../utils";
import "../styles/EventEntry.css";

const kBaseUrl = 'http://localhost:5000';


const EventEntry = (props) => {

  const navigate = useNavigate();
  const routeChange = (event) => {
    navigate(`/${props.event.id}`);
  }

  // const eventDetails = props.event
  // state: {eventDetails}

  // const getLocale = () => {
  //   axios.get(`${kBaseUrl}/events/${props.event.id}/locale`)
  //     .then((response) => {
  //       const rd = response.data
  //       const formattedLocale = `${rd.locale[0].name}, ${rd.locale[0].admin1}, ${rd.locale[0].cc}`
  //       console.log(formattedLocale)
  //       return formattedLocale
  //     })
  //     .catch((error) => {console.log('Error:', error)})
  //   };

  // const eventLinkObj = {
  //   pathname: `/events/${props.event.id}`,
  //   event: {props.event}
  // }

  const defaultImg = "https://storage.googleapis.com/img_store_black_at/2d3f57df-f170-4074-9a43-28a307675d0f.png"

  // const locale = getLocale();

  const eventProps = props.event

  return (
    <div>
      <section  className="cardFlex">
      <img src={props.event.imageUrl || defaultImg} alt='' height="200" />
        <p>{props.event.title}</p>
        <p>{props.event.dateTimeStart}</p>
        {props.event.radioSelection === "Online" ? <p>Virtual</p> : <p>locale</p>}
        <p>{props.event.targetAudience}</p>
        <Link to={`/events/${props.event.id}`} {...setItemInLocalStorage('event', props.event.id)}>
          <button type="button">Details</button>
        </Link>
      </section>
    </div>
  );
};

EventEntry.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    imageUrl: PropTypes.string,
    dateTimeStart: PropTypes.string,
    dateTimeStop: PropTypes.string,
    timezone: PropTypes.string,
    videoConfLink: PropTypes.string,
    meetingKey: PropTypes.string,
    radioSelection: PropTypes.string,
    isMapShowing: PropTypes.string,
    locationAddress: PropTypes.string,
    locationLat: PropTypes.string,
    locationLng: PropTypes.string,
    organizerFirstName: PropTypes.string,
    organizerLastName: PropTypes.string,
    organizerPronouns: PropTypes.string,
    organizerEmail: PropTypes.string,
    targetAudience: PropTypes.string,
    createdById: PropTypes.number,
    dateTimeCreated: PropTypes.string
  })
};

export default EventEntry;