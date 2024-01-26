import React, { useState, useEffect } from "react";
import axios from "axios";
import SalaryEntry from "../components/SalaryEntry";
import { Select, MenuItem } from "@material-ui/core";
import "../styles/SalaryList.css";

const kBaseUrl = "http://localhost:5000";

const SalaryList = () => {
	const [usersData, setUsersData] = useState([]);
	const [selected, setSelected] = useState("Sort By:");

	const convertFromApi = (apiUser) => {
		const {
			first_name,
			last_name,
			location_name,
			location_lat,
			location_lng,
			profile_pic_file,
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
			profilePicFile: profile_pic_file,
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
		axios
			.get(`${kBaseUrl}/users`, {})
			.then((response) => {
				const convertedData = response.data.map((user) => {
					return convertFromApi(user);
				});
				setUsersData(convertedData);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	const dateReformat = (string) => {
		if (!string) {
			return;
		}
		const dateArray = string.split(" ");
		return `${dateArray[2]} ${dateArray[3]}`;
	};

	const usersWithSalary = usersData.filter((user) => user.salary > 0);

	const salaryList = usersWithSalary.map((user) => {
		return (
			<span className="salary-grid" key={user.id}>
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
			</span>
		);
	});

	const handleSort = (event) => {
		const sortBy = event.target.value;
		setSelected(sortBy);
		axios
			.get(`${kBaseUrl}/users?sort=${sortBy}`, {})
			.then((response) => {
				const convertedData = response.data.map((user) => {
					return convertFromApi(user);
				});
				setUsersData(convertedData);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<>
			<h1 className="header salary-header">Salaries</h1>
			<div className="sort-btn-flex">
				<Select
					className="sort-btn"
					value={selected}
					renderValue={(value) => (value ? value : "Sort By:")}
					onChange={handleSort}
				>
					<MenuItem className="sort-item" value="salaryAsc">
						Low to High
					</MenuItem>
					<MenuItem className="sort-item" value="salaryDesc">
						High to Low
					</MenuItem>
					<MenuItem className="sort-item" value="salaryCompany">
						Company
					</MenuItem>
				</Select>
			</div>
			<section>
				<ul>{salaryList}</ul>
			</section>
		</>
	);
};

export default SalaryList;
