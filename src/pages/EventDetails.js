import React, { useEffect, useState } from "react";
import { useLocation, Link } from 'react-router-dom'
import axios from "axios";
import EventMap from  "../components/EventMap";
import { AddToCalendar } from "react-add-to-calendar";
import "../styles/EventInfo.css";

const kBaseUrl = 'http://localhost:5000';

//pass the map location details to Event Map

const EventDetails = () => {

  const location = useLocation();
  const locPathSplit= location.pathname.split('/')

  const eventId = locPathSplit[2]
  
  const [eventData, setEventData] = useState({})
  const [attending, setAttending] = useState(false)
  const [creator, setCreator] = useState(true)

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
      });
    }, [eventId]);
  


  // const currentEvent = {
  //   title: 'Sample Event',
  //   description: 'This is the sample event provided as an example only',
  //   location: 'Portland, OR',
  //   startTime: '2016-09-16T20:15:00-04:00',
  //   endTime: '2016-09-16T21:45:00-04:00'
  // };

/*
   startTime and endTime can use any datetime
   string that is acceptable by MomentJS
*/


  return (
    <div>

      <section  className="cardFlex">
        <h1>{eventData.title}</h1>
        <div className="tinyFlexWrapper">
          <p>t</p>
        </div>
        <div className="eventEntryMap">
          {/* <EventMap /> */}
        </div>
        <br />
        <br />
      </section>
      {creator && 
        <Link to={"/events/edit-event"} state={{id: eventData.id}}>
          <button type='button'>Edit</button>
        </Link>}
      <button type='button'>Attending</button>
      {attending && <button type='button'>No Longer Attending</button>}
      <button type='button'>Flag Event</button>
      {/* <AddToCalendar event={currentEvent} /> */}
    </div>
  )
};

// EventDetails.propTypes = {
//   event: PropTypes.shape({
//     id: PropTypes.number,
//     title: PropTypes.string,
//     description: PropTypes.string,
//     imageUrl: PropTypes.string,
//     dateTimeStart: PropTypes.string,
//     dateTimeStop: PropTypes.string,
//     timezone: PropTypes.string,
//     videoConfLink: PropTypes.string,
//     meetingKey: PropTypes.string,
//     radioSelection: PropTypes.string,
//     isMapShowing: PropTypes.string,
//     locationAddress: PropTypes.string,
//     locationLat: PropTypes.string,
//     locationLng: PropTypes.string,
//     organizerFirstName: PropTypes.string,
//     organizerLastName: PropTypes.string,
//     organizerPronouns: PropTypes.string,
//     organizerEmail: PropTypes.string,
//     targetAudience: PropTypes.string,
//     createdById: PropTypes.number,
//     dateTimeCreated: PropTypes.string
//   })
// };

export default EventDetails;