import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import EventMap from './EventMap';
import axios from 'axios';
import DateTimePicker from 'react-datetime-picker';
import  { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { getItemFromLocalStorage, convertToApi, convertFromApi } from '../utils';
import ImagePreview from '../components/ImagePreview';
import '../styles/NewForms.css';

const kBaseUrl = 'http://localhost:5000';

const kDefaultFormState = {
  title: '',
  description: '',
  dateTimeStart: '',
  dateTimeStop: '',
  imageUrl: '',
  timezone: '',
  videoConfLink: '',
  meetingKey: '',
  onlineInPerson: 'Online',
  locationAddress: '',
  locationLat: '',
  locationLng: '',
  organizerFirstName: '',
  organizerLastName: '',
  organizerPronouns: '',
  organizerEmail: '',
  targetAudience: 'All Black Adies',
  createdById: ''
}

const getDataFromApi = (string, id) => {
  return axios.get(`${kBaseUrl}/${string}s/${id}`)
  .then((response) => {
    return convertFromApi(response.data[string])
  })
  .catch(error => {
    console.log(error);
  })
};


const UpdateEventForm = () => {

  const eventId = parseInt(getItemFromLocalStorage('event'));
  const userId = parseInt(getItemFromLocalStorage('user'));

  const ref = useRef();

  const navigate = useNavigate();
  const routeChange = () => {
    navigate('/events')
  };

  // original unmodified data stored in event data; modified data stored in
  // tempEventData until patch request is sent and event database updated
  const [eventData, setEventData] = useState(kDefaultFormState);
  const [tempEventData, setTempEventData] = useState(kDefaultFormState);

  const [userData, setUserData] = useState({});
  const [creator, setCreator] = useState(false);
  const [dateTimeStart, onChangeStart] = useState(new Date());
  const [dateTimeStop, onChangeStop] = useState(new Date());
  const [image, setImage] = useState('');
  const [imageSaved, setImageSaved] = useState(false);

  // compares user id in localStorage with event creator id to confirm user is creator
  const validateCreator = useCallback((userId) => {
    console.log(userId, eventData.createdById)
    if (userId === eventData.createdById) {
      return setCreator(true);
  }}, [eventData.createdById]);

  // generic function to get event or user data from api
  const getData = useCallback((string, id) => {
    return getDataFromApi(string, id)
    .then(response => {
      if ('dateTimeStart' in response) {
        setEventData(response);
        setTempEventData(response);
      } else {
        setUserData(response);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);

  useEffect(() => {
    getData('event', eventId);
    getData('user', userId);
    validateCreator(userId);
  }, [getData, validateCreator, eventId, userId]);
  
  const createdByName = `${userData.firstName} ${userData.lastName}`

  // send event pic to cloud storage
  const handleImageUpload = () => {
    const imageCloudData = new FormData();
    imageCloudData.append('image', image);
    axios.post(`${kBaseUrl}/images/upload`, imageCloudData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    .then(response => {
      console.log('Image URL: success');
      setTempEventData({...tempEventData, imageUrl: response.data.url});
      setImageSaved(true);
    })
    .catch(error => {
      console.log(error);
    })
  };

  const resetImage = (event) => {
    setImage('');
    setImageSaved(false);
    setTempEventData({...tempEventData, imageUrl: ''});
    ref.current.value = '';
  };

  const updateLocation = (location) => {
    return geocodeByAddress(location)
    .then(results => getLatLng(results[0]))
    .then(latLng => {
      const latStr = latLng['lat'].toString();
      const lngStr = latLng['lng'].toString();
      setTempEventData({
        ...tempEventData,
        locationAddress: location,
        locationLat: latStr,
        locationLng: lngStr})
      console.log('Location update: success');
    })
    .catch(error => console.log('Error', error));
  };

  // generic change event handler
  const handleUpdate = (event) => {
    const fieldName = event.target.name;
    let fieldValue = event.target.value;
    if (fieldName === 'imageUrl') {
      setImage(event.target.files[0]);
      return;
    }
    setTempEventData({...tempEventData, [fieldName]: fieldValue});
  };

    // special handler for react-datetime-picker component
    const updateTimeStart = (event) => {
      const eventStart = event;
      onChangeStart(eventStart);
      setTempEventData({...tempEventData, dateTimeStart: eventStart});
    };
  
    // special handler for react-datetime-picker component
    const updateTimeStop = (event) => {
      const eventStop = event;
      onChangeStop(eventStop);
      setTempEventData({...tempEventData, dateTimeStop: eventStop});
    };
  
  const updateEventInApi = (data) => {
    const requestBody = convertToApi(data);
    console.log(requestBody)

    axios.patch(`${kBaseUrl}/events`, requestBody)
    .then(response => {
      console.log('Event update: success');
      routeChange();
    })
    .catch(error => {
      console.log(error);
    });
  };

  const deleteEvent = (id) => {
    axios.delete(`${kBaseUrl}/events/${id}`)
    .then(response => {
      console.log('Event delete: success');
      routeChange();
    })
    .catch(error => {
      console.log(error);
    });
  };

  const onFormSubmit = (event) => {
    event.preventDefault();
    updateEventInApi(tempEventData);
  };
  
  console.log(creator)

  return (
		<form onSubmit={onFormSubmit} className='newEventForm container'>
      <p className='instructions'>All fields marked with an * are required.</p>
      <div className='form-group form-row'>
        <label className='col-form-label' htmlFor='title'>*Event Title</label>
        <input
          type='text'
          className='form-control'
          id='title'
          minLength={1}
          maxLength={100}
          value={tempEventData.title}
          name='title'
          onChange={handleUpdate}
        ></input>
      </div>
      <div className='form-group form-row'> 
        <div className='col calendar'>
          <label htmlFor='startTime'>*Start: Date & Time</label>
          <DateTimePicker
            format='MMMM dd, yyyy|h:mm aa'
            disableClock={true}
            id='startTime'
            value={dateTimeStart}
            onChange={updateTimeStart}
          />
        </div>
        <div className='col calendar'>
          <label htmlFor='endTime'>*End: Date & Time</label>
          <DateTimePicker
            format='MMMM dd, yyyy|h:mm aa'
            disableClock={true}
            id='endTime'
            value={dateTimeStop}
            onChange={updateTimeStop}
          />
        </div>
        <div className='col'>
          <label htmlFor='timezone'>*Time Zone</label>
          <input
            type='text'
            className='form-control'
            id='timezone'
            minLength={1}
            maxLength={40}
            value={tempEventData.timezone}
            name='timezone'
            onChange={handleUpdate}
          ></input>
        </div>
      </div>
      <div className='form-group form-row'>
        <label className='col-form-label' htmlFor='description'>*Description</label>
        <textarea
          type='text'
          className='form-control'
          id='description'
          rows='3'
          minLength={1}
          maxLength={500}
          value={tempEventData.description}
          name='description'
          onChange={handleUpdate}
        ></textarea>
      </div>
      <fieldset className='form-group form-row'>
        <legend className='col-form-label col-sm-1 float-sm-left pt-0'>*Location:</legend>
        <div className='col'>
          <div className='form-check'>
            <input
              type='radio'
              className='form-check-input'
              name='onlineInPerson'
              id='online'
              value='Online'
              checked={tempEventData.onlineInPerson === 'Online'}
              onChange={handleUpdate}
              ></input>
            <label className='form-check-label' htmlFor='online'>Online</label>
          </div>
          <div className='form-check'>
            <input
              type='radio'
              className='form-check-input'
              name='onlineInPerson'
              id='inPerson'
              value='In-Person'
              checked={tempEventData.onlineInPerson === 'In-Person'}
              onChange={handleUpdate}
            ></input>
            <label className='form-check-label' htmlFor='inPerson'>In-Person</label>
          </div>
        </div>
        <div className='col'>
          <label htmlFor='linkOrMeetingId'>Link or Meeting ID</label>
          <input
            type='text'
            className='form-control'
            id='linkOrMeetingId'
            minLength={1}
            maxLength={60}
            value={tempEventData.videoConfLink}
            name='linkOrMeetingId'
            onInput={handleUpdate}
          ></input>
        </div>
        <div className='col'>
          <label htmlFor='meetingKey'>Meeting Key, if any</label>
          <input
            type='text'
            className='form-control'
            id='meetingKey'
            minLength={1}
            maxLength={40}
            value={tempEventData.meetingKey}
            name='meetingKey'
            onInput={handleUpdate}
          ></input>
        </div>
      </fieldset>
      <div className='form-group form-row'>
        <div className='col'>
          <p>For in-person events, enter an address or location below</p> 
            <div className='map'>
              <EventMap selectLocation={updateLocation} />
            </div>
        </div>
        <div className='col'>
          <label className='form-label' htmlFor='imageFile'>Upload an event-related image</label>
            {image ? 
              <>
                <ImagePreview src={image} alt='' />
                <button type='button' onClick={resetImage}>Remove</button>
                <button type='button' 
                className={imageSaved ? 'saved' : 'save'}
                onClick={handleImageUpload}
                >
                  {imageSaved ? 'Saved!' : 'Save'}
                </button>
                {!imageSaved ?
                    <p>Click <span className='text-save'>save</span> to confirm upload of your image</p>
                : ''}
              </>
            : ''}
            <br />
            {!imageSaved &&
            <>
              <label className='custom-file-upload' htmlFor='imageFile'>Choose Image</label>
              <input
                type='file'
                className='form-control-file custom-file-upload'
                id='imageFile'
                name='imageFile'
                ref={ref}
                onChange={(event) => {setImage(event.target.files[0])}}
              ></input>
            </>
            } 
        </div>
      </div>
      <div className='form-group form-row'>
        <div className='col'>
          <label htmlFor='organizerFirstName'>Organizer's First Name</label>
          <input
            type='text'
            className='form-control'
            id='firstName'
            minLength={1}
            maxLength={30}
            value={tempEventData.organizerFirstName || ''}
            name='organizerFirstName'
            onChange={handleUpdate}
          ></input>
        </div>
        <div className='col'>
          <label htmlFor='organizerLastName'>Organizer's Last Name</label>
          <input
            type='text'
            className='form-control'
            id='lastName'
            minLength={1}
            maxLength={30}
            value={tempEventData.organizerLastName || ''}
            name='organizerLastName'
            onChange={handleUpdate}
          ></input>
        </div>
        <div className='col'>
          <label htmlFor='organizerPronouns'>Organizer's Pronouns, if known</label>
          <input
            type='text'
            className='form-control'
            id='pronouns'
            minLength={1}
            maxLength={30}
            value={tempEventData.organizerPronouns || ''}
            name='organizerPronouns'
            onChange={handleUpdate}
          ></input>
        </div>
        <div className='col'>
          <label htmlFor='organizerEmail'>Organizer's Email</label>
          <input
            type='email'
            className='form-control'
            id='email'
            minLength={1}
            maxLength={60}
            value={tempEventData.organizerEmail || ''}
            name='organizerEmail'
            onChange={handleUpdate}
          ></input>
        </div>
      </div>
      <fieldset className='form-group form-row'>
        <legend className='col-form-label col-sm-2 float-sm-left pt-0'>*Target Audience:</legend>
        <div className='col-sm-10'>
          <div className='form-check'>
            <input
              type='radio'
              className='form-check-input'
              name='targetAudience'
              id='audienceAllBlackAdies'
              value='All Black Adies'
              checked={tempEventData.targetAudience === 'All Black Adies'}
              onChange={handleUpdate}
            ></input>
            <label className='form-check-label audience' htmlFor='audienceAllBlackAdies'>All Black Adies</label>
          </div>
          <div className='form-check'>
            <input
              type='radio'
              className='form-check-input'
              name='targetAudience'
              id='audienceBlackAdieAlum'
              value='Black Adie Alum'
              checked={tempEventData.targetAudience === 'Black Adie Alum'}
              onChange={handleUpdate}
            ></input>
            <label className='form-check-label audience' htmlFor='audienceBlackAdieAlum'>Black Adie Alum</label>
          </div>
          <div className='form-check'>
            <input
              type='radio'
              className='form-check-input'
              name='targetAudience'
              id='audienceInternBlackAdies'
              value='Internship Black Adies'
              checked={tempEventData.targetAudience === 'Internship Black Adies'}
              onChange={handleUpdate}
            ></input>
            <label className='form-check-label audience' htmlFor='audienceInternBlackAdies'>Internship Black Adies</label>
          </div>
          <div className='form-check'>
            <input
              type='radio'
              className='form-check-input'
              name='targetAudience'
              id='audienceClassBlackAdies'
              value='Classroom Black Adies'
              checked={tempEventData.targetAudience === 'Classroom Black Adies'}
              onChange={handleUpdate}
            ></input>
            <label className='form-check-label audience' htmlFor='audienceClassBlackAdies'>Classroom Black Adies</label>
          </div>
          <div className='form-check'>
            <input
              type='radio'
              className='form-check-input'
              name='targetAudience'
              id='audienceAnyone'
              value='Not Black@Ada Specific'
              checked={tempEventData.targetAudience === 'Not Black@Ada Specific'}
              onChange={handleUpdate}
            ></input>
            <label className='form-check-label audience' htmlFor='audienceAnyone'>Not Black@Ada Specific</label>
          </div>
        </div>
      </fieldset>
      <br />
      <p>Event added by: {createdByName}</p>
			<br />
      {creator &&
			<section className='buttonGrid'>
				<input
					type='submit'
					value='Update Event'
					className='button'
					disabled={
						!tempEventData.title ||
						!tempEventData.description ||
            !tempEventData.dateTimeStart ||
            !tempEventData.dateTimeStop ||
            !tempEventData.timezone
					}
				></input>
				<button type='button' onClick={deleteEvent}>Cancel Event</button>
			</section>}
		</form>
  );
};

export default UpdateEventForm;