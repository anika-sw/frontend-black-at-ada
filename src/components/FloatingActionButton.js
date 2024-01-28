import React, { useState, useEffect } from 'react';
import Fab from '@mui/material/Fab';
import NavigationIcon from '@mui/icons-material/Navigation';
import '../styles/FloatingActionButton.css';

function FloatingActionButton({ showBelow }) {
	const [show, setShow] = useState(showBelow ? false : true);

	const handleScroll = () => {
		if (window.scrollY > showBelow) {
			if (!show) setShow(true);
		} else {
			if (show) setShow(false);
		}
	};

	const handleClick = () => {
		window[`scrollTo`]({ top: 0, behavior: `smooth` });
	};

	useEffect(() => {
		if (showBelow) {
			window.addEventListener(`scroll`, handleScroll);
			return () => window.removeEventListener(`scroll`, handleScroll);
		}
	});

	return (
		<>
			{show && (
				<Fab
					sx={{
						width: '10px',
						maxWidth: '100%',
					}}
					className='toTop'
					variant='extended'
					size='small'
					onClick={handleClick}>
          <NavigationIcon />
				</Fab>
			)}
		</>
	);
}

export default FloatingActionButton;