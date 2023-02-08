import React, { useState, useEffect } from 'react';
import axios from "axios";
import SalaryEntry from '../components/SalaryEntry';


const SalaryList = () => {
	const [usersData, setUsersData] = useState([]);

  const convertFromApi = (apiUser) => {
		const { first_name, last_name, location_name, location_lat, location_lng, profile_pic, include_name_salary, job_title, years_experience, ...rest } = apiUser;
		const jsUser = {firstName: first_name, lastName: last_name, locationName: location_name, locationLat: location_lat, locationLng: location_lng, profilePic: profile_pic, includeNameSalary: include_name_salary, jobTitle: job_title, yearsExperience: years_experience, ...rest };
    return jsUser;
	};

  useEffect(() => {
    axios
      .get("http://localhost:5000/users", {})
      .then((response) => {
        const convertedData = response.data.map((user) => {
          return convertFromApi(user);
        })
        setUsersData(convertedData);
      });
  }, []);

  const salaryList = usersData.map((user) => {
    return (
      <li key={user.id}>
        <SalaryEntry
        firstName={user.firstName}
        lastName={user.lastName}
        pronouns={user.pronouns}
        salary={user.salary}
        company={user.company}
        jobTitle={user.jobTitle}
        yearsExperience={user.yearsExperience}
        includeNameSalary={user.includeNameSalary}
        ></SalaryEntry>
      </li>
    );
  });


  const handleSelect = (event) => {
    axios
    .get(`http://localhost:5000/users?sort=${event.target.value}`, {})
    .then((response) => {
      setUsersData(response.data);
    });
  }

  return (
    <div>
      <h1 className="header">
        Salaries
      </h1>
      <label htmlFor="sort">Sort by:
            <select className="sort" onChange={handleSelect}>
                <option value="none"></option>
                <option value="salaryAsc">Low to High</option>
                <option value="salaryDesc">High to Low</option>
                <option value="salaryCompany">Company</option>
            </select>
        </label>
      <section>
        <ul>{salaryList}</ul>
      </section>
      <section>
        <h2>Salary Range</h2>
        <p></p>
      </section>
      <section>
        <h2>Years of Experience (Mode)</h2>
        <p></p>
      </section>
      <section>
        <h3>What other salary statistics would you like to see?</h3>
        <p>Let us know! Contact us</p>
      </section>
      <section>
        <h2>Alpha List of Companies in the List</h2>
        <p></p>
      </section>
    </div>
  )
};

export default SalaryList;