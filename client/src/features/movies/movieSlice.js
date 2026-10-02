import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';

export const fetchMovies = createAsyncThunk('movies/fetchMovies', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get('/movies', { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchFeaturedMovies = createAsyncThunk('movies/fetchFeaturedMovies', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/movies/featured');
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchMovieById = createAsyncThunk('movies/fetchMovieById', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/movies/${id}`);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const initialState = {
  movies: [],
  featuredMovies: [],
  currentMovie: null,
  total: 0,
  loading: false,
  featuredLoading: false,
  currentLoading: false,
  error: null,
  filters: {
    search: '',
    genre: '',
    language: '',
    format: '',
    status: '',
    minRating: '',
    sort: 'popularity',
  },
};

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        genre: '',
        language: '',
        format: '',
        status: '',
        minRating: '',
        sort: 'popularity',
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch movies
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Featured
      .addCase(fetchFeaturedMovies.pending, (state) => {
        state.featuredLoading = true;
      })
      .addCase(fetchFeaturedMovies.fulfilled, (state, action) => {
        state.featuredLoading = false;
        state.featuredMovies = action.payload;
      })
      .addCase(fetchFeaturedMovies.rejected, (state) => {
        state.featuredLoading = false;
      })
      // Single movie
      .addCase(fetchMovieById.pending, (state) => {
        state.currentLoading = true;
        state.currentMovie = null;
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.currentLoading = false;
        state.currentMovie = action.payload;
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.currentLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilter, resetFilters } = movieSlice.actions;
export default movieSlice.reducer;
