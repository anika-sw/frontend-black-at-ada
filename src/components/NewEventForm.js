import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import EventMap from './EventMap';
import axios from 'axios';
import DateTimePicker from 'react-datetime-picker';
import  { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { getItemFromLocalStorage, convertToApi, convertFromApi } from '../utils';
import ImagePreview from '../components/ImagePreview';
import '../styles/NewForms.css';
import '../styles/react-datetime-picker.css'

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
  createdById: null
}

const getUserDataFromApi = (id) => {
  return axios.get(`${kBaseUrl}/users/${id}`)
  .then((response) => {
    return convertFromApi(response.data.user); 
  })
  .catch(error => {
    console.log(error);
  })
};


const NewEventForm = () => {
  
  const userId = parseInt(getItemFromLocalStorage('user'));
  
  const ref = useRef();

  const navigate = useNavigate();
  const routeChange = () => {
    navigate('/events')
  };
  
  const [newEventData, setNewEventData] = useState(kDefaultFormState);
  
  const [userData, setUserData] = useState({});
  const [dateTimeStart, onChangeStart] = useState(new Date());
  const [dateTimeStop, onChangeStop] = useState(new Date());
  const [image, setImage] = useState('');
  const [imageSaved, setImageSaved] = useState(false);
  
  const getUserData = useCallback((id) => {
    return getUserDataFromApi(id)
    .then(user => {
      setUserData(user);
      setNewEventData((previousNewEventData) => ({
        ...previousNewEventData,
        organizerFirstName: user.firstName,
        organizerLastName: user.lastName,
        organizerPronouns: user.pronouns || '',
        organizerEmail: user.email,
        createdById: user.id
      }));
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);
  
  useEffect(() => {
    getUserData(userId)
  }, [getUserData, userId]);
  
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
      setNewEventData({...newEventData, imageUrl: response.data.url});
      setImageSaved(true);
    })
    .catch(error => {
      console.log(error);
    })
  };

  const resetImage = (event) => {
    setImage('');
    setImageSaved(false);
    ref.current.value = '';
  };

  // address autocomplete logic; passed as props to autocomplete component
  const getLocation = (location) => {
    return geocodeByAddress(location)
    .then(results => getLatLng(results[0]))
    .then(latLng => {
      const latStr = latLng['lat'].toString();
      const lngStr = latLng['lng'].toString();
      setNewEventData({
        ...newEventData,
        locationAddress: location,
        locationLat: latStr, 
        locationLng: lngStr})
      console.log('Set location: success');
      })
    .catch(error => console.log('Error', error));
  };

  // generic change event handler
  const handleChange = (event) => {
    const fieldName = event.target.name;
    let fieldValue = event.target.value;
    if (fieldName === 'imageUrl') {
      setImage(event.target.files[0]);
      return;
    }
    setNewEventData({...newEventData, [fieldName]: fieldValue});
  };

  // special handler for react-datetime-picker component
  const handleTimeStart = (event) => {
    const eventStart = event;
    onChangeStart(eventStart);
    setNewEventData({...newEventData, dateTimeStart: eventStart});
  };

  // special handler for react-datetime-picker component
  const handleTimeStop = (event) => {
    const eventStop = event;
    onChangeStop(eventStop);
    setNewEventData({...newEventData, dateTimeStop: eventStop});
  };

  const addNewEventToApi = (data) => {
    const requestBody = convertToApi(data);

    axios.post(`${kBaseUrl}/events`, requestBody)
    .then(response => {
      console.log('New event created: success');
      routeChange();
    })
    .catch(error => {
      console.log(error);
    });
  };

  const onFormSubmit = (event) => {
    event.preventDefault();
    addNewEventToApi(newEventData);
  };
  

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
          value={newEventData.title}
          name='title'
          onChange={handleChange}
        ></input>
      </div>
      <div className='form-group form-row'> 
        <div className='col calendar'>
          <label htmlFor='startTime'>*Start: Date & Time</label>
          <DateTimePicker
            format='MMMM dd, yyyy   h:mm aa'
            disableClock={true}
            id='startTime'
            calendarStartDay={1}
            value={dateTimeStart}
            onChange={handleTimeStart}
          />
        </div>
        <div className='col calendar'>
          <label htmlFor='endTime'>*End: Date & Time</label>
          <DateTimePicker
            format='MMMM dd, yyyy   h:mm aa'
            disableClock={true}
            id='endTime'
            value={dateTimeStop}
            onChange={handleTimeStop}
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
            value={newEventData.timezone}
            name='timezone'
            onChange={handleChange}
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
          value={newEventData.description}
          name='description'
          onChange={handleChange}
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
              checked={newEventData.onlineInPerson === 'Online'}
              onChange={handleChange}
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
              checked={newEventData.onlineInPerson === 'In-Person'}
              onChange={handleChange}
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
            value={newEventData.videoConfLink}
            name='linkOrMeetingId'
            onInput={handleChange}
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
            value={newEventData.meetingKey}
            name='meetingKey'
            onInput={handleChange}
          ></input>
        </div>
      </fieldset>
      <div className='form-group form-row'>
        <div className='col'>
          <p>For in-person events, enter an address or location below</p> 
            <div className='map'>
              <EventMap selectLocation={getLocation} />
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
            value={newEventData.organizerFirstName || ''}
            name='organizerFirstName'
            onChange={handleChange}
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
            value={newEventData.organizerLastName || ''}
            name='organizerLastName'
            onChange={handleChange}
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
            value={newEventData.organizerPronouns || ''}
            name='organizerPronouns'
            onChange={handleChange}
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
            value={newEventData.organizerEmail || ''}
            name='organizerEmail'
            onChange={handleChange}
          ></input>
        </div>
        <p>(Organizer details are autofilled. If you are not the organizer, please update the information before saving.)</p>
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
              checked={newEventData.targetAudience === 'All Black Adies'}
              onChange={handleChange}
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
              checked={newEventData.targetAudience === 'Black Adie Alum'}
              onChange={handleChange}
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
              checked={newEventData.targetAudience === 'Internship Black Adies'}
              onChange={handleChange}
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
              checked={newEventData.targetAudience === 'Classroom Black Adies'}
              onChange={handleChange}
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
              checked={newEventData.targetAudience === 'Not Black@Ada Specific'}
              onChange={handleChange}
            ></input>
            <label className='form-check-label audience' htmlFor='audienceAnyone'>Not Black@Ada Specific</label>
          </div>
        </div>
      </fieldset>
      <br />
      <p>Event added by: {createdByName}</p>
      <br />
      <input
        type='submit'
        value='Submit'
        className='button'
        disabled={
          !newEventData.title ||
          !newEventData.description ||
          !newEventData.dateTimeStart ||
          !newEventData.dateTimeStop ||
          !newEventData.timezone
        }
      ></input>
		</form>
  );
};

export default NewEventForm;