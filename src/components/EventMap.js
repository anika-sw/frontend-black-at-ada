import React, { useState } from 'react';
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';
import PlacesAutocomplete from 'react-places-autocomplete';
import  { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import '../styles/EventMap.css'
import PropTypes from 'prop-types';


const libraries = ['places']

const EventMap = (props) => {

  const [map, setMap] = useState(/** @type google.maps.Map */ (null))

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  })
  const [eventAddress, setEventAddress] = useState('')

  const [mapCenter, setMapCenter] = useState({
      lat: 47.5998708145592,
      lng: -122.32792583067896
    });

  const [markerPosition, setMarkerPosition] = useState(null);

  const handleChange = (eventAddress) => {
    setEventAddress(eventAddress);
  };

  // const handleSelect = (eventAddress) => {
  //   geocodeByAddress(eventAddress)
  //   .then(results => getLatLng(results[0]))
  //   .then(latLng => {
  //     console.log('Success', latLng);
  //     setMarkerPosition(latLng);
  //     setMapCenter(latLng);
  //   })
  //   .catch(error => console.error('Error', error));
  // };


  const handleSelect = (eventAddress) => {
    geocodeByAddress(eventAddress)
    .then(results => getLatLng(results[0]))
    .then(latLng => {
      console.log('Success', latLng);
      setEventAddress(eventAddress);
      setMapCenter(latLng);
      setMarkerPosition(latLng);
      props.selectLocation(eventAddress);
    })
    .catch(error => console.error('Error', error));
  };

  if (!isLoaded) {
    return (
      <div>
        Map unable to load. Please try again later.
      </div>
    )
  }

  // {() => props.selectLocation(eventAddress)}
  return (
    <div>
      <div>
        <PlacesAutocomplete
          value={eventAddress}
          onChange={handleChange}
          onSelect={handleSelect}>
          {({ getInputProps, suggestions, getSuggestionItemProps }) => (
            <div>
              <input
                {...getInputProps({
                  placeholder: 'Enter address or location name',
                  className: 'location-search-input',
              })}/>
              <div className="autocomplete-dropdown-container">
                {suggestions.map((suggestion, index) => {
                  const className = suggestion.active
                    ? 'suggestion-item--active'
                    : 'suggestion-item';
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: '#fafafa', cursor: 'pointer', color: '#000000' }
                    : { backgroundColor: '#ffffff', cursor: 'pointer', color: '#000000' };
                  return (
                    <div key={index}
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style,
                      })}>
                      <span>{suggestion.description}</span>
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
            mapContainerStyle={{ width: '300px', height: '300px' }}
            center={mapCenter} 
            zoom={12}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              // fullscreenControl: false,
            }}
            onLoad={map => setMap(map)}
            >
            <div>
              <Marker className='marker'
                position={markerPosition}
                map={map}
              > 
              </Marker>
            </div>
          </GoogleMap>
      </div>
    </div>
  )
};


EventMap.propTypes = {
  selectLocation: PropTypes.func
};

export default React.memo(EventMap);