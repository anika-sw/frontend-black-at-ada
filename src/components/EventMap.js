import React, { useState } from 'react'
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';


const EventMap = () => {

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
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

  const handleSelect = (eventAddress) => {
    geocodeByAddress(eventAddress)
    .then(results => getLatLng(results[0]))
    .then(latLng => {
      console.log('Success', latLng);
      setEventAddress(eventAddress);
      setMapCenter(latLng);
      setMarkerPosition(latLng);
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
                {suggestions.map(suggestion => {
                  const className = suggestion.active
                    ? 'suggestion-item--active'
                    : 'suggestion-item';
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                  return (
                    <div
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
            zoom={13}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              // fullscreenControl: false,
            }}
            >
            <div>
              <Marker 
                  position={markerPosition}
              > 
              </Marker>
            </div>
          </GoogleMap>
      </div>
    </div>
  )
};

export default React.memo(EventMap);