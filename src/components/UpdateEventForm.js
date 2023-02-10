import React, { useState, useEffect, useRef } from "react";
import EventMap from "./EventMap";
import axios from 'axios';
import DateTimePicker from "react-datetime-picker";
import  { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import ImagePreview from '../components/ImagePreview';
import "../styles/NewForms.css";

const kBaseUrl = 'http://localhost:5000';

// save draft and delete event capabilities for user creating event

const NewEventForm = () => {

  const user = localStorage.getItem('user')

  const [userData, setUserData] = useState({});
  const [organizerData, setOrganizerData] = useState({})
  const [imageSaved, setImageSaved] = useState(false);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState('');
  const [imageUrl, setImageUrl] = useState('')
  const [dateTimeStart, onChangeStart] = useState(new Date());
  const [dateTimeStop, onChangeStop] = useState(new Date());
  const [timezone, setTimezone] = useState("");
  const [videoConfLink, setVideoConfLink] = useState("");
  const [meetingKey, setMeetingKey] = useState('');
  const [radioSelection, setRadioSelection] = useState("Online");
  const [isMapShowing, setIsMapShowing] = useState(false);
  const [locationAddress, setLocationAddress] = useState(""); 
  const [locationLat, setLocationLat] = useState("");
  const [locationLng, setLocationLng] = useState("");
  const [targetAudience, setTargetAudience] = useState("Everyone");

  const addNewEventToApi = (jsEvent) => {
    console.log(jsEvent)
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

    axios.post(`${kBaseUrl}/events`, requestBody)
      .then(response => {
        console.log('New event created: success');
      }
    )
      .catch(error => {
        console.log(error);
      }
    );
  };

  const convertUserFromApi = (apiUser) => {
		const {
			first_name,
			last_name,
			location_name,
			location_lat,
			location_lng,
			include_name_salary,
			job_title,
			years_experience,
			...rest
		} = apiUser;

		const jsUser = {
			firstName: first_name,
			lastName: last_name,
			locationName: location_name,
			locationLat: location_lat,
			locationLng: location_lng,
			includeNameSalary: include_name_salary,
			jobTitle: job_title,
			yearsExperience: years_experience,
			...rest,
		};
    return jsUser;
	};

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
        setImageUrl(response.data);
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
    setImageSaved(false)
    ref.current.value = "";
  };

  const addLocation = (location) => {
    geocodeByAddress(location)
    .then(results => getLatLng(results[0]))
    .then(latLng => {
      console.log('Success', latLng);
      setLocationAddress(location);
      const latStr = latLng['lat'].toString();
      const lngStr = latLng['lng'].toString();
      setLocationLat(latStr);
      setLocationLng(lngStr);
    })
    .catch(error => console.error('Error', error));
  };
  
  const addTitle = (event) => {
    setTitle(event.target.value);
  };
  
  const addDescription = (event) => {
    setDescription(event.target.value);
  };

  const addTimezone = (event) => {
    setTimezone(event.target.value);
  };

  const onRadioSelection = (event) => {
    setRadioSelection(event.target.value);
    setIsMapShowing(!isMapShowing);
  };

  const addVideoConfLink = (event) => {
    setVideoConfLink(event.target.value);
  };

  const addMeetingKey = (event) => {
    setMeetingKey(event.target.value);
  };

  const handleAudience = (event) => {
    setTargetAudience((targetAudience) => event.target.value);
  };

  const createdByName = `${userData.firstName} ${userData.lastName}`
  const createdById = userData.id

  const onFormSubmit = (event) => {
    event.preventDefault();
    const {
      organizerFirstName,
      organizerLastName,
      organizerPronouns,
      organizerEmail,
    } = organizerData;
    addNewEventToApi({
      title,
      description,
      imageUrl, 
      dateTimeStart,
      dateTimeStop,
      timezone,
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
      createdById
    });
  };
  

  return (
		<form onSubmit={onFormSubmit} className="newEventForm">
			<label htmlFor="title">Event Title</label>
			<input
				type="text"
				minLength={1}
				maxLength={100}
				value={title}
				onChange={addTitle}
			></input>
			<br />
			<br />
			<label htmlFor="description">Description</label>
			<input
				type="text"
				minLength={1}
				maxLength={300}
				value={description}
				onChange={addDescription}
			></input>
			<br />
			<br />
      <div>
        <label htmlFor="image">Upload Event Image</label>
        {image && (
          <>
            <ImagePreview src={image} alt="" />
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
				checked={radioSelection === "Online"}
				onChange={onRadioSelection}
			/>
			<label htmlFor="online"> Online</label>
			<br />
			<p>Link or Meeting ID</p>
			<input
				type="text"
				minLength={1}
				maxLength={60}
				value={videoConfLink}
				onChange={addVideoConfLink}
			></input>
			<p>Key, if any</p>
			<input
				type="text"
				minLength={1}
				maxLength={40}
				value={meetingKey}
				onChange={addMeetingKey}
			></input>
			<br />
			<input
				type="radio"
				className="location"
				value="In-Person"
				checked={radioSelection === "In-Person"}
				onChange={onRadioSelection}
			/>
			<label htmlFor="inPerson"> In-Person</label>
			<br />
			{isMapShowing && (
				<div className="map">
					<EventMap selectLocation={addLocation} />
				</div>
			)}
			<br />
			<p>Start</p>
			<DateTimePicker
				onChange={onChangeStart}
				value={dateTimeStart}
				disableClock={true}
				format="MMMM dd yyyy   h:mm aa"
			/>
			<br />
			<p>End</p>
			<DateTimePicker
				onChange={onChangeStop}
				value={dateTimeStop}
				disableClock={true}
				format="MMMM dd yyyy   h:mm aa"
			/>
			<br />
			<p>Timezone</p>
			<input
				type="text"
				minLength={1}
				maxLength={40}
				value={timezone}
				onChange={addTimezone}
			></input>
			<br />
			<label htmlFor="organizerFirstName">Organizer's First Name</label>
			<input
				type="text"
				minLength={1}
				maxLength={30}
				value={organizerData.organizerFirstName || ''}
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
				value={organizerData.organizerLastName || ''}
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
				value={organizerData.organizerPronouns || ""}
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
				value={organizerData.organizerEmail || ''}
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
				checked={targetAudience === "Everyone"}
				onChange={handleAudience}
			></input>
			<label htmlFor="everyone"> All Black Adies</label>
			<br />
			<input
				type="radio"
				className="audience"
				value="Adie Alum"
				checked={targetAudience === "Adie Alum"}
				onChange={handleAudience}
			></input>
			<label htmlFor="adieAlum"> Black Adie Alum</label>
			<br />
			<input
				type="radio"
				className="audience"
				value="Internship Adies"
				checked={targetAudience === "Internship Adies"}
				onChange={handleAudience}
			></input>
			<label htmlFor="internshipAdies"> Internship Black Adies</label>
			<br />
			<input
				type="radio"
				className="audience"
				value="Classroom Adies"
				checked={targetAudience === "Classroom Adies"}
				onChange={handleAudience}
			></input>
			<label htmlFor="classroomAdies"> Classroom Black Adies</label>
			<br />
			<input
				type="radio"
				className="audience"
				value="Not Black@Ada Specific"
				checked={targetAudience === "Not Black@Ada Specific"}
				onChange={handleAudience}
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
						!title ||
						!description ||
            !dateTimeStart
					}
				></input>
				<button>Save Draft</button>
				<button>Delete Event</button>
			</section>
		</form>
  );
};

export default NewEventForm;