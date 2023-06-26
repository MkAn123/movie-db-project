import { Box, ListItemButton, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import StarIcon from '@mui/icons-material/Star';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { api_key } from '../service';
import { useEffect, useState } from 'react';
export default function MovieList({ movies, onClickUnFavorite }) {
	const navigate = useNavigate();
	const session_id = useSelector((state) => state.movies.session_id);

	const [refreshFavorites, setRefreshFavorites] = useState(true);
	const [alreadyFavorites, setAlreadyFavorites] = useState([]);

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
					setAlreadyFavorites(
						data.results.map((result) => result.id)
					);
				});
		}
	}, [refreshFavorites]);

	const handleClickUnFavorite = (movie_id) => {
		if (session_id) {
			fetch(
				`
https://api.themoviedb.org/3/account/19746762/favorite?api_key=${api_key}&session_id=${session_id}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						favorite: false,
						media_id: movie_id,
						media_type: 'movie',
					}),
				}
			).then((res) => {
				if (res.status === 200) {
					setRefreshFavorites(!refreshFavorites);
					if (onClickUnFavorite) {
						onClickUnFavorite();
					}
				}
			});
		}
	};
	const handleClickFavorite = (movie_id) => {
		if (session_id) {
			fetch(
				`
https://api.themoviedb.org/3/account/19746762/favorite?api_key=${api_key}&session_id=${session_id}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						favorite: true,
						media_id: movie_id,
						media_type: 'movie',
					}),
				}
			).then((res) => {
				if (res.status === 201) {
					setRefreshFavorites(!refreshFavorites);
				}
			});
		}
	};

	return (
		<Box>
			<Box
				display="grid"
				gridTemplateColumns="repeat(4, 1fr)"
				gap={2}
				padding={'15px'}
			>
				{movies.map((movie) => {
					return (
						<Card key={movie.id}>
							<Box style={{ padding: '20px' }} elevation={4}>
								<img
									width={'100%'}
									src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
								/>
								<ListItemButton
									onClick={() => {
										navigate(`/movies/${movie.id}`);
									}}
									style={{ textAlign: 'center' }}
								>
									<Typography variant={'h5'}>
										{movie.title}
									</Typography>
								</ListItemButton>
								<Box
									marginTop={'25px'}
									display={'flex'}
									alignItems={'center'}
								>
									<StarIcon style={{ color: 'yellow' }} />
									<Box marginRight={'auto'}>
										{movie.vote_average}
									</Box>
									{session_id &&
									alreadyFavorites.includes(movie.id) ? (
										<FavoriteIcon
											onClick={() =>
												handleClickUnFavorite(movie.id)
											}
											style={{ color: 'pink' }}
										/>
									) : (
										<FavoriteBorderIcon
											onClick={() =>
												handleClickFavorite(movie.id)
											}
										/>
									)}
								</Box>
							</Box>
						</Card>
					);
				})}
			</Box>
		</Box>
	);
}
