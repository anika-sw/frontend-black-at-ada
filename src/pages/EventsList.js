import React, { useEffect, useState } from "react";
import axios from "axios";
import EventEntry from  "../components/EventEntry";

const kBaseUrl = 'http://localhost:5000';


const EventsList = () => {

  const [eventsData, setEventsData] = useState([])

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
        // const convertedData = convertFromApi(response.data);
        setEventsData(response.data);
      });
    }, []);
    
  const allEvents = eventsData.map((event) => {
    event = convertFromApi(event)
    return (
      <li key={event.id}>
        <EventEntry
          event={event}
        ></EventEntry>
      </li>
    );
  });

  const recentlyAddedEvents = eventsData.map((event) => {
    event = convertFromApi(event)
    return (
      <li key={event.id}>
        <EventEntry
        event={event}
        ></EventEntry>
      </li>
    );
  });
  const userId = localStorage.getItem('user')
  // console.log(eventsData)
    
  const myEvents = () => {
    const convertedData = convertFromApi(eventsData)
    const filtered = convertedData.filter(event => event.createdById === userId || event.users.includes(userId))
    console.log(convertedData)
  }
  
  const myEventsList = eventsData.map((event) => {
    event = convertFromApi(event)
    if (event.users.includes({userId}) || event.createdById === {userId}) {
      return (
        <li key={event.id}>
          <EventEntry>
            event={event} 
          </EventEntry>
        </li>
      )
    }
  });

  return (
    <div>
      <h1 className="header">
        Upcoming Events
      </h1>
      <section>
        <h2>My Events</h2>
        <ul>{myEventsList}</ul>
      </section>
      <section>
        <h2>Recently Added Events</h2>
      </section>
      <section>
        <h2>All Events</h2>
        <ul>{allEvents}</ul>
        <br />
        <br />
        <br />
        <br />
        <br />
        <input type="checkbox" /><label htmlFor="checkbox">Near Me</label>
        <input type="checkbox" /><label htmlFor="checkbox">Online</label>
        <input type="checkbox" /><label htmlFor="checkbox">Anyone</label>
        <input type="checkbox" /><label htmlFor="checkbox">Classroom Adies</label>
        <input type="checkbox" /><label htmlFor="checkbox">Internship Adies</label>
        <input type="checkbox" /><label htmlFor="checkbox">Adie Alum</label>
        <input type="checkbox" /><label htmlFor="checkbox">Show All Past Events</label>
        <input type="checkbox" /><label htmlFor="checkbox">Show My Past Events</label>
      </section>
    </div>
  )
};  

export default EventsList;