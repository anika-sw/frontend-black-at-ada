import React, { useState } from 'react';
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import PropTypes from 'prop-types';
import '../styles/EventMap.css';

const libraries = ['places'];

const EventMap = (props) => {
	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
		libraries,
	});

	const [map, setMap] = useState(null);
	const [eventAddress, setEventAddress] = useState('');
	const [mapCenter, setMapCenter] = useState({
		lat: 47.5998708145592,
		lng: -122.32792583067896,
	});
	const [markerPosition, setMarkerPosition] = useState(null);

	const handleChange = (eventAddress) => {
		setEventAddress(eventAddress);
	};

	const handleSelect = (eventAddress) => {
		geocodeByAddress(eventAddress)
			.then((results) => getLatLng(results[0]))
			.then((latLng) => {
				console.log('Success', latLng);
				setEventAddress(eventAddress);
				setMapCenter(latLng);
				setMarkerPosition(latLng);
				props.selectLocation(eventAddress);
			})
      .catch((error) => {
        console.log(error);
      }
    );
	};

	if (!isLoaded) {
		return <div>Map unable to load. Please try again later.</div>;
	};

	return (
		<>
			<div className='event-map'>
				<PlacesAutocomplete
					value={eventAddress}
					onChange={handleChange}
					onSelect={handleSelect}>
					{({
						getInputProps,
						suggestions,
						getSuggestionItemProps,
					}) => (
						<div>
							<input
								{...getInputProps({
									placeholder:
										'Enter address or location name',
									className: 'location-search-input',
								})}>
              </input>
							<div className='autocomplete-dropdown-container'>
								{suggestions.map((suggestion, index) => {
									const className = suggestion.active
										? 'suggestion-item--active'
										: 'suggestion-item';
									return (
										<div
											key={index} {
                        ...getSuggestionItemProps(
                          suggestion,
                          {
                            className,
                          }
                        )
                      }>
											<span>
												{suggestion.description}
											</span>
										</div>
									);
								})}
							</div>
						</div>
					)}
				</PlacesAutocomplete>
			</div>
			<div>
				<GoogleMap
					mapContainerStyle={{
						width: '354px',
						height: '354px',
						marginLeft: '-1.5px',
					}}
					center={mapCenter}
					zoom={12}
					options={{
						streetViewControl: false,
						mapTypeControl: false,
						// fullscreenControl: false, <-- leaving this in for future options
					}}
					onLoad={(map) => setMap(map)}>
					<div>
						<Marker
							className='marker'
							position={markerPosition}
							map={map}>
            </Marker>
					</div>
				</GoogleMap>
			</div>
		</>
	);
};

EventMap.propTypes = {
	selectLocation: PropTypes.func,
};

export default React.memo(EventMap);