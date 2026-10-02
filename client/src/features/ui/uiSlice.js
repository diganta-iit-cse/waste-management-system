import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  trailerModal: {
    isOpen: false,
    trailerUrl: '',
    title: '',
  },
  toasts: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openTrailer: (state, action) => {
      state.trailerModal = {
        isOpen: true,
        trailerUrl: action.payload.trailerUrl,
        title: action.payload.title,
      };
    },
    closeTrailer: (state) => {
      state.trailerModal.isOpen = false;
      state.trailerModal.trailerUrl = '';
      state.trailerModal.title = '';
    },
    addToast: (state, action) => {
      // payload: { id, type: 'success' | 'error' | 'info', message }
      const id = action.payload.id || Date.now();
      state.toasts.push({ id, ...action.payload });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { openTrailer, closeTrailer, addToast, removeToast } = uiSlice.actions;
export default uiSlice.reducer;
