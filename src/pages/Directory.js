import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserEntry from '../components/UserEntry';
import { Select, MenuItem } from '@material-ui/core';
import FloatingActionButton from '../components/FloatingActionButton';
import '../styles/Directory.css';

const kBaseUrl = process.env.REACT_APP_BE_URL;

const Directory = () => {
	const [usersData, setUsersData] = useState([]);
	const [selected, setSelected] = useState('Sort By:');

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
			...rest,
		};
		return jsUser;
	};

	useEffect(() => {
		axios.get(`${kBaseUrl}/users`, {}).then((response) => {
			const convertedData = response.data.map((user) => {
				return convertFromApi(user);
			});
			setUsersData(convertedData);
		});
	}, []);

	const usersList = usersData.map((user) => {
		return (
			<span className='directory-span' key={user.id}>
				<UserEntry user={user}></UserEntry>
			</span>
		);
	});

	const handleSort = (event) => {
		const sortBy = event.target.value;
		setSelected('Sort By: ');
		axios.get(`${kBaseUrl}/users?sort=${sortBy}`, {}).then((response) => {
			const convertedData = response.data.map((user) => {
				return convertFromApi(user);
			});
			setUsersData(convertedData);
		});
	};

	return (
		<>
			<h1 className='header directory-header'>
				Bl<span className='at'>a</span>ck Adie Directory
			</h1>
			<div className='sort-btn-flex'>
				<Select
					className='sort-btn'
					value={selected}
					renderValue={(value) => (value ? value : { setSelected })}
					onChange={handleSort}
				>
					<MenuItem className='sort-item' value='Sort By:'>
						Sort By:
					</MenuItem>
					<MenuItem className='sort-item' value='lastName'>
						Last Name
					</MenuItem>
					<MenuItem className='sort-item' value='cohort'>
						Cohort
					</MenuItem>
					<MenuItem className='sort-item' value='company'>
						Company
					</MenuItem>
				</Select>
			</div>
			<ul className='directory-container'>{usersList}</ul>
			<div className='floating-btn-flex'>
				<div className='floating-btn'>
					<FloatingActionButton showBelow={400} />
				</div>
			</div>
		</>
	);
};

export default Directory;
