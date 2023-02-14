import React, { useState, useEffect } from 'react';
import axios from "axios";
import SalaryEntry from '../components/SalaryEntry';
import "../styles/SalaryList.css";

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
      user_first_created,
      user_last_updated,
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
      userFirstCreated: user_first_created,
      userLastUpdated: user_last_updated,
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
      })
      .catch(error => {
        console.log(error);
      }
    );
  }, []);

  const dateReformat = (string) => {
    if (!string) {
      return
    }
    const dateArray = string.split(' ');
    return `${dateArray[2]} ${dateArray[3]}`
  };

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
        created={dateReformat(user.userFirstCreated)}
        updated={dateReformat(user.userFirstCreated)}
        ></SalaryEntry>
      </li>
    )
  });


  const handleSort = (event) => {
    axios.get(`${kBaseUrl}/users?sort=${event.target.value}`, {})
      .then((response) => {
        const convertedData = response.data.map((user) => {
          return convertFromApi(user);
        }
      )
      setUsersData(convertedData);
      })
      .catch(error => {
        console.log(error);
      }
    );
  };


  return (
    <>
      <h1 className="header salary-header">
        Salaries
      </h1>
      <div className="salary-sort-btn-flex">
        <select className="sort sort-btn" onChange={handleSort}>
          <option value="none">Sort By:</option>
          <option value="salaryAsc">Low to High</option>
          <option value="salaryDesc">High to Low</option>
          <option value="salaryCompany">Company</option>
        </select>
      </div>
      <section>
        <ul>{salaryList}</ul>
      </section>
    </>
  )
};

export default SalaryList;