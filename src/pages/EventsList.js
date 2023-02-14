import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EventEntry from  "../components/EventEntry";
import "../styles/EventsList.css";


const kBaseUrl = 'http://localhost:5000';


const EventsList = () => {

  const navigate = useNavigate();
  const routeChange = (event) => {
    navigate('/events/new-event');
  };

  const [eventsData, setEventsData] = useState([]);

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
    axios.get(`${kBaseUrl}/events`, {})
      .then((response) => {
        const convertedData = response.data.map((event) => {
          return convertFromApi(event);
        }
        );
      setEventsData(convertedData);
      });
    }, []);


    
  const allEventsList = eventsData.map((event) => {
    return (
      <li key={event.id}>
        <EventEntry
          event={event}
        ></EventEntry>
      </li>
    );
  });


  return (
    <div className="container">
      <h1 className="header events-header">
        Upcoming Events
      </h1>
      <div className="add-event-flex">
        <button type="button" className="add-event-btn" onClick={routeChange}>Add Event</button>
      </div>
      <section>
        <h2>All Events</h2>
        <ul className="events-list-flex">{allEventsList}</ul>
      </section>
    </div>
  )
};  

export default EventsList;