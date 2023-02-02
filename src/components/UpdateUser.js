import React, { useState } from "react";
import AutocompleteAddressBar from "./AutocompleteAddressBar";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import "../styles/NewForms.css";


const UpdateUser = (props) => {

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [cohort, setCohort] = useState("");
	const [locationName, setLocationName] = useState("");
	const [locationLat, setLocationLat] = useState("");
	const [locationLng, setLocationLng] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [company, setCompany] = useState("");
	const [linkedin, setlinkedin] = useState("");
	const [jobTitle, setJobTitle] = useState("");
	const [salary, setSalary] = useState(null);
	const [yearsExperience, setYearsExperience] = useState("N/A");


	const addFirstName = (event) => {
		setFirstName(event.target.value);
	};

	const addLastName = (event) => {
		setLastName(event.target.value);
	};

	const addCohort = (event) => {
		const cohortInt = parseInt(event.target.value);
		setCohort(cohortInt);
	};

	const addEmail = (event) => {
		setEmail(event.target.value);
	};

	const addPassword = (event) => {
		setPassword(event.target.value);
	};

	const addCompany = (event) => {
		setCompany(event.target.value);
	};
	const addLinkedin = (event) => {
		setlinkedin(event.target.value);
	};
	const addJobTitle = (event) => {
		setJobTitle(event.target.value);
	};
	const addSalary = (event) => {
		setSalary(event.target.value);
	};
	const addYearsExperience = (event) => {
		if (yearsExperience !== event.target.value) {
			setYearsExperience((yearsExperience) => event.target.value);
		}
	};

  const handleSelect = (location) => {
    geocodeByAddress(location)
    .then(results => getLatLng(results[0]))
    .then(latLng => {
      console.log('Success', latLng);
      setLocationName(location);
      const latStr = latLng['lat'].toString();
      const lngStr = latLng['lng'].toString();
      setLocationLat(latStr);
      setLocationLng(lngStr);
    })
    .catch(error => console.error('Error', error));
  };

	const onFormSubmit = (event) => {
		event.preventDefault();
		props.updateUserInfo({
			firstName,
			lastName,
			cohort,
			locationName,
			locationLat,
			locationLng,
			email,
			password,
			company,
			linkedin,
			jobTitle,
			salary,
			yearsExperience,
		});
	};

	return (
		<form onSubmit={onFormSubmit} className="newUserForm">
			<label htmlFor="firstName">First Name</label>
			<input
				type="text"
				minLength={1}
				maxLength={30}
				value={firstName}
				className={!firstName ? "error" : ""}
				onChange={addFirstName}
			>{props.user.firstName}</input>
			<br />
			<br />
			<label htmlFor="lastName">Last Name</label>
			<input
				type="text"
				minLength={1}
				maxLength={30}
				value={lastName}
				className={!lastName ? "error" : ""}
				onChange={addLastName}
			>{props.user.lastName}</input>
			<br />
			<br />
			<label htmlFor="cohort">Cohort</label>
			<input
				type="text"
				minLength={1}
				maxLength={3}
				value={cohort}
				className={!cohort ? "error" : ""}
				onChange={addCohort}
			>{props.user.cohort}</input>
			<br />
			<br />
      <label htmlFor="location">
				Saved Location 
			</label>
      <p>{props.user.locationName}</p>
			<label htmlFor="location">
				New Location (Enter your current city and state/country, zip code,
				or post code)
			</label>
			<AutocompleteAddressBar selectLocation={handleSelect} />
			<br />
			<br />
			<label htmlFor="email">Email</label>
			<input
				type="text"
				minLength={1}
				maxLength={30}
				value={email}
				className={!email ? "error" : ""}
				onChange={addEmail}
			>{props.user.email}</input>
			<br />
			<br />
			<label htmlFor="password">Change Password</label>
			<input
				type="text"
				minLength={8}
				maxLength={15}
				value={password}
				className={!password ? "error" : ""}
				onChange={addPassword}
			></input>
			<br />
			<br />
			<label htmlFor="company">Company</label>
			<input
				type="text"
				minLength={1}
				maxLength={30}
				value={company}
				onChange={addCompany}
			>{props.user.company}</input>
			<br />
			<br />
			<label htmlFor="linkedin">Your linkedin Profile URL</label>
			<input
				type="text"
				minLength={1}
				maxLength={60}
				value={linkedin}
				onChange={addLinkedin}
			>{props.user.linkedin}</input>
			<br />
			<br />
			<label htmlFor="jobTitle">Your Job Title</label>
			<input
				type="text"
				minLength={1}
				maxLength={30}
				value={jobTitle}
				onChange={addJobTitle}
			>{props.user.jobTitle}</input>
			<br />
			<br />
			<label htmlFor="salary">Annual Salary</label>
			<input
				type="text"
				minLength={1}
				maxLength={60}
				value={salary}
				onChange={addSalary}
			>{props.user.salary}</input>
			<br />
			<br />
			<label htmlFor="input">
				Years of Experience:
				<select className="experience" onChange={addYearsExperience}>
					<option className="experience" value="N/A">
						N/A
					</option>
					<option className="experience" value="< 1">
						&lt; 1
					</option>
					<option className="experience" value="1 - 3">
						1 - 3
					</option>
					<option className="experience" value="3 - 5">
						3 - 5
					</option>
					<option className="experience" value="5 - 10">
						5 - 10
					</option>
					<option className="experience" value="10+">
						10+
					</option>
				</select>
			</label>
			<br />
			<br />
			<section className="buttonGrid">
				<input
					type="submit"
					value="Update Profile"
					className="button"
				></input>
        <input
					type="delete"
					value="Delete Profile"
					className="button"
          onClick={props.deleteUser}
				></input>
			</section>
		</form>
	);
};

// user
// updateUserInfo: PropTypes.func
// deleteUser: PropTypes.func

export default UpdateUser;
