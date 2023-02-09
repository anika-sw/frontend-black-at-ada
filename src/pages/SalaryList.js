import React, { useState, useEffect } from 'react';
import axios from "axios";
import SalaryEntry from '../components/SalaryEntry';

const kBaseUrl = 'http://localhost:5000';


const SalaryList = () => {

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
        }
      )
        setUsersData(convertedData);
      });
  }, []);

  const usersWithSalary = usersData.filter(user => user.salary > 0)
  
  const salaryList = usersWithSalary.map((user) => {
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
    )
  });


  const handleSort = (event) => {
    axios.get(`${kBaseUrl}/users?sort=${event.target.value}`, {})
      .then((response) => {
        setUsersData(response.data);
      })
      .catch(error => {
        console.log(error);
      }
    );
  };


  return (
    <>
      <h1 className="header">
        Salaries
      </h1>
      <label htmlFor="sort">Sort by:
        <select className="sort" onChange={handleSort}>
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
    </>
  )
};

export default SalaryList;