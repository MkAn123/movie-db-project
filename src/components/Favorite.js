import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { api_key } from '../service';
import { useSelector } from 'react-redux';
import MovieList from './MovieList';

export default function Favorite() {
	const [alreadyFavorites, setAlreadyFavorites] = useState([]);
	const [refreshFavorites, setRefreshFavorites] = useState(true);
	const session_id = useSelector((state) => state.movies.session_id);

	useEffect(() => {
		if (session_id) {
			fetch(
				`https://api.themoviedb.org/3/account/19746762/favorite/movies?api_key=${api_key}&session_id=${session_id}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			)
				.then((res) => {
					if (res.status === 200) {
						return res.json();
					}
				})
				.then((data) => {
					setAlreadyFavorites(data.results);
				});
		}
	}, [refreshFavorites]);
	return (
		<Box>
			<Typography
				marginTop={'20px'}
				marginBottom={'30px'}
				variant={'h2'}
				textAlign={'center'}
			>
				Favorite Movies
			</Typography>
			<MovieList
				onClickUnFavorite={() => {
					setRefreshFavorites(!refreshFavorites);
				}}
				movies={alreadyFavorites}
			/>
		</Box>
	);
}
