import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { getItemFromLocalStorage, setItemInLocalStorage } from '../utils';
import { StaticGoogleMap, Marker } from 'react-static-google-map';
import PropTypes from 'prop-types';
import '../styles/EventDetails.css';

const kBaseUrl = process.env.REACT_APP_BE_URL;

const EventDetails = (props) => {
	const userId = parseInt(getItemFromLocalStorage('user'));
	const eventId = parseInt(getItemFromLocalStorage('event'));
	const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

	const navigate = useNavigate();

	const passEventId = (event) => {
		setItemInLocalStorage(eventId);
		navigate(`/events/${eventId}/edit-event`);
	};

	const [eventData, setEventData] = useState({});
	const [attending, setAttending] = useState(false);
	const [creator, setCreator] = useState(false);
	const [loading, setLoading] = useState(false);

	const convertFromApi = (apiEvent) => {
		const {
			image_url,
			date_time_start,
			date_time_stop,
			video_conf_link,
			meeting_key,
			online_in_person,
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
			onlineInPerson: online_in_person || '',
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
			users: users || [],
			...rest,
		};
		return jsEvent;
	};

	useEffect(() => {
    window.scrollTo(0, 0);
		if (convertFromApi.online_in_person === 'In-Person') {
			setLoading(true);
		}
		axios.get(`${kBaseUrl}/events/${eventId}`, {}).then((response) => {
			const convertedData = convertFromApi(response.data.event);
			setEventData(convertedData);
			const creatorBool = userId === convertedData.createdById;
			setCreator(creatorBool);
			const attendingBool =
				convertedData.users.includes(userId) || creatorBool;
			setAttending(attendingBool);
			setLoading(false);
		});
	}, [eventId, userId]);

	const deleteEvent = () => {
		axios
			.delete(`${kBaseUrl}/events/${eventId}`)
			.then((response) => {
				console.log(`Event: '${eventId.title}' successfully deleted`);
				props.onEventDeletion = true;
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const eventLocation = `${eventData.locationLat} ${eventData.locationLng}`;

	const dateTimeStart = moment(eventData.dateTimeStart).format(
		'MMMM Do YYYY, h:mm a'
	);
	const dateTimeStop = moment(eventData.dateTimeStop).format(
		'MMMM Do YYYY, h:mm a'
	);

	const getDirections = `https://www.google.com/maps?daddr=${eventData.locationAddress}`;

	const contactName = `${eventData.organizerFirstName} ${eventData.organizerLastName} ${eventData.organizerPronouns}`;

	const rsvpYes = (event) => {
		const requestBody = { user_id: userId };
		axios
			.post(`${kBaseUrl}/events/${eventId}/users`, requestBody)
			.then((response) => {
				console.log('RSVP yes: success');
				setAttending(response.data.attending);
			});
	};

	const rsvpNo = (event) => {
		const requestBody = { user_id: userId };
		axios
			.patch(`${kBaseUrl}/events/${eventId}/users`, requestBody)
			.then((response) => {
				console.log('RSVP no: success');
				setAttending(response.data.attending);
			});
	};

	if (loading) {
		return <div>Gathering event details...</div>;
	}

	return (
		<>
			{!loading && (
				<>
					<div className='event-color-bar'>
						<h1>{eventData.title}</h1>
					</div>
					<div className='event-details-flex'>
						<div className='event-details-container'>
							<div className='details-grid1'>
								<div>
									<h2>Date & Time</h2>
									<p>{dateTimeStart}</p>
									{dateTimeStop !== dateTimeStart && (
										<p>{dateTimeStop}</p>
									)}
								</div>
								<div>
									<h2>Time Zone</h2>
									<p>{eventData.timezone}</p>
								</div>
								<div>
									<h2>Target Audience</h2>
									<p>{eventData.targetAudience}</p>
								</div>
							</div>
							<div className='details-description'>
								<h2>About This Event</h2>
								<div>
									<p>{eventData.description}</p>
								</div>
							</div>
							<div className='details-grid2'>
								<div>
									<h2>Location</h2>
									{eventData.onlineInPerson === 'Online' && (
										<>
											<h3>Online</h3>
											<a href={eventData.videoConfLink}>
												{eventData.videoConfLink}
											</a>
											<br />
											<br />
											<p>
												Meeting Key, if any:{' '}
												{eventData.meetingKey}
											</p>
										</>
									)}
									{eventData.onlineInPerson ===
										'In-Person' && (
										<>
											<h3>Address</h3>
											<div>
												<p>
													{eventData.locationAddress}
												</p>
											</div>
											<a href={getDirections}>
												Get Directions{' '}
												<img
													className='new-tab'
													src='/images/new-tab.png'
													alt='new tab'
												/>
											</a>
											<br />
											<br />
											<StaticGoogleMap
												size='350x350'
												className='img-fluid'
                        zoom='12'
												apiKey={apiKey}
											>
												<Marker
													location={eventLocation}
													color='red'
												/>
											</StaticGoogleMap>
										</>
									)}
								</div>
								<div>
									<h2>Contact Name</h2>
									<p>{contactName}</p>
								</div>
								<div>
									<h2>Contact Email</h2>
									<p>{eventData.organizerEmail}</p>
								</div>
							</div>
							<br />
							<br />
							<div className='button-flex'>
								<div>
									{creator && (
										<>
											<div>
												<button
													type='button'
													onClick={passEventId}
												>
													Edit Event
												</button>
											</div>
											<div>
												<button
													type='button'
													onClick={deleteEvent}
												>
													Cancel Event
												</button>
											</div>
										</>
									)}
								</div>
								{!attending && (
									<button type='button' onClick={rsvpYes}>
										I'm Going!
									</button>
								)}
								<div>
									{attending && !creator && (
										<button type='button' onClick={rsvpNo}>
											No Longer Attending
										</button>
									)}
								</div>
								<div>
									{/* {!creator &&
                    <button type='button'>Flag Event</button>} */}
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
};

EventDetails.propTypes = {
	onEventDeletion: PropTypes.func,
};

export default EventDetails;
