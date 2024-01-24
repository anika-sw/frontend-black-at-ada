import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AutocompleteAddressBar from  '../components/AutocompleteAddressBar';
import  { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { setItemInLocalStorage, convertToApi } from '../utils';
import ImagePreview from '../components/ImagePreview';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import '../styles/NewForms.css';

const kBaseUrl = 'http://localhost:5000';

const kDefaultFormState = {
  firstName: '',
  lastName: '',
  pronouns: '',
  cohort: '',
  locationName: '',
  locationLat: '',
  locationLng: '',
  email: '',
  password: '',
  profilePicFile: '',
  company: '',
  linkedin: '',
  jobTitle:'',
  salary: null,
  yearsExperience: 'N/A',
  includeNameSalary: 'No'
}


const NewUserForm = () => {

  const navigate = useNavigate();
  const routeChange = () => {
    navigate('/home')
  };
  
  const [newUserData, setNewUserData] = useState(kDefaultFormState);
  
  const [adaStudentAlum, setAdaStudentAlum] = useState(false);
  const [blackIdentity, setBlackIdentity] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [image, setImage] = useState('');
  const [imageSaved, setImageSaved] = useState(false);

  const checkHandler = (event) => {
    if (event.target.id === 'adaStudentAlum') {
      setAdaStudentAlum((ada) => !ada);
    } else if (event.target.id === 'blackIdentity') {
      setBlackIdentity((blackIdentity) => !blackIdentity);
    }
  };
  
    const handleConfirm = (event) => {
      setConfirm(true);
    };

  // address autocomplete logic; passed as props to autocomplete component
  const getLocation = (location) => {
    return geocodeByAddress(location)
    .then(results => getLatLng(results[0]))
    .then(latLng => {
      const latStr = latLng['lat'].toString();
      const lngStr = latLng['lng'].toString();
      setNewUserData({
        ...newUserData,
        locationName: location,
        locationLat: latStr, 
        locationLng: lngStr})
      console.log('Set location: success');
      })
    .catch(error => console.error('Error', error));
  };
  
    const showHidePassword = (event) => {
      setPasswordShown(!passwordShown);
    };

  // send profile pic to cloud storage
  const handleImageUpload = () => {
    const imageCloudData = new FormData();
    imageCloudData.append('image', image);
    axios.post(`${kBaseUrl}/images/upload`, imageCloudData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    .then(response => {
      console.log('Image URL: success');
      setNewUserData({...newUserData, profilePicFile: response.data.url});
      setImageSaved(true);
    })
    .catch(error => {
      console.log(error);
    })
  };

  const ref = useRef();

  const resetImage = (event) => {
    setImage('');
    setImageSaved(false)
    ref.current.value = '';
  };

  // generic change event handler
  const handleChange = (event) => {
    const fieldName = event.target.name;
    let fieldValue = event.target.value;
    if (fieldName === 'cohort') {
      fieldValue = parseInt(fieldValue);
    } else if (fieldName === 'profilePicFile') {
      setImage(event.target.files[0]);
      return;
    }
    setNewUserData({...newUserData, [fieldName]: fieldValue});
  };

  const addNewUserToApi = (data) => {
    const requestBody = convertToApi(data);

    axios.post(`${kBaseUrl}/signup`, requestBody)
    .then(response => {
      console.log('New user sign up: success');
      setItemInLocalStorage('user', response.data.user.id);
      routeChange();
    })
    .catch(error => {
      console.log(error);
    });
  };

  const onFormSubmit = (event) => {
    event.preventDefault();
    addNewUserToApi(newUserData);
  };


  return (
		<form onSubmit={onFormSubmit} className='newUserForm'>
			<section className='attestation'>
				<h1>Attestation</h1>
        <div className='attestation-flex'>
          <div className='form-check'>          
            <input
            type='checkbox'
            className='form-check-input'
            id='adaStudentAlum'
            value={adaStudentAlum}
            name='adaStudentAlum'
            onChange={checkHandler}
            ></input>
            <label className='form-check-label' htmlFor='adaStudentAlum'>
              I am an Ada Developers Academy student (classroom or
              internship) or alum.
            </label>
          </div>
          <div className='form-check'>          
            <input
              type='checkbox'
              className='form-check-input'
              id='blackIdentity'
              value={blackIdentity}
              name='blackIdentity'
              onChange={checkHandler}
            />
            <label className='form-check-label' htmlFor='blackIdentity'>
              I identify as Black, African, African-American, Afro-Carribean, 
              and/or as a part of the African diaspora.
            </label>
          </div>
          <input
            type='button'
            className='btn'
            value='Confirm'
            disabled={!adaStudentAlum || !blackIdentity}
            onClick={handleConfirm}
          ></input>
          {adaStudentAlum && blackIdentity && confirm && <span>Continue by filling out the form below</span>}
        </div>
			</section>
			<section>
				{adaStudentAlum && blackIdentity && confirm && (
					<>
            <Box
              component="form"
              sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
                
              }}
              noValidate
              autoComplete="off">              
              <h1>Your Information</h1>
              <p>
                All fields marked with an * are required. Your name,
                pronouns (if provided), cohort, LinkedIn link (if
                provided), company (if provided), email, and picture
                will be posted in the Black Adie Directory.
              </p>
              <TextField
                required
                id="filled-multiline-flexible"
                label="First Name"
                multiline
                maxRows={4}
                variant="filled"
                sx={{
                  color: "!important #f7b402"
                }}
              />
              <TextField
                id="filled-multiline-flexible"
                label="Multiline"
                multiline
                maxRows={4}
                variant="filled"
              />
              <TextField
                id="filled-multiline-flexible"
                label="Multiline"
                multiline
                maxRows={4}
                variant="filled"
              />
              <div className='form-row'>
                <div className='col'>            
                  <label htmlFor='firstName'>*First Name</label>
                  <input
                    type='text'
                    className='form-control'
                    id='firstName'
                    minLength={1}
                    maxLength={30}
                    value={newUserData.firstName}
                    name='firstName'
                    onChange={handleChange}
                  ></input>
                </div>
                <div className='col'> 
                  <label htmlFor='lastName'>*Last Name</label>
                  <input
                    type='text'
                    className='form-control'
                    id='lasttName'
                    minLength={1}
                    maxLength={30}
                    value={newUserData.lastName}
                    name='lastName'
                    onChange={handleChange}
                  ></input>
                </div>
                <div className='col'> 
                  <label htmlFor='pronouns'>Pronouns</label>
                  <input
                    type='text'
                    className='form-control'
                    id='pronouns'
                    minLength={1}
                    maxLength={30}
                    value={newUserData.pronouns}
                    name='pronouns'
                    onChange={handleChange}
                  ></input>
                </div>
              </div>
              <div className='form-row'>
                <div className='col'>             
                  <label htmlFor='cohort'>*Cohort</label>
                  <input
                    type='text'
                    className='form-control'
                    id='cohort'
                    minLength={1}
                    maxLength={3}
                    value={newUserData.cohort}
                    name='cohort'
                    onChange={handleChange}
                  ></input>
                </div>
                <div className='col'>  
                  <label htmlFor='location'>
                    *Location (Enter city, country, zip code, or post code)
                  </label>
                  <AutocompleteAddressBar selectLocation={getLocation} />
                </div>
                <div className='col'>  
                  <label htmlFor='linkedin'>LinkedIn Profile URL</label>
                  <input
                    type='text'
                    className='form-control'
                    id='linkedin'
                    minLength={1}
                    maxLength={60}
                    value={newUserData.linkedin}
                    name='linkedin'
                    onChange={handleChange}
                  ></input>
                </div>
              </div>
              <div className='form-row'>
                <div className='col'>                
                  <label htmlFor='email'>
                    *Email (for your Black@Ada login)
                  </label>
                  <input
                    type='email'
                    className='form-control'
                    id='email'
                    minLength={1}
                    maxLength={30}
                    value={newUserData.email}
                    name='email'
                    onChange={handleChange}
                  ></input>
                </div>
                <div className='col'>                
                  <label htmlFor='password'>*Password</label>
                  <input
                    type={passwordShown ? 'text' : 'password'}
                    className='form-control'
                    id='password' 
                    minLength={8}
                    maxLength={15}
                    value={newUserData.password}
                    name='password'
                    onChange={handleChange}
                  ></input>
                  <button type='button' className='btn btn-sm btn-secondary' onClick={showHidePassword}>
                    Show/Hide Password
                  </button>
                </div>
                <div className='col'>                
                  <label htmlFor='profilePicFile'>*Profile Pic</label>
                  {image ?
                    <>
                      <ImagePreview src={image} alt='' />
                      <button type='button' onClick={resetImage}>Remove</button>
                      <button type='button' 
                      className={imageSaved ? 'saved' : 'save'} 
                      onClick={handleImageUpload}
                      >
                        {imageSaved ? 'Saved!' : 'Save'}
                      </button>
                      {!imageSaved ?
                        <p>Click <span className='text-save'>save</span> to confirm upload of your image</p>
                      : ''}
                    </>
                  : ''}
                  <br />
                  {!imageSaved &&
                  <>
                    <label className='custom-file-upload' htmlFor='profilePicFile'>Choose Image</label>
                    <input
                      type='file'
                      className='form-control-file custom-file-upload'
                      id='profilePicFile'
                      name='profilePicFile'
                      ref={ref}
                      onChange={(event) => {setImage(event.target.files[0])}}
                    ></input>
                  </>
                  } 
                </div>
              </div>
            </Box>
            <section>
              <h2>Company & Salary Information</h2>
              <p>
                Providing information about your current company and 
                salary can be very helpful for our community. By
                default, company and salary information will be
                posted anonmously on the Salaries page unless otherwise indicated.
              </p>
              <div className='form-row'>
                <div className='col'>                
                  <label htmlFor='company'>Company</label>
                  <input
                    type='text'
                    className='form-control'
                    id='company' 
                    minLength={1}
                    maxLength={30}
                    value={newUserData.company}
                    name='company'
                    onChange={handleChange}
                  ></input>
                </div>
                <div className='col'>                
                  <label htmlFor='jobTitle'>Job Title</label>
                  <input
                    type='text'
                    className='form-control'
                    id='jobTitle' 
                    minLength={1}
                    maxLength={30}
                    value={newUserData.jobTitle}
                    name='jobTitle'
                    onChange={handleChange}
                  ></input>
                </div>
                <div className='col'>                
                  <label htmlFor='salary'>Annual Salary</label>
                  <input
                    type='text'
                    className='form-control'
                    id='salary' 
                    minLength={1}
                    maxLength={20}
                    value={newUserData.salary || ''}
                    name='salary'
                    onChange={handleChange}
                  ></input>
                </div>
              </div>
              <div className='form-row'>
                <div className='col'>                
                  <label htmlFor='yearsExperience'>Years of Experience:
                    <select 
                      id='yearsExperience' 
                      name='yearsExperience' 
                      className='experience' 
                      onChange={handleChange}
                      >
                      <option className='experience' value='N/A'>N/A</option>
                      <option className='experience' value='< 1'>&lt; 1</option>
                      <option className='experience' value='1 - 3'>1 - 3</option>
                      <option className='experience' value='3 - 5'>3 - 5</option>
                      <option className='experience' value='5 - 10'>5 - 10</option>
                      <option className='experience' value='10+'>10+</option>
                    </select>
                  </label>
                </div>
                <div className='col'>
                  <div className='form-check'>               
                    <input
                      type='radio'
                      className='form-check-input'
                      name='includeNameSalary'
                      id='noNameWithSalary'
                      value='No'
                      checked={newUserData.includeNameSalary === 'No'}
                      onChange={handleChange}
                    ></input>
                    <label className='form-check-label' htmlFor='noNameWithSalary'>
                      No, do not include my name with my salary post.
                    </label>
                  </div>
                  <div className='form-check'>               
                    <input
                      type='radio'
                      className='form-check-input'
                      name='includeNameSalary'
                      id='yesNameWithSalary'
                      value='Yes'
                      checked={newUserData.includeNameSalary === 'Yes'}
                      onChange={handleChange}
                    ></input>
                    <label className='form-check-label' htmlFor='yesNameWithSalary'>
                      Yes, include my name with my salary post.
                    </label>
                  </div> 
                </div>
                <input
                  type='submit'
                  value='Sign Up'
                  className='btn btn-lg btn-secondary signup-btn'
                  disabled={
                    !newUserData.firstName ||
                    !newUserData.lastName ||
                    !newUserData.cohort ||
                    !newUserData.locationName ||
                    !newUserData.email ||
                    !newUserData.password ||
                    !imageSaved
                  }
                ></input>
              </div> 
            </section>
					</>
				)}
			</section>
		</form>
  );
};

export default NewUserForm;