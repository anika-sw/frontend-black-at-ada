import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import EventMap from './EventMap';
import axios from 'axios';
import DateTimePicker from 'react-datetime-picker';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import {
	getItemFromLocalStorage,
	convertToApi,
	convertFromApi,
} from '../utils';
import ImagePreview from '../components/ImagePreview';
import '../styles/EventForms.css';

const kBaseUrl = process.env.REACT_APP_BE_URL;

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
	createdById: null,
};

const getDataFromApi = (string, id) => {
	return axios
		.get(`${kBaseUrl}/${string}s/${id}`)
		.then((response) => {
			return convertFromApi(response.data[string]);
		})
		.catch((error) => {
			console.log(error);
		});
};

const UpdateEventForm = () => {
	const eventId = parseInt(getItemFromLocalStorage('event'));
	const userId = parseInt(getItemFromLocalStorage('user'));

	const ref = useRef();

	const navigate = useNavigate();
	const routeChange = () => {
		navigate('/events');
	};

	// original unmodified data stored in event data; modified data stored in
	// tempEventData until patch request is sent and event database updated
	const [eventData, setEventData] = useState(kDefaultFormState);
	const [tempEventData, setTempEventData] = useState(kDefaultFormState);

	const [userData, setUserData] = useState({});
	const [creator, setCreator] = useState(false);
	const [dateTimeStart, onChangeStart] = useState(new Date());
	const [dateTimeStop, onChangeStop] = useState(new Date());
	const [revealMap, setRevealMap] = useState(false);
	const [image, setImage] = useState('');
	const [imageSaved, setImageSaved] = useState(false);

	// compares user id in localStorage with event creator id to confirm user is creator
	const validateCreator = useCallback(
		(userId) => {
			if (userId === eventData.createdById) {
				return setCreator(true);
			}
		},
		[eventData.createdById]
	);

	// generic function to get event or user data from api
	const getData = useCallback((string, id) => {
		return getDataFromApi(string, id)
			.then((response) => {
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
		window.scrollTo(0, 0);
		getData('event', eventId);
		getData('user', userId);
		validateCreator(userId);
	}, [getData, validateCreator, eventId, userId]);

	const createdByName = `${userData.firstName} ${userData.lastName}`;

  const handleOnlineInPerson = (event) => {
    console.log(event)
    const fieldName = event.target.name;
    let fieldValue = event.target.value;
    if (fieldName === 'onlineInPerson' && fieldValue === 'Online') {
      setTempEventData({
        ...tempEventData, onlineInPerson: 'Online',
        locationAddress: '',
        locationLat: '',
        locationLng: '',
      });	
    } else {
        setTempEventData({...tempEventData, onlineInPerson: 'In-Person'
        });	
    }
  };

	const toggleMap = (event) => {
    setRevealMap(!revealMap);
	};
  
	const locationReset = (event) => {
    setRevealMap(false);
    setTempEventData({
      ...tempEventData,
      locationAddress: '',
      locationLat: '',
      locationLng: '',
    });
    console.log('Location removed');
		ref.current.value = '';
	};
  
	const updateLocation = (location) => {
    return geocodeByAddress(location)
    .then((results) => getLatLng(results[0]))
    .then((latLng) => {
      const latStr = latLng['lat'].toString();
      const lngStr = latLng['lng'].toString();
      setTempEventData({
        ...tempEventData,
        locationAddress: location,
        locationLat: latStr,
        locationLng: lngStr,
      });
      console.log('Location update: success');
    })
    .catch((error) => console.log('Error', error));
	};
  
  // send event pic to cloud storage
  const handleImageUpload = () => {
    const imageCloudData = new FormData();
    imageCloudData.append('image', image);
    axios
      .post(`${kBaseUrl}/images/upload`, imageCloudData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log('Image URL: success');
        setTempEventData({
          ...tempEventData,
          imageUrl: response.data.url,
        });
        setImageSaved(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

    const resetImage = (event) => {
      setImage('');
      setImageSaved(false);
      setTempEventData({ ...tempEventData, imageUrl: '' });
      ref.current.value = '';
    };
  
	// generic change event handler
	const handleUpdate = (event) => {
    const fieldName = event.target.name;
		let fieldValue = event.target.value;
    console.log(fieldName, fieldValue);
		if (fieldName === 'imageUrl') {
			setImage(event.target.files[0]);
			return;
		}
		setTempEventData({ ...tempEventData, [fieldName]: fieldValue });
	};

	// special handler for react-datetime-picker component
	const updateTimeStart = (event) => {
		const eventStart = event;
		onChangeStart(eventStart);
		setTempEventData({ ...tempEventData, [dateTimeStart]: eventStart });
	};

	// special handler for react-datetime-picker component
	const updateTimeStop = (event) => {
		const eventStop = event;
		onChangeStop(eventStop);
		setTempEventData({ ...tempEventData, [dateTimeStop]: eventStop });
	};

	const updateEventInApi = (data) => {
		const requestBody = convertToApi(data);
    console.log(requestBody);
		axios
			.patch(`${kBaseUrl}/events/${eventId}`, requestBody)
			.then((response) => {
				console.log('Event update: success');
				routeChange();
				window.scrollTo(0, 0);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const deleteEvent = (event) => {
		axios
			.delete(`${kBaseUrl}/events/${eventId}`)
			.then((response) => {
				console.log('Event delete: success');
				routeChange();
				window.scrollTo(0, 0);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const onFormSubmit = (event) => {
		event.preventDefault();
		updateEventInApi(tempEventData);
	};

	return (
		<form onSubmit={onFormSubmit} className='eventForm'>
			<p className='instructions'>
				All fields marked with an * are required.
			</p>
			<div className='form-group'>
				<div className='title-row'>
					<label className='col-form-label title' htmlFor='title'>
						Event Title*
					</label>
					<div>
						<input
							type='text'
							className='form-control title-input'
							id='title'
							minLength={1}
							maxLength={100}
							value={tempEventData.title}
							name='title'
							onChange={handleUpdate}
						></input>
					</div>
				</div>
			</div>
			<div className='form-group form-row'>
				<div className='col calendar'>
					<label htmlFor='startTime'>Start: Date & Time*</label>
					<DateTimePicker
						format='MMMM dd, yyyy   h:mm aa'
						disableClock={true}
						id='startTime'
						value={tempEventData.dateTimeStart}
						onChange={updateTimeStart}
					/>
				</div>
				<div className='col calendar'>
					<label htmlFor='endTime'>End: Date & Time*</label>
					<DateTimePicker
						format='MMMM dd, yyyy   h:mm aa'
						disableClock={true}
						id='endTime'
						value={tempEventData.dateTimeStop}
						onChange={updateTimeStop}
					/>
				</div>
				<div className='col'>
					<label htmlFor='timezone'>Time Zone*</label>
					<div>
						<input
							type='text'
							className='form-control timezone-input'
							id='timezone'
							minLength={1}
							maxLength={40}
							value={tempEventData.timezone}
							name='timezone'
							onChange={handleUpdate}
						></input>
					</div>
				</div>
			</div>
			<div className='form-group'>
				<div className='description-row'>
					<label className='col-form-label' htmlFor='description'>
						Description*
					</label>
					<div>
						<textarea
							type='text'
							className='form-control description-input'
							id='description'
							rows='3'
							minLength={1}
							maxLength={500}
							value={tempEventData.description}
							name='description'
							onChange={handleUpdate}
						></textarea>
					</div>
				</div>
			</div>
			<fieldset className='form-group form-row'>
				<legend className='col-form-label col-sm-1 float-sm-left pt-0'>
					Location*
				</legend>
				<div className='col'>
					<div className='form-check'>
						<input
							type='radio'
							className='form-check-input'
							name='onlineInPerson'
							id='online'
							value='Online'
							checked={tempEventData.onlineInPerson === 'Online'}
							onChange={handleOnlineInPerson}
						></input>
						<label className='form-check-label' htmlFor='online'>
							Online
						</label>
					</div>
					<div className='form-check'>
						<input
							type='radio'
							className='form-check-input'
							name='onlineInPerson'
							id='inPerson'
							value='In-Person'
							checked={
								tempEventData.onlineInPerson === 'In-Person'
							}
							onChange={handleOnlineInPerson}
						></input>
						<label className='form-check-label' htmlFor='inPerson'>
							In-Person
						</label>
					</div>
				</div>
				<div className='col'>
					<label htmlFor='videoConfLink'>Link or Meeting ID</label>
					<div>
						<input
							type='text'
							className='form-control'
							id='videoConfLink'
							minLength={1}
							maxLength={60}
							value={tempEventData.videoConfLink}
							name='videoConfLink'
							onChange={handleUpdate}
						></input>
					</div>
				</div>
				<div className='col'>
					<label htmlFor='meetingKey'>Meeting Key, if any</label>
					<div>
						<input
							type='text'
							className='form-control'
							id='meetingKey'
							minLength={1}
							maxLength={40}
							value={tempEventData.meetingKey}
							name='meetingKey'
							onChange={handleUpdate}
						></input>
					</div>
				</div>
			</fieldset>
			<div className='form-group form-row'>
        {eventData.onlineInPerson === 'Online' || tempEventData.onlineInPerson === 'Online' ? (
          <div className='col'>
            <label className='saved-location'>This is an online event</label>
          </div>
        ) : (
          <div className='col'>
            <label>Current in-person location:</label>
            <div className='saved-location'>
              {tempEventData.locationAddress}
            </div>
            <button type='button' className='map-toggle' onClick={toggleMap}>
              {!revealMap ? 'Update Location' : 'Hide Map'}
            </button>
            <button type='button' className='remove-location' onClick={locationReset}>
              Remove
            </button>
            {revealMap ?
              <div className='map'>
                <EventMap selectLocation={updateLocation} />
              </div>
            : ''}
          </div>
        )}   
				<div className='col'>
					<label className='form-label' htmlFor='imageFile'>
						Upload an event-related image
					</label>
					{image ? (
						<>
							<ImagePreview src={image} alt='' />
							<button type='button' onClick={resetImage}>
								Remove
							</button>
							<button
								type='button'
								className={imageSaved ? 'saved' : 'save'}
								onClick={handleImageUpload}
							>
								{imageSaved ? 'Saved!' : 'Save'}
							</button>
							{!imageSaved ? (
								<p>
									Click{' '}
									<span className='text-save'>save</span> to
									confirm upload of your image
								</p>
							) : (
								''
							)}
						</>
					) : (
						''
					)}
					<br />
					{!imageSaved && (
						<>
							<label
								className='custom-file-upload'
								htmlFor='imageFile'
							>
								Choose Image
							</label>
							<input
								type='file'
								className='form-control-file custom-file-upload'
								id='imageFile'
								name='imageFile'
								ref={ref}
								onChange={(event) => {
									setImage(event.target.files[0]);
								}}
							></input>
						</>
					)}
				</div>
			</div>
			<div className='form-group form-row'>
				<div className='col'>
					<label htmlFor='organizerFirstName'>
						Organizer's First Name
					</label>
					<div>
						<input
							type='text'
							className='form-control'
							id='firstName'
							minLength={1}
							maxLength={30}
							value={tempEventData.organizerFirstName}
							name='organizerFirstName'
							onChange={handleUpdate}
						></input>
					</div>
				</div>
				<div className='col'>
					<label htmlFor='organizerLastName'>
						Organizer's Last Name
					</label>
					<div>
						<input
							type='text'
							className='form-control'
							id='lastName'
							minLength={1}
							maxLength={30}
							value={tempEventData.organizerLastName}
							name='organizerLastName'
							onChange={handleUpdate}
						></input>
					</div>
				</div>
				<div className='col'>
					<label htmlFor='organizerPronouns'>
						Organizer's Pronouns, if known
					</label>
					<div>
						<input
							type='text'
							className='form-control'
							id='pronouns'
							minLength={1}
							maxLength={30}
							value={tempEventData.organizerPronouns}
							name='organizerPronouns'
							onChange={handleUpdate}
						></input>
					</div>
				</div>
				<div className='form-group form-row'>
					<div className='col'>
						<label htmlFor='organizerEmail'>
							Organizer's Email
						</label>
						<div>
							<input
								type='email'
								className='form-control'
								id='email'
								minLength={1}
								maxLength={60}
								value={tempEventData.organizerEmail}
								name='organizerEmail'
								onChange={handleUpdate}
							></input>
						</div>
					</div>
				</div>
			</div>
			<fieldset className='form-group form-row'>
				<legend className='col-form-label col-sm-2 float-sm-left pt-0'>
					Target Audience*
				</legend>
				<div className='col-sm-10'>
					<div className='form-check'>
						<input
							type='radio'
							className='form-check-input'
							name='targetAudience'
							id='audienceAllBlackAdies'
							value='All Black Adies'
							checked={
								tempEventData.targetAudience ===
								'All Black Adies'
							}
							onChange={handleUpdate}
						></input>
						<label
							className='form-check-label audience'
							htmlFor='audienceAllBlackAdies'
						>
							All Black Adies
						</label>
					</div>
					<div className='form-check'>
						<input
							type='radio'
							className='form-check-input'
							name='targetAudience'
							id='audienceBlackAdieAlum'
							value='Black Adie Alum'
							checked={
								tempEventData.targetAudience ===
								'Black Adie Alum'
							}
							onChange={handleUpdate}
						></input>
						<label
							className='form-check-label audience'
							htmlFor='audienceBlackAdieAlum'
						>
							Black Adie Alum
						</label>
					</div>
					<div className='form-check'>
						<input
							type='radio'
							className='form-check-input'
							name='targetAudience'
							id='audienceInternBlackAdies'
							value='Internship Black Adies'
							checked={
								tempEventData.targetAudience ===
								'Internship Black Adies'
							}
							onChange={handleUpdate}
						></input>
						<label
							className='form-check-label audience'
							htmlFor='audienceInternBlackAdies'
						>
							Internship Black Adies
						</label>
					</div>
					<div className='form-check'>
						<input
							type='radio'
							className='form-check-input'
							name='targetAudience'
							id='audienceClassBlackAdies'
							value='Classroom Black Adies'
							checked={
								tempEventData.targetAudience ===
								'Classroom Black Adies'
							}
							onChange={handleUpdate}
						></input>
						<label
							className='form-check-label audience'
							htmlFor='audienceClassBlackAdies'
						>
							Classroom Black Adies
						</label>
					</div>
					<div className='form-check'>
						<input
							type='radio'
							className='form-check-input'
							name='targetAudience'
							id='audienceAnyone'
							value='Not Black@Ada Specific'
							checked={
								tempEventData.targetAudience ===
								'Not Black@Ada Specific'
							}
							onChange={handleUpdate}
						></input>
						<label
							className='form-check-label audience'
							htmlFor='audienceAnyone'
						>
							Not Black@Ada Specific
						</label>
					</div>
				</div>
			</fieldset>
			<br />
			<p>Event added by: {createdByName}</p>
			<br />
			{creator && (
				<section className='button-grid'>
					<input
						type='submit'
						value='Update Event'
						className='update-btn'
						disabled={
							!tempEventData.title ||
							!tempEventData.description ||
							!tempEventData.dateTimeStart ||
							!tempEventData.dateTimeStop ||
							!tempEventData.timezone
						}
					></input>
					<button
						type='button'
						className='delete-btn'
						onClick={deleteEvent}
					>
						Cancel Event
					</button>
				</section>
			)}
		</form>
	);
};

export default UpdateEventForm;
