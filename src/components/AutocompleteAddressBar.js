import React, { useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import PlacesAutocomplete from 'react-places-autocomplete';
import PropTypes from 'prop-types';
import '../styles/AutocompleteAddressBar.css';

const libraries = ['places'];

// const loadGoogleMapsApi = async () => {
//   return new Promise((resolve, reject) => {
//     const { isLoaded, loadError } = useJsApiLoader({
//       googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
//       libraries,
//       onLoad: () => resolve(true),
//       onError: () => reject(false),
//     });

//     if (isLoaded) {
//       resolve(true);
//     }

//     if (loadError) {
//       reject(false);
//     }
//   });
// };

const AutocompleteAddressBar = (props) => {

  const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
		libraries,
	});

	const [location, setLocation] = useState('');

	const handleChange = (location) => {
		setLocation(location);
		props.selectLocation(location);
	};

	const options = {
		types: ['(regions)'],
	};

	if (!isLoaded) {
		return <div>Map unable to load. Please try again later.</div>;
	}

	return (
		<>
			<PlacesAutocomplete
				value={location}
				onChange={handleChange}
				searchOptions={options}
			>
				{({ getInputProps, suggestions, getSuggestionItemProps }) => (
					<div>
						<input
							{...getInputProps({
								placeholder: 'Start typing...',
								className: 'location-search-input',
							})}
						/>
						<div className='autocomplete-dropdown-container'>
							{suggestions.map((suggestion, index) => {
								const className = suggestion.active
									? 'suggestion-item--active'
									: 'suggestion-item';
								return (
									<div
										key={index}
										{...getSuggestionItemProps(suggestion, {
											className,
										})}
									>
										<span>{suggestion.description}</span>
									</div>
								);
							})}
						</div>
					</div>
				)}
			</PlacesAutocomplete>
		</>
	);
};

AutocompleteAddressBar.propTypes = {
	selectLocation: PropTypes.func,
};

export default AutocompleteAddressBar;
