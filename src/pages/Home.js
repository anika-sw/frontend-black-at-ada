import React, { useEffect, useState } from "react";
import axios from "axios";
import EventEntry from  "../components/EventEntry";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import "../styles/Home.css";

const kBaseUrl = 'http://localhost:5000';


const Home = () => {

  const navigate = useNavigate();

  const userId = parseInt(localStorage.getItem('user'))

  const [myEventsData, setMyEventsData] = useState([])
  const [recentAddData, setRecentAddData] = useState([])

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
      const myFilteredData = convertedData.filter(event => event.createdById === userId || event.users.includes(userId))
      setMyEventsData(myFilteredData);
      });
    }, [userId]);

  useEffect(() => {
    axios.get(`${kBaseUrl}/events?sort=dateTimeCreated`, {})
    .then((response) => {
      const convertedData = response.data.map((event) => {
        return convertFromApi(event);
      })
      setRecentAddData(convertedData);
    });
  }, []);

  const myEventsList = myEventsData.map((event) => {
    return (
      <span className="event-list-grid" key={event.id}>
        <EventEntry
          event={event}
        ></EventEntry>
      </span>
    );
  });
  
  const recentlyAddedList = recentAddData.map((event) => {
    return (
        <span className="event-list-grid" key={event.id}>
          <EventEntry
          event={event}
          ></EventEntry>
        </span>
    );
  });

  const toEvents = (event) => {
    navigate('/events');
  }

  const toDirectory = (event) => {
    navigate('/directory');
  }

  // <div class="container-fluid full-width">
  // <div class="row row-no-gutter">

  return (
    <main className="App">
      <h1 className="header-home color-bar">
        Welcome
      </h1>
      <div className="home-flex">
        <Button 
          type="button"
          sx={{
            textTransform: 'none'
          }}
          onClick={toEvents}>
            View All Events
        </Button>
        <Button 
          type="button"
          sx={{
            textTransform: 'none'
          }}
          onClick={toDirectory}>
            Black Adie Directory
        </Button>
      </div>
      <div>
        <h2>My Events</h2>
        <h3>Events you've created or commited to attending</h3>
        <ul>{myEventsList}</ul>
        <div className="more-btn-flex">
          <Button 
            type="button"
            sx={{
              textTransform: 'none'
            }}
            onClick={toEvents}>
              View More Events
          </Button>
        </div>
      </div>
      <div>
        <h2>Recently Added Events</h2>
        <ul>{recentlyAddedList}</ul>
        <div className="more-btn-flex">
          <Button 
            type="button"
            sx={{
              textTransform: 'none'
            }}
            onClick={toEvents}>
              View More Events
          </Button>
        </div>      
      </div>
    </main>
  );
};

export default Home;