import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import EventMap from "./EventMap";
import axios from 'axios';
import DateTimePicker from "react-datetime-picker";
import  { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { getItemFromLocalStorage } from "../utils";
import ImagePreview from '../components/ImagePreview';
import "../styles/NewForms.css";

const kBaseUrl = 'http://localhost:5000';

// save draft and delete event capabilities for user creating event

const NewEventForm = () => {

  const user = localStorage.getItem('user')

  const eventId = getItemFromLocalStorage('event')

  console.log(eventId)


  const navigate = useNavigate();
  const routeChange = () => {
    navigate('/events')
  };

  const [image, setImage] = useState('');
  const [imageSaved, setImageSaved] = useState(false);
  const [dateTimeStart, onChangeStart] = useState(new Date());
  const [dateTimeStop, onChangeStop] = useState(new Date());
  const [userData, setUserData] = useState({});
  const [organizerData, setOrganizerData] = useState({})
  const [event, setEventData] = useState({});
  const [tempEventData, setTempEventData] = useState({
    title: '',
    description: '',
    image: '',
    imageUrl: '',
    dateTimeStart: '',
    dateTimeStop: '',
    timezone: '',
    videoConfLink: '',
    meetingKey: '',
    radioSelection: '',
    isMapShowing: '',
    locationAddress: '',
    locationLat: '',
    locationLng: '',
    targetAudience: ''
  });
  
  // const [title, setTitle] = useState("");
  // const [description, setDescription] = useState("");
  // const [image, setImage] = useState('');
  // const [imageUrl, setImageUrl] = useState('')
  // const [dateTimeStart, onChangeStart] = useState(new Date());
  // const [dateTimeStop, onChangeStop] = useState(new Date());
  // const [timezone, setTimezone] = useState("");
  // const [videoConfLink, setVideoConfLink] = useState("");
  // const [meetingKey, setMeetingKey] = useState('');
  // const [radioSelection, setRadioSelection] = useState("Online");
  // const [isMapShowing, setIsMapShowing] = useState(false);
  // const [locationAddress, setLocationAddress] = useState(""); 
  // const [locationLat, setLocationLat] = useState("");
  // const [locationLng, setLocationLng] = useState("");
  // const [targetAudience, setTargetAudience] = useState("Everyone");

  const updateEventInApi = (jsEvent) => {
    const {
      imageUrl,
      dateTimeStart,
      dateTimeStop,
      videoConfLink,
      meetingKey,
      radioSelection,
      isMapShowing,
      locationAddress,
      locationLat,
      locationLng,
      organizerFirstName,
      organizerLastName,
      organizerPronouns,
      organizerEmail,
      targetAudience,
      createdById,
      ...rest
    } = jsEvent;

    const apiEvent = {
      image_url: imageUrl,
      date_time_start: dateTimeStart,
      date_time_stop: dateTimeStop,
      video_conf_link: videoConfLink,
      meeting_key: meetingKey,
      radio_selection: radioSelection,
      is_map_showing: isMapShowing,
      location_address: locationAddress,
      location_lat: locationLat,
      location_lng: locationLng,
      organizer_first_name: organizerFirstName,
      organizer_last_name: organizerLastName,
      organizer_pronouns: organizerPronouns,
      organizer_email: organizerEmail,
      target_audience: targetAudience,
      created_by_id: createdById,
      ...rest,
    };

    const requestBody = {...apiEvent};

  //   axios.patch(`${kBaseUrl}/events/${eventId}`, requestBody)
  //     .then(response => {
  //       console.log('Event update: success');
  //       routeChange();
  //     }
  //   )
  //     .catch(error => {
  //       console.log(error);
  //     }
  //   );
  };

  const convertUserFromApi = (apiUser) => {
		const {
			first_name,
			last_name,
      pronouns,
      email
		} = apiUser;

		const jsUser = {
			firstName: first_name || '',
			lastName: last_name || '',
      pronouns: pronouns || '',
			email: email || ''
		};
    return jsUser;
	};

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

  useEffect(() => {
    axios.get(`${kBaseUrl}/users/${user}`, {})
      .then((response) => {
        const convertedData = convertUserFromApi(response.data.user);
        setUserData(convertedData);
        setOrganizerData({
          organizerFirstName: convertedData.firstName,
          organizerLastName: convertedData.lastName,
          organizerPronouns: convertedData.pronouns || '',
          organizerEmail: convertedData.email
        });
      });
  }, [user]);

  // const deleteEvent = () => {
  //   axios.delete(`${kBaseUrl}/users/${userData.id}`)
  //     .then(response => {
  //       console.log('Event deleted: succss');
  //       routeChange();
  //     }
  //   )
  //     .catch(error => {
  //       console.log(error);
  //     }
  //   );
  // };

  //upload profile pic to cloud storage
  const handleImageUpload = () => {
    const formData = new FormData();
    formData.append('image', image);
    axios.post(`${kBaseUrl}/images/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      } 
    }
  )
    .then(response => {
      console.log('Image URL: success');
      setTempEventData({...tempEventData, imageUrl: response.data});
      setImageSaved(true);
    }
  )
    .catch(error => {
      console.log(error);
    }
  )
};

  const ref = useRef();

  const resetImage = (event) => {
    setTempEventData({...tempEventData, imageUrl: ''});
    setImageSaved(false);
    ref.current.value = "";
  };

  const updateLocation = (location) => {
    geocodeByAddress(location)
    .then(results => getLatLng(results[0]))
    .then(latLng => {
      console.log('Set location: success');
      const latStr = latLng['lat'].toString();
      const lngStr = latLng['lng'].toString();
      setTempEventData({
        ...tempEventData,
        locationAddress: location,
        locationLat: latStr,
        locationLng: lngStr,
    });
    })
    .catch(error => console.error('Error', error));
  };
  
  const updateTitle = (event) => {
    setTempEventData({...tempEventData, title: event.target.value});
  };
  
  const updateDescription = (event) => {
    setTempEventData({...tempEventData, description: event.target.value});
  };

  const updateTimezone = (event) => {
    setTempEventData({...tempEventData, timezone: event.target.value});
  };

  const onRadioSelection = (event) => {
    setTempEventData({...tempEventData, radioSelection: event.target.value});
    // setTempEventData({...tempEventData, isMapShowing: !isMapShowing});
  };

  const updateVideoConfLink = (event) => {
    setTempEventData({...tempEventData, videoConfLink: event.target.value});
  };

  const updateMeetingKey = (event) => {
    setTempEventData({...tempEventData, meetingKey: event.target.value});
  };

  const updateAudience = (event) => {
    setTempEventData({...tempEventData, targetAudience: event.target.value});
  };

  const createdByName = `${userData.firstName} ${userData.lastName}`
  const createdById = userData.id

  const onFormSubmit = (event) => {
    event.preventDefault();
    // const {
    //   organizerFirstName,
    //   organizerLastName,
    //   organizerPronouns,
    //   organizerEmail,
    // } = organizerData;
    updateEventInApi(tempEventData);
  };
  

  return (
		<form onSubmit={onFormSubmit} className="newEventForm">
			<label htmlFor="title">Event Title</label>
			<input
				type="text"
				minLength={1}
				maxLength={100}
				value={tempEventData.title}
				onChange={updateTitle}
			></input>
			<br />
			<br />
			<label htmlFor="description">Description</label>
			<input
				type="text"
				minLength={1}
				maxLength={300}
				value={tempEventData.description}
				onChange={updateDescription}
			></input>
			<br />
			<br />
      <div>
      <label htmlFor="image">Upload Event Image</label>
      {(tempEventData.imageUrl || image) && (
        <>
          <ImagePreview src={tempEventData.profilePicUrl || image} alt='' />
          <button type="button" onClick={resetImage}>Remove</button>
          <button type="button" onClick={handleImageUpload}>Save</button>
        </>
      )}
      <br />
      <br />
      <input
        type="file"
        ref={ref}
        onChange={(event) => {setImage(event.target.files[0])}}
      />
      </div>
			<br />
			<br />
			<input
				type="radio"
				className="location"
				value="Online"
				checked={tempEventData.radioSelection === "Online"}
				onChange={onRadioSelection}
			/>
			<label htmlFor="online"> Online</label>
			<br />
			<p>Link or Meeting ID</p>
			<input
				type="text"
				minLength={1}
				maxLength={60}
				value={tempEventData.videoConfLink}
				onChange={updateVideoConfLink}
			></input>
			<p>Key, if any</p>
			<input
				type="text"
				minLength={1}
				maxLength={40}
				value={tempEventData.meetingKey}
				onChange={updateMeetingKey}
			></input>
			<br />
			<input
				type="radio"
				className="location"
				value="In-Person"
				checked={tempEventData.radioSelection === "In-Person"}
				onChange={onRadioSelection}
			/>
			<label htmlFor="inPerson"> In-Person</label>
			<br />
			{/* {isMapShowing && (
				<div className="map">
					<EventMap selectLocation={updateLocation} />
				</div>
			)} */}
			<br />
			<p>Start (saved): {setEventData.dateTimeStart}</p>
      <br />
      <p>New Start Time</p>
			<DateTimePicker
				onChange={onChangeStart}
				value={tempEventData.dateTimeStart}
				disableClock={true}
				format="MMMM dd yyyy   h:mm aa"
			/>
			<br />
			<p>End (saved): {setEventData.dateTimeStop}</p>
      <br />
      <p>New Stop Time</p>
			<DateTimePicker
				onChange={onChangeStop}
				value={tempEventData.dateTimeStop}
				disableClock={true}
				format="MMMM dd yyyy   h:mm aa"
			/>
			<br />
			<p>Timezone</p>
			<input
				type="text"
				minLength={1}
				maxLength={40}
				value={tempEventData.timezone}
				onChange={updateTimezone}
			></input>
			<br />
			<label htmlFor="organizerFirstName">Organizer's First Name</label>
			<input
				type="text"
				minLength={1}
				maxLength={30}
				value={tempEventData.organizerFirstName}
				onChange={(event) => {
					setOrganizerData({...organizerData, organizerFirstName: event.target.value});
				}}
			></input>
			<br />
			<br />
			<label htmlFor="organizerLastName">Organizer's Last Name</label>
			<input
				type="text"
				minLength={1}
				maxLength={30}
				value={tempEventData.organizerLastName}
				onChange={(event) => {
					setOrganizerData({...organizerData, organizerLastName: event.target.value});
				}}
			></input>
			<br />
			<br />
			<label htmlFor="organizerPronouns">Organizer's Pronouns, if known</label>
			<input
				type="text"
				minLength={1}
				maxLength={30}
				value={tempEventData.organizerPronouns}
				onChange={(event) => {
					setOrganizerData({...organizerData, organizerPronouns: event.target.value});
				}}
			></input>
			<br />
			<br />
			<label htmlFor="organizerEmail">Organizer's Email</label>
			<input
				type="text"
				minLength={1}
				maxLength={60}
				value={tempEventData.organizerEmail}
				onChange={(event) => {
					setOrganizerData({...organizerData, organizerEmail: event.target.value});
				}}
			></input>
			<br />
			<br />
			<input
				type="radio"
				className="audience"
				value="Everyone"
				checked={tempEventData.targetAudience === "Everyone"}
				onChange={updateAudience}
			></input>
			<label htmlFor="everyone"> All Black Adies</label>
			<br />
			<input
				type="radio"
				className="audience"
				value="Adie Alum"
				checked={tempEventData.targetAudience === "Adie Alum"}
				onChange={updateAudience}
			></input>
			<label htmlFor="adieAlum"> Black Adie Alum</label>
			<br />
			<input
				type="radio"
				className="audience"
				value="Internship Adies"
				checked={tempEventData.targetAudience === "Internship Adies"}
				onChange={updateAudience}
			></input>
			<label htmlFor="internshipAdies"> Internship Black Adies</label>
			<br />
			<input
				type="radio"
				className="audience"
				value="Classroom Adies"
				checked={tempEventData.targetAudience === "Classroom Adies"}
				onChange={updateAudience}
			></input>
			<label htmlFor="classroomAdies"> Classroom Black Adies</label>
			<br />
			<input
				type="radio"
				className="audience"
				value="Not Black@Ada Specific"
				checked={tempEventData.targetAudience === "Not Black@Ada Specific"}
				onChange={updateAudience}
			></input>
			<label htmlFor="anyone"> Not Black@Ada Specific</label>
			<br />
			<br />
			<br />
			<p>
				Event added by: {createdByName}
			</p>
			<br />
			<br />
			<section className="buttonGrid">
				<input
					type="submit"
					value="Submit"
					className="button"
					disabled={
						!tempEventData.title ||
						!tempEventData.description ||
            !tempEventData.dateTimeStart
					}
				></input>
				{/* <button type="button" onClick={saveDraft}>Save Draft</button>
				<button type="button" onClick={deleteEvent}>Delete Event</button> */}
			</section>
		</form>
  );
};

export default NewEventForm;