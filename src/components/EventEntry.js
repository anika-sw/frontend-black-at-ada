import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setItemInLocalStorage } from '../utils';
import moment from 'moment';
import PropTypes from 'prop-types';
import '../styles/EventEntry.css';

const kBaseUrl = process.env.REACT_APP_BE_URL;

const apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const EventEntry = (props) => {
	const userId = parseInt(localStorage.getItem('user'));

	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const [locale, setLocale] = useState('');

	const defaultImg =
		'https://storage.googleapis.com/img_store_black_at/Black%40Ada_logo.png';

	const dateTime = moment(props.event.dateTimeStart).format(
		'MMMM Do YYYY, h:mm a'
	);

	useEffect(() => {
		if (props.event.onlineInPerson === 'In-Person') {
			setLoading(true);
			axios
        .get(`${kBaseUrl}/events/${props.event.id}/latlng`)
				.then((response) => {
					const rd = response.data;
					return axios
            .get(`${apiUrl}${rd.coordinates}&key=${apiKey}`);
        })
				.then((response) => {
					const latLngData = response.data;
					const parsedLocale = latLngData.plus_code.compound_code
						.split(' ')
						.slice(1);
					const formattedLocale = parsedLocale.join(' ');
					setLocale(formattedLocale);
					setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        }
      );
    }
  }, [props.event.id, props.event.onlineInPerson]);

	const tempStoreEventId = (event) => {
		setItemInLocalStorage('event', props.event.id);
		navigate(`/events/${props.event.id}`);
	};

	const passEventId = (event) => {
		setItemInLocalStorage('event', props.event.id);
		navigate(`/events/${props.event.id}/edit-event`);
	};

	const deleteEvent = () => {
		axios
			.delete(`${kBaseUrl}/events/${props.event.id}`)
			.then((response) => {
				console.log(
					`Event: '${props.event.title}' successfully deleted`
				);
			})
			.catch((error) => {
				console.log(error);
			}
    );
	};

	if (loading) {
		return <div>Gathering events...</div>;
	};

	return (
		<div>
			<div className='event-card-container'>
				{!loading && (
					<div className='row event-card-row'>
						<div className='col event-card-col'>
							<div className='card h100 event-card'>
								<img
									src={props.event.imageUrl || defaultImg}
									className='event-card-img-top'
									alt='...'
								/>
								<div className='card-body'>
									<p className='event-card-title'>
										{props.event.title}
									</p>
									<p className='card-text'>{dateTime}</p>
									<p className='card-text'>
										Time Zone: {props.event.timezone}
									</p>
									<p className='event-card-locale'>
										{props.event.onlineInPerson === 'Online'
											? 'Virtual'
											: locale}
									</p>
									<p className='event-card-audience'>
										{props.event.targetAudience}
									</p>
									{props.event.createdById !== userId && (
										<button type='button' onClick={tempStoreEventId}>
											Details
										</button>
									)}
									{props.event.createdById === userId && (
										<>
											<p>
												Total RSVPs:{' '}{props.event.users.length}
											</p>
											<button type='button' onClick={passEventId}>
												Edit Event
											</button>
											<button type='button' onClick={deleteEvent}>
												Cancel Event
											</button>
										</>
									)}
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

EventEntry.propTypes = {
	event: PropTypes.shape({
		id: PropTypes.number,
		title: PropTypes.string,
		description: PropTypes.string,
		imageUrl: PropTypes.string,
		dateTimeStart: PropTypes.string,
		dateTimeStop: PropTypes.string,
		timezone: PropTypes.string,
		videoConfLink: PropTypes.string,
		meetingKey: PropTypes.string,
		onlineInPerson: PropTypes.string,
		isMapShowing: PropTypes.string,
		locationAddress: PropTypes.string,
		locationLat: PropTypes.string,
		locationLng: PropTypes.string,
		organizerFirstName: PropTypes.string,
		organizerLastName: PropTypes.string,
		organizerPronouns: PropTypes.string,
		organizerEmail: PropTypes.string,
		targetAudience: PropTypes.string,
		createdById: PropTypes.number,
		dateTimeCreated: PropTypes.string,
		users: PropTypes.array,
	}),
};

export default EventEntry;
