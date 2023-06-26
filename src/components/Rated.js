import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { api_key } from '../service';
import { useSelector } from 'react-redux';
import MovieList from './MovieList';

export default function Rated() {
	const [ratedMovies, setRatedMovies] = useState([]);
	const session_id = useSelector((state) => state.movies.session_id);

	useEffect(() => {
		if (session_id) {
			fetch(
				`https://api.themoviedb.org/3/account/19746762/rated/movies?api_key=${api_key}&session_id=${session_id}`,
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			)
				.then((res) => res.json())
				.then((data) => {
					setRatedMovies(data.results);
				});
		}
	}, [session_id]);
	return (
		<Box>
			<Typography
				marginTop={'20px'}
				marginBottom={'30px'}
				variant={'h2'}
				textAlign={'center'}
			>
				Rated Movies
			</Typography>
			<Box marginTop={'20px'}>
				<MovieList movies={ratedMovies} />
			</Box>
		</Box>
	);
}
