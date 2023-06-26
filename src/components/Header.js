import { AppBar, Box, Button, Menu, MenuItem, Toolbar } from '@mui/material';
import Logo from '../assets/logo.svg';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { setSessionId, setUserData } from '../store';

export default function Header() {
	const userdata = useSelector((state) => state.movies.userdata);
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const dispatch = useDispatch();
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleSignOut = () => {
		setAnchorEl(null);
		dispatch(setSessionId(null));
		dispatch(setUserData(null));
		localStorage.removeItem('session_id');
		localStorage.removeItem('userdata');
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	return (
		<AppBar position="static">
			<Toolbar
				style={{
					padding: '10px',
					display: 'flex',
					alignItems: 'center',
				}}
			>
				<img src={Logo} width={'60px'} />
				<Box marginLeft={'40px'} marginRight={'auto'}>
					<Link className={'link'} to={'/'}>
						HOME
					</Link>

					<Link className={'link'} to={'/favorite'}>
						FAVORITE
					</Link>

					<Link className={'link'} to={'/rated'}>
						RATED
					</Link>
				</Box>
				{!userdata && (
					<Link className={'link'} to={'login'}>
						<small>Login</small>
					</Link>
				)}
				{userdata && (
					<>
						<Button
							color={'inherit'}
							id="basic-button"
							aria-controls={open ? 'basic-menu' : undefined}
							aria-haspopup="true"
							aria-expanded={open ? 'true' : undefined}
							onClick={handleClick}
						>
							{userdata.username}
						</Button>
						<Menu
							id="basic-menu"
							anchorEl={anchorEl}
							open={open}
							onClose={handleClose}
							MenuListProps={{
								'aria-labelledby': 'basic-button',
							}}
						>
							<MenuItem onClick={handleSignOut}>Logout</MenuItem>
						</Menu>
					</>
				)}
			</Toolbar>
		</AppBar>
	);
}
