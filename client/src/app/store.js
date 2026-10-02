import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import movieReducer from '../features/movies/movieSlice';
import cityReducer from '../features/city/citySlice';
import bookingReducer from '../features/booking/bookingSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: movieReducer,
    city: cityReducer,
    booking: bookingReducer,
    ui: uiReducer,
  },
});
