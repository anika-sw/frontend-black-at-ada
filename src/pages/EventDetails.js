import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import moment from "moment";
import { getItemFromLocalStorage, setItemInLocalStorage } from "../utils";
import { StaticGoogleMap, Marker } from 'react-static-google-map';
import "../styles/EventDetails.css";

const kBaseUrl = 'http://localhost:5000';


const EventDetails = () => {

  const userId = parseInt(getItemFromLocalStorage('user'));
  const eventId = parseInt(getItemFromLocalStorage('event'));
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY2

  const navigate = useNavigate();

  const passEventId = (event) => {
    setItemInLocalStorage(eventId);
    navigate(`/events/${eventId}/edit-event`);
  };

  const routeChange = () => {
    navigate('/events');
  };
  
  const [eventData, setEventData] = useState({})
  const [attending, setAttending] = useState(false)
  const [creator, setCreator] = useState(false)

  const convertFromApi = (apiEvent) => {
		const {
      image_url,
      date_time_start,
      date_time_stop,
      video_conf_link,
      meeting_key,
      radio_selection,
      is_map_showing,
      location_address,
      location_lat,
      location_lng,
      organizer_first_name,
      organizer_last_name,
      organizer_pronouns,
      organizer_email,
      target_audience,
      created_by_id,
      date_time_created,
      users,
			...rest
		} = apiEvent;

		const jsEvent = {
      imageUrl: image_url || '',
      dateTimeStart: date_time_start || '',
      dateTimeStop: date_time_stop || '',
      videoConfLink: video_conf_link || '',
      meetingKey: meeting_key || '',
      radioSelection: radio_selection || '',
      isMapShowing: is_map_showing || '',
      locationAddress: location_address || '',
      locationLat: location_lat || '',
      locationLng: location_lng || '',
      organizerFirstName: organizer_first_name || '',
      organizerLastName: organizer_last_name || '',
      organizerPronouns: organizer_pronouns || '',
      organizerEmail: organizer_email || '',
      targetAudience: target_audience || '',
      createdById: created_by_id || null,
      dateTimeCreated: date_time_created || '',
      users: users || '',
			...rest,
		}; 
    return jsEvent;
	};

  useEffect(() => {
    axios.get(`${kBaseUrl}/events/${eventId}`, {})
      .then((response) => {
        const convertedData = convertFromApi(response.data.event);
        setEventData(convertedData);
        const creatorBool = userId === convertedData.createdById;
        setCreator(creatorBool)
        const attendingBool = convertedData.users.includes(userId) || creatorBool;
        setAttending(attendingBool)
      });
    }, [eventId, userId]);

  const deleteEvent = () => {
    axios.delete(`${kBaseUrl}/events/${eventId}`)
      .then(response => {
        console.log(`Event: "${eventId.title}" successfully deleted`);
        routeChange();
      }
    )
      .catch(error => {
        console.log(error);
      }
    );
  };

  const eventLocation = `${eventData.locationLat} ${eventData.locationLng}`

  const dateTimeStart = moment(eventData.dateTimeStart).format('MMMM Do YYYY, h:mm a');
  const dateTimeStop = moment(eventData.dateTimeStop).format('MMMM Do YYYY, h:mm a');

  const getDirections = `https://www.google.com/maps?daddr=${eventData.locationAddress}`


  const contactName = `${eventData.organizerFirstName} ${eventData.organizerLastName} ${eventData.organizerPronouns}`

  
  const rsvpYes = (event) => {
    
    console.log(userId)
    const requestBody = {user_id: userId}
    console.log(requestBody)
    axios.post(`${kBaseUrl}/events/${eventId}/users`, requestBody)
    .then((response) => {
      console.log(response.data)
      console.log('RSVP yes: success')
      setAttending(response.data.attending)
    });
  }

  const rsvpNo = (event) => {
    const requestBody = {user_id: userId}
    axios.patch(`${kBaseUrl}/events/${eventId}/users`, requestBody)
    .then((response) => {
      console.log(response.data)
      console.log('RSVP no: success')
      setAttending(response.data.attending)
    });
  }

  return (
    <div>
      <div className="event-color-bar">
        <h1>{eventData.title}</h1>
      </div>
      <section className="container event-details">
        <section className="details-grid1">
          <div>
            <h2>Date & Time</h2>
            <p>{dateTimeStart}</p>
            {dateTimeStop !== dateTimeStart && <p>{dateTimeStop}</p>}
          </div>
          <div>
            <h2>Time Zone</h2>
            <p>{eventData.timezone}</p>
          </div>
          <div>
            <h2>Target Audience</h2>
            <p>{eventData.targetAudience}</p>
          </div>
        </section>
        <section className="event-about">
          <h2>About</h2>
          <p>{eventData.description}</p>
        </section>
        <section className="details-grid2">
          <div>
            <h2>Location</h2>
            {eventData.radioSelection === "Online" && 
              <>
                <h3>Online</h3><a href={eventData.videoConfLink}>{eventData.videoConfLink}</a>
                <br />
                <br />
                <p>Meeting Key, if any: {eventData.meetingKey}</p>
              </>}
            {eventData.radioSelection === "In-Person" &&
            <>
              <br />
              <br />
              <h3>Address</h3>
              <p>{eventData.locationAddress}</p>
              <a href={getDirections}> Get Directions</a><img className='new-tab' src="/openNewTab.svg" alt="new tab" />
              <br />
              <br />
              <StaticGoogleMap size="600x600" className="img-fluid" apiKey={apiKey}>
                <Marker location={eventLocation} color="red" />
              </StaticGoogleMap>
            </>}
          </div>
          <div>
            <h2>Contact Name</h2>
            <p>{contactName}</p>
          </div>
          <div>
            <h2>Contact Email</h2>
            <p>{eventData.organizerEmail}</p>
          </div>
        </section>
        <br />
        <br />
        <section className="button-flex">
          <div>
          {creator &&
            <>
              <div>
                <button type="button" onClick={passEventId}>Edit Event</button>
              </div>
              <div>
                <button type="button" onClick={deleteEvent}>Cancel Event</button>
              </div>
            </>}
          </div>
          {!attending &&
            <button type='button' onClick={rsvpYes}>I'm Going!</button>}
          <div>
          {attending && !creator &&
            <button type='button' onClick={rsvpNo}>No Longer Attending</button>}
          </div>
          <div>
          {!creator &&
              <button type='button'>Flag Event</button>}
          </div>
        </section>
      </section>
    </div>
  )
};

export default EventDetails;