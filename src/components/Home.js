import {
	Box,
	Button,
	CircularProgress,
	MenuItem,
	TextField,
	Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { api_key } from '../service';
import MovieList from './MovieList';
import { resetMovies, saveMovies, setCurrentCategory } from '../store';

const MOVIE_APIS = {
	Popular: 'https://api.themoviedb.org/3/movie/popular',
	'Now Playing': 'https://api.themoviedb.org/3/movie/now_playing',
	'Top Rated': 'https://api.themoviedb.org/3/movie/top_rated',
	Upcoming: 'https://api.themoviedb.org/3/movie/upcoming',
};

export default function Home() {
	const [loading, setLoading] = useState(false);
	const category = useSelector((state) => state.movies.currentCategory);
	const movies = useSelector((state) => state.movies.movies);
	const dispatch = useDispatch();
	const [page, setPage] = useState(1);

	const movieList = useMemo(() => {
		if (movies[page]) {
			return movies[page].movies;
		}
		return [];
	}, [movies, page]);

	const totalPage = useMemo(() => {
		if (movies[page]) {
			return movies[page].totalPage;
		}
		return null;
	}, [movies, page]);

	useEffect(() => {
		setPage(1);
	}, [category]);

	useEffect(() => {
		const fetchMovies = async () => {
			setLoading(true);
			const api_url = MOVIE_APIS[category];
			if (api_url) {
				fetch(api_url + `?api_key=${api_key}&page=${page}`, {
					headers: {
						'Content-Type': 'application/json',
					},
				})
					.then((res) => res.json())
					.then((data) => {
						setLoading(false);
						dispatch(
							saveMovies({
								page: page,
								data: {
									movies: data.results,
									totalPage: data.total_pages,
								},
							})
						);
					});
			}
		};

		if (!movies[page]) {
			fetchMovies();
		}
	}, [page, category]);

	const handleClickPrev = () => {
		if (page > 1) {
			setPage(page - 1);
		}
	};

	const handleClickNext = () => {
		if (page < totalPage) {
			setPage(page + 1);
		}
	};

	return (
		<Box>
			<Box textAlign={'end'} marginTop={'30px'}>
				<TextField
					value={category}
					onChange={(e) => {
						dispatch(setCurrentCategory(e.target.value));
					}}
					variant={'standard'}
					style={{ minWidth: '100px' }}
					select
					label={'Category'}
				>
					<MenuItem value={'Popular'}>Popular</MenuItem>
					<MenuItem value={'Now Playing'}>Now Playing</MenuItem>
					<MenuItem value={'Top Rated'}>Top Rated</MenuItem>
					<MenuItem value={'Upcoming'}>Upcoming</MenuItem>
				</TextField>
			</Box>
			<Box
				width={'30%'}
				margin={'auto'}
				justifyContent={'space-between'}
				display={'flex'}
			>
				<Button onClick={handleClickPrev} variant={'contained'}>
					PREV
				</Button>
				{totalPage && (
					<Typography variant={'subtitle1'}>
						{page} / {totalPage}
					</Typography>
				)}
				<Button onClick={handleClickNext} variant={'contained'}>
					NEXT
				</Button>
			</Box>
			<Box>
				{!loading && <MovieList movies={movieList} />}
				{loading && (
					<Box textAlign={'center'}>
						<CircularProgress />
					</Box>
				)}
			</Box>
		</Box>
	);
}
