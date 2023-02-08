import React, { useEffect, useState } from "react";
import axios from "axios";
import UpdateUser from "../components/UpdateUser";

const kBaseUrl = "http://localhost:5000";


const UserProfile = () => {

	const [userData, setUserData] = useState([]);

  const convertFromApi = (apiUser) => {
		// const {id, name, color, personality, pet_count, caretaker} = apiCat;
		const { first_name, ...rest } = apiUser;

		// const newCat = {id, name, color, personality, petCount: pet_count, caretaker};
		const newUser = { firstName: first_name, ...rest };
		return newUser;
	};

	const updateUserInApi = (jsUser) => {
		const {
			firstName,
			lastName,
			locationName,
			locationLat,
			locationLng,
      // profilePic,
      includeNameSalary,
			jobTitle,
			yearsExperience,
			...rest
		} = jsUser;
		const apiUser = {
			first_name: firstName,
			last_name: lastName,
			location_name: locationName,
			location_lat: locationLat,
			location_lng: locationLng,
      // profile_pic: profilePic,
      include_name_salary: includeNameSalary,
			job_title: jobTitle,
			years_experience: yearsExperience,
			...rest,
		};
		console.log("api", apiUser);
		const requestBody = { ...apiUser };
		// console.log(requestBody);

		axios
			.put(`${kBaseUrl}/users`, requestBody)
			.then((response) => {
				console.log("Response:", response.data);
				// return convertFromApi(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	useEffect(() => {
		axios.get("http://localhost:5000/users/<id>", {})
    .then((response) => {
			setUserData(response.data);
		});
	}, []);

  const deleteUser = (id) => {
    return axios.delete(`${kBaseUrl}/users/${id}`)
    .then(response => {
      return convertFromApi(response.data);
    })
    .catch(error => {
      console.log(error);
    });
  };

	return (
		<div>
			<h1 className="header">Profile</h1>
			<section>
				<UpdateUser         
        user={userData}
        updateUserInfo={updateUserInApi}
        deleteUserInfo={deleteUser}/>
			</section>
			<section>
				<br />
				<br />
				<br />
				<br />
				<br />
			</section>
		</div>
	);
};

export default UserProfile;
