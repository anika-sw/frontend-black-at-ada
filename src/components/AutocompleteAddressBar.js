import React, { useState } from "react";
import { useJsApiLoader } from '@react-google-maps/api';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';


const libraries = ["places"]

const AutocompleteAddressBar = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  })
  const [location, setLocation] = useState('')

  const handleChange = (location) => {
    setLocation(location);
  };

  const handleSelect = (location) => {
    geocodeByAddress(location)
    .then(results => getLatLng(results[0]))
    .then(latLng => {
      console.log('Success', latLng);
      setLocation(location);
    })
    .catch(error => console.error('Error', error));
  };

  const options = {
    types: ['(regions)'],
  };

  if (!isLoaded) {
    return (
      <div>
        Map unable to load. Please try again later.
      </div>
    )
  };

  return (
    <div>
      <PlacesAutocomplete
        value={location}
        onChange={handleChange}
        onSelect={handleSelect}
        searchOptions={options}>
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
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
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
  );
};

export default AutocompleteAddressBar;