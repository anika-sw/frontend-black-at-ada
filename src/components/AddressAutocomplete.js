// import React, { useEffect, useState } from 'react'
// import { GoogleMap, LoadScript} from '@react-google-maps/api';
// import Marker from 'google-maps-react';
// import PlacesAutocomplete, {
//   geocodeByAddress,
//   getLatLng,
// } from 'react-places-autocomplete';


// function AddressAutocomplete() {

//   const [gmapsLoaded, setGmapsLoaded] = useState(false)

//   // This is how you do componentDidMount() with React hooks
//   useEffect(() => {
//     console.log("in the useEffect")
//     window.initMap = () => setGmapsLoaded(true);
//     const gmapScriptEl = document.createElement("script")
//     gmapScriptEl.async = true;
//     gmapScriptEl.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`
//     document.querySelector("body").insertAdjacentElement("beforeend", gmapScriptEl)
//   }, []);

//   const [eventAddress, setEventAddress] = useState('')
//   const [mapCenter, setMapCenter] = useState({
//       lat: 47.608013,
//       lng: -122.335167
//     });
//   const [markerPosition, setMarkerPosition] = useState({
//     lat: 47.608013,
//     lng: -122.335167
//   });

//   const handleChange = (eventAddress) => {
//     setEventAddress(eventAddress);
//   };

//   const handleSelect = (eventAddress) => {
//     geocodeByAddress(eventAddress)
//     .then(results => getLatLng(results[0]))
//     .then(latLng => {
//       console.log('Success', latLng);
//       setEventAddress(eventAddress);
//       setMapCenter(latLng);
//     })
//     .catch(error => console.error('Error', error));
//   };

//   const onMarkerClick = (event) =>{
//     setMarkerPosition(mapCenter)
//   };

//   const containerStyle = {
//     width: "300px",
//     height: "300px",
// }

// const center = {
//     lat: 28.626137,
//     lng: 79.821603,
// }

// const latLng = {
//   lat: 45.5152,
//   lng: 122.6784,
// }


//   return (
//     <div>
//       <div>
//         {gmapsLoaded && (
//           <PlacesAutocomplete
//             value={eventAddress}
//             onChange={handleChange}
//             onSelect={handleSelect}>
//             {({ getInputProps, suggestions, getSuggestionItemProps }) => (
//               <div>
//                 <input
//                   {...getInputProps({
//                     placeholder: 'Enter address or location name ...',
//                     className: 'location-search-input',
//                 })}/>
//                 <div className="autocomplete-dropdown-container">
//                   {suggestions.map(suggestion => {
//                     const className = suggestion.active
//                       ? 'suggestion-item--active'
//                       : 'suggestion-item';
//                     // inline style for demonstration purpose
//                     const style = suggestion.active
//                       ? { backgroundColor: '#fafafa', cursor: 'pointer' }
//                       : { backgroundColor: '#ffffff', cursor: 'pointer' };
//                     return (
//                       <div
//                         {...getSuggestionItemProps(suggestion, {
//                           className,
//                           style,
//                         })}>
//                         <span>{suggestion.description}</span>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
//           </PlacesAutocomplete>
//         )}
//       </div>
//       {/* <div>
//         <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
//           <GoogleMap 
//             mapContainerStyle={containerStyle} 
//             center={center} 
//             zoom={15}
//             // onClick={mapClicked}
//             >
//             <div>
//               <Marker 
//                   position={latLng}
//                   // onDragEnd={event => markerDragEnd(event, index)}
//                   // onClick={event => markerClicked(marker, index)} 
//               > 
//               </Marker>
//             </div>
//           </GoogleMap>
//         </LoadScript>
//       </div> */}
//     </div>
//   )
// };

// export default React.memo(AddressAutocomplete)