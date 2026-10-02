import { createSlice } from '@reduxjs/toolkit';

const POPULAR_CITIES = [
  'Mumbai',
  'Delhi-NCR',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Chandigarh',
  'Ludhiana',
  'Jaipur',
];

const savedCity = localStorage.getItem('cinebook_city') || 'Mumbai';

const initialState = {
  selectedCity: savedCity,
  popularCities: POPULAR_CITIES,
  isLocationModalOpen: false,
};

const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {
    setCity: (state, action) => {
      state.selectedCity = action.payload;
      localStorage.setItem('cinebook_city', action.payload);
      state.isLocationModalOpen = false;
    },
    openLocationModal: (state) => {
      state.isLocationModalOpen = true;
    },
    closeLocationModal: (state) => {
      state.isLocationModalOpen = false;
    },
  },
});

export const { setCity, openLocationModal, closeLocationModal } = citySlice.actions;
export default citySlice.reducer;
