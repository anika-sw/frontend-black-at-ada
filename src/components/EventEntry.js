import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setItemInLocalStorage } from "../utils";
import moment from "moment";
import PropTypes from "prop-types";
import "../styles/EventEntry.css";

const kBaseUrl = 'http://localhost:5000';


const EventEntry = (props) => {

  const userId = parseInt(localStorage.getItem('user'))

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [locale, setLocale] = useState('');
  
  const defaultImg = "https://storage.googleapis.com/img_store_black_at/Black%40Ada_logo.png";

  const dateTime = moment(props.event.dateTimeStart).format('MMMM Do YYYY, h:mm a');

  useEffect(() => {
    if (props.event.radioSelection === "In-Person") {
      setLoading(true);
      axios.get(`${kBaseUrl}/events/${props.event.id}/locale`)
      .then((response) => {
        const rd = response.data;
        const formattedLocale = `${rd.locale[0].name}, ${rd.locale[0].admin1}, ${rd.locale[0].cc}`;
        setLocale(formattedLocale);
        setLoading(false);
      })
      .catch(err=>console.log(err)) 
    };
  }, [props.event.id, props.event.radioSelection]);
  
  const tempStoreEventId = (event) => {
    setItemInLocalStorage('event', props.event.id);
    navigate(`/events/${props.event.id}`);
  };

  const passEventId = (event) => {
    setItemInLocalStorage('event', props.event.id);
    navigate(`/events/${props.event.id}/edit-event`);
  };

  const deleteEvent = () => {
    axios.delete(`${kBaseUrl}/events/${props.event.id}`)
      .then(response => {
        console.log(`Event: "${props.event.title}" successfully deleted`);
      }
    )
      .catch(error => {
        console.log(error);
      }
    );
  };
    
  if (loading) { 
    return (<div>Gathering events...</div>);
  }
  
  return (
    <>
      <div className="event-card-container">
        {!loading &&
        <div className="row event-card-row">
          <div className="col event-card-col">
            <div className="card h100 event-card">
              <img src={props.event.imageUrl || defaultImg} className="event-card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">{props.event.title}</h5>
                <p className="card-text">{dateTime}</p>
                <p className="card-text">Time Zone: {props.event.timezone}</p>
                <p>{props.event.radioSelection === "Online" ? "Virtual" : locale}</p>
                <p className="card-text">{props.event.targetAudience}</p>
                {props.event.createdById !== userId && <button type="button" onClick={tempStoreEventId}>Details</button>}
                {props.event.createdById === userId &&
                  <>
                    <p>Total RSVPs: {(props.event.users).length}</p>
                    <button type="button" onClick={passEventId}>Edit Event</button>
                    <button type="button" onClick={deleteEvent}>Cancel Event</button>
                  </>
                }
              </div>
            </div>
          </div>
        </div>
        }
      </div> 
    </>
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
    dateTimeCreated: PropTypes.string,
    users: PropTypes.string
  })
};

export default EventEntry;