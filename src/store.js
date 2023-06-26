import {
	configureStore,
	createSlice,
	createAsyncThunk,
} from '@reduxjs/toolkit';

export const movieSlice = createSlice({
	name: 'movie',
	initialState: {
		session_id: localStorage.getItem('session_id') || null,
		userdata: localStorage.getItem('userdata')
			? JSON.parse(localStorage.getItem('userdata'))
			: null,
		currentCategory: 'Now Playing',
		movies: {},
	},
	reducers: {
		setSessionId: (state, action) => {
			state.session_id = action.payload;
		},
		setUserData: (state, action) => {
			state.userdata = action.payload;
		},
		resetMovies: (state) => {
			state.movies = {};
		},
		saveMovies: (state, action) => {
			state.movies[action.payload.page] = action.payload.data;
		},
		setCurrentCategory: (state, action) => {
			if (state.currentCategory !== action.payload) {
				state.movies = {};
				state.currentCategory = action.payload;
			}
		},
	},
});

export const {
	setCurrentCategory,
	setSessionId,
	setUserData,
	resetMovies,
	saveMovies,
} = movieSlice.actions;

export const store = configureStore({
	reducer: {
		movies: movieSlice.reducer,
	},
});
