// import React, { useState } from "react";
// import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

import React from 'react'
import { GoogleMap, LoadScript, Autocomplete  } from '@react-google-maps/api';

const libraries = ["places"];

const Map = () => {

  const api = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const containerStyle = {
      width: '300px',
      height: '300px'
  };

  const center = {
      lat: 45.5152,
      lng: -122.335167
  };


  // const Gmap = () => {

      return (
          <LoadScript
              googleMapsApiKey ={api}
              libraries={libraries}
          >
              <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={center}
                  zoom={10}
              >
                  { /* Child components, such as markers, info windows, etc. */ }
                  <Autocomplete>
                      <input
                          type="text"
                          placeholder="Input"
                          style={{
                              boxSizing: `border-box`,
                              border: `1px solid transparent`,
                              width: `240px`,
                              height: `32px`,
                              padding: `0 12px`,
                              borderRadius: `3px`,
                              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                              fontSize: `14px`,
                              outline: `none`,
                              textOverflow: `ellipses`,
                              position: "absolute",
                              left: "50%",
                              marginLeft: "-120px",
                              top: "2%"
                          }}
                      />
                  </Autocomplete>
                  <></>
              </GoogleMap>
          </LoadScript>
      )
};

export default React.memo(Map)

  // // const { isLoaded } = LoadScript({ googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY });
  // // if (!isLoaded) {
  // //   return <div>Loading...</div>
  // // } else {
  // //   return <Map />
  // // }


    
  //   // const [activeInfoWindow, setActiveInfoWindow] = useState("");
  //   // const [markers, setMarkers] = useState("");

  //   const containerStyle = {
  //       width: "300px",
  //       height: "300px",
  //   }

  //   const center = {
  //       lat: 47.6062,
  //       lng: 122.3321,
  //   }

  //   const latLng = {
  //     lat: 45.5152,
  //     lng: 122.6784,
  // }

  // const [eventAddress, setEventAddress] = useState('')
  // const [mapCenter, setMapCenter] = useState({
  //     lat: 47.608013,
  //     lng: -122.335167
  //   });
  // const [markerPosition, setMarkerPosition] = useState({
  //   lat: 47.608013,
  //   lng: -122.335167
  // });


  // const handleChange = (eventAddress) => {
  //   setEventAddress(eventAddress);
  // };

  // const handleSelect = (eventAddress) => {
  //   geocodeByAddress(eventAddress)
  //   .then(results => getLatLng(results[0]))
  //   .then(latLng => {
  //     console.log('Success', latLng);
  //     setEventAddress(eventAddress);
  //     setMapCenter(latLng);
  //   })
  //   .catch(error => console.error('Error', error));
  // };

  // const onMarkerClick = (event) =>{
  //   setMarkerPosition(mapCenter)
  // };

  // const GoogleMapExample = withGoogleMap(props => (
  //   <GoogleMap 
  //     mapContainerStyle={containerStyle} 
  //     center={center} 
  //     zoom={15}>
  //       <Marker 
  //           position={latLng}> 
  //       </Marker>
  //   </GoogleMap>
  // ));

  //   // const mapClicked = (event) => { 
  //   //     console.log(event.latLng.lat(), event.latLng.lng()) 
  //   // }

  //   // const markerClicked = (marker, index) => {  
  //   //     setActiveInfoWindow(index)
  //   //     console.log(marker, index) 
  //   // }

  //   // const markerDragEnd = (event, index) => { 
  //   //     console.log(event.latLng.lat())
  //   //     console.log(event.latLng.lng())
  //   // }

  //   return (
  //     <div>
  //       <PlacesAutocomplete
  //         value={eventAddress}
  //         onChange={handleChange}
  //         onSelect={handleSelect}>
  //         {({ getInputProps, suggestions, getSuggestionItemProps }) => (
  //           <div>
  //             <input
  //               {...getInputProps({
  //                 placeholder: 'Enter address or location name ...',
  //                 className: 'location-search-input',
  //             })}/>
  //             <div className="autocomplete-dropdown-container">
  //               {suggestions.map(suggestion => {
  //                 const className = suggestion.active
  //                   ? 'suggestion-item--active'
  //                   : 'suggestion-item';
  //                 // inline style for demonstration purpose
  //                 const style = suggestion.active
  //                   ? { backgroundColor: '#fafafa', cursor: 'pointer' }
  //                   : { backgroundColor: '#ffffff', cursor: 'pointer' };
  //                 return (
  //                   <div
  //                     {...getSuggestionItemProps(suggestion, {
  //                       className,
  //                       style,
  //                     })}
  //                     key={suggestion.placeId}>
  //                     <span>{suggestion.description}</span>
  //                   </div>
  //                 );
  //               })}
  //             </div>
  //           </div>
  //         )}
  //     </PlacesAutocomplete>
  //     <GoogleMapExample 
  //       containerElement={<div style={{ height: `500px`, width: '500px' }} />}
  //       mapElement={<div style={{ height: `100%` }} />}
  //     /> 
  //   </div>
  
  //       // <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
  //       //     <GoogleMap 
  //       //         mapContainerStyle={containerStyle} 
  //       //         center={center} 
  //       //         zoom={15}
  //       //         // onClick={mapClicked}
  //       //         >
  //       //         <div>
  //       //           <Marker 
  //       //               position={latLng}
  //       //               // onDragEnd={event => markerDragEnd(event, index)}
  //       //               // onClick={event => markerClicked(marker, index)} 
  //       //           > 
  //       //           </Marker>
  //       //         </div>
  //       //     </GoogleMap>
  //       // </LoadScript>
  //   );
// };

// export default Map;
