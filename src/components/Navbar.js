import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Select, MenuItem } from '@material-ui/core';
import '../styles/Navbar.css';

const Navbar = () => {
	const [selected, setSelected] = useState('Site Navigation');

	const { logout } = useAuth();

	const selectionChangeHandler = (event) => {
		setSelected(event.target.value);
	};

	return (
		<nav className='navbar'>
			<a className='navbar-brand' href='/home'>
				Black<span className='at'>@</span>Ada
			</a>
			<div>
				<Select
					style={{
						background: '#f7b402',
						fontFamily: 'Poppins',
						borderRadius: '5px',
						paddingLeft: '10px',
						paddingRight: '5px',
					}}
					className='menu'
					value={selected}
					renderValue={(value) => (value ? value : 'Site Navigation')}
					onChange={selectionChangeHandler}
				>
					<MenuItem className='dropdown-item' value='Site Navigation'>
						Site Navigation
					</MenuItem>
					<MenuItem className='dropdown-item' value='Home'>
						<a className='dropdown-link' href='/home'>
							Home
						</a>
					</MenuItem>
					<MenuItem className='dropdown-item' value='Events'>
						<a className='dropdown-link' href='/events'>
							Events
						</a>
					</MenuItem>
					<MenuItem className='dropdown-item' value='Salaries'>
						<a className='dropdown-link' href='/salaries'>
							Salaries
						</a>
					</MenuItem>
					<MenuItem className='dropdown-item' value='Directory'>
						<a className='dropdown-link' href='/directory'>
							Directory
						</a>
					</MenuItem>
					<MenuItem className='dropdown-item' value='My Profile'>
						<a className='dropdown-link' href='/profile'>
							My Profile
						</a>
					</MenuItem>
					<MenuItem className='dropdown-item' onClick={logout}>
						Logout
					</MenuItem>
				</Select>
			</div>
		</nav>
	);
};

export default Navbar;
