import { Outlet, Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './components/Header';
import Home from './components/Home';
import Rated from './components/Rated';
import Login from './components/Login';
import Favorite from './components/Favorite';
import MovieDetail from './components/MovieDetail';

function App() {
	return (
		<Box>
			<Header />
			<Box>
				<Routes>
					<Route path={''} index element={<Home />} />
					<Route path={'favorite'} element={<Favorite />} />
					<Route path={'rated'} element={<Rated />} />
					<Route path={'login'} element={<Login />} />
					<Route path={'movies/:movieId'} element={<MovieDetail />} />
				</Routes>
			</Box>
		</Box>
	);
}

export default App;
