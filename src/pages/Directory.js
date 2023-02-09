import React, { useEffect, useState } from "react";
import axios from "axios";
import UserEntry from  "../components/UserEntry";

const kBaseUrl = 'http://localhost:5000';


const Directory = () => {

	const [usersData, setUsersData] = useState([]);

  const convertFromApi = (apiUser) => {
		const {
			first_name,
			last_name,
			location_name,
			location_lat,
			location_lng,
			profile_pic_url,
			include_name_salary,
			job_title,
			years_experience,
			...rest
		} = apiUser;

		const jsUser = {
			firstName: first_name,
			lastName: last_name,
			locationName: location_name,
			locationLat: location_lat,
			locationLng: location_lng,
			profilePicUrl: profile_pic_url,
			includeNameSalary: include_name_salary,
			jobTitle: job_title,
			yearsExperience: years_experience,
			...rest,
		};
    return jsUser;
	};

  useEffect(() => {
    axios.get(`${kBaseUrl}/users`, {})
      .then((response) => {
        const convertedData = response.data.map((user) => {
          return convertFromApi(user);
        });
        setUsersData(convertedData);
      });
  }, []);

  const usersList = usersData.map((user) => {
    return (
      <div key={user.id}>
        <UserEntry
          user={user}
        ></UserEntry>
      </div>
    );
  });

  const handleSort = (event) => {
    axios.get(`${kBaseUrl}/users?sort=${event.target.value}`, {})
    .then((response) => {
      const convertedData = response.data.map((user) => {
        return convertFromApi(user);
      })
      setUsersData(convertedData);
    });
  };


  return (
    <>
      <h1 className="header">
        Black Adie Directory
      </h1>
      <section>
        <h2>Alphabet Nav Here</h2>
        <div id='nav' className="alphabetNav"></div>
        <label htmlFor="sort">Sort by:
          <select className="sort" onChange={handleSort}>
            <option value="none"></option>
            <option value="lastName">Last Name</option>
            <option value="cohort">Cohort</option>
            <option value="company">Company</option>
            {/* <option value="nearMe">Near me</option> */}
          </select>
        </label>
        <ul>{usersList}</ul>
      </section> 
    </>
  )
};  

export default Directory;