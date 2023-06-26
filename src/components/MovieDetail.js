import {
	Box,
	Container,
	Grid,
	Typography,
	Chip,
	CircularProgress,
	TextField,
	MenuItem,
	Button,
	Snackbar,
	Alert,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api_key } from '../service';
import StarIcon from '@mui/icons-material/Star';
import { useSelector } from 'react-redux';

export default function MovieDetail() {
	const { movieId } = useParams();
	const [movie, setMovie] = useState();
	const [rate, setRate] = useState(1);
	const session_id = useSelector((state) => state.movies.session_id);
	const [open, setOpen] = useState(false);
	const [rated, setRated] = useState(null);

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
					console.log(data);
					setRated(
						data.results
							.reverse()
							.find((result) => result.id === Number(movieId))
					);
				});
		}
	}, [session_id]);

	const handleClickRate = () => {
		if (session_id) {
			fetch(
				`https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=${api_key}&session_id=${session_id}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						value: Number(rate),
					}),
				}
			).then((res) => {
				if (res.status === 201) {
					setOpen(true);
					setRated({
						rating: rate,
					});
				}
			});
		}
	};

	useEffect(() => {
		fetch(
			`https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}`,
			{
				headers: {
					'Content-Type': 'application',
				},
			}
		)
			.then((res) => res.json())
			.then((data) => {
				setMovie(data);
			});
	}, [movieId]);

	if (!movie) {
		return (
			<Box marginTop={'20px'} textAlign={'center'}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Container
			style={{
				paddingTop: '20px',
			}}
		>
			<Snackbar
				anchorOrigin={{
					horizontal: 'center',
					vertical: 'top',
				}}
				open={open}
				autoHideDuration={6000}
				onClose={() => {
					setOpen(false);
				}}
				action={null}
			>
				<Alert
					onClose={() => {
						setOpen(false);
					}}
					severity="success"
					sx={{ width: '100%' }}
				>
					Rate Success!
				</Alert>
			</Snackbar>
			<Grid container spacing={3}>
				<Grid item xs={3}>
					<img
						width={'100%'}
						src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
					/>
				</Grid>
				<Grid item xs={9}>
					<Typography variant={'h2'}>{movie.title}</Typography>
					<Typography variant={'h6'}>Release date:</Typography>
					<Typography variant={'p'}>{movie.release_date}</Typography>
					<Typography variant={'h6'}>Overview:</Typography>
					<Typography variant={'p'}>{movie.overview}</Typography>
					<Typography variant={'h6'}>Genres:</Typography>
					<Box display={'flex'} flexWrap={'wrap'}>
						{movie.genres.map((genre) => {
							return (
								<Chip
									style={{ marginRight: '20px' }}
									color={'primary'}
									label={genre.name}
									key={genre.id}
								/>
							);
						})}
					</Box>
					<Typography variant={'h6'}>Average Rating:</Typography>
					<Box>
						<StarIcon style={{ color: 'yellow' }} />
						{movie.vote_average}
					</Box>

					<Typography variant={'h6'}>Your Rating: </Typography>
					<Typography variant={'p'}>
						{session_id && rated ? rated.rating : 'Not yet'}
					</Typography>
					<Box display={'flex'}>
						<TextField
							style={{ marginRight: '10px' }}
							size={'small'}
							onChange={(e) => {
								setRate(Number(e.target.value));
							}}
							value={rate}
							select
						>
							{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => {
								return (
									<MenuItem value={item} key={item}>
										{item}
									</MenuItem>
								);
							})}
						</TextField>
						<Button onClick={handleClickRate} variant={'contained'}>
							RATE IT!
						</Button>
					</Box>

					<Typography variant={'h6'}>
						Production Companies:
					</Typography>
					<Box display={'flex'} flexWrap={'wrap'}>
						{movie.production_companies.map((company) => {
							return (
								<Box
									key={company.id}
									marginRight={'20px'}
									marginTop={'20px'}
								>
									{company.logo_path && (
										<img
											width={'100px'}
											src={`https://image.tmdb.org/t/p/w500${company.logo_path}`}
										/>
									)}
									<Typography>{company.name}</Typography>
								</Box>
							);
						})}
					</Box>
				</Grid>
			</Grid>
		</Container>
	);
}
