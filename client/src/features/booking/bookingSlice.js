import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';

// Get or generate session ID for seat locks
const getLockSessionId = () => {
  let id = sessionStorage.getItem('cinebook_lock_session');
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('cinebook_lock_session', id);
  }
  return id;
};

export const fetchShowDetails = createAsyncThunk('booking/fetchShowDetails', async (showId, { rejectWithValue }) => {
  try {
    const res = await api.get(`/shows/${showId}`);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const lockSeatsBackend = createAsyncThunk(
  'booking/lockSeatsBackend',
  async ({ showId, seats }, { rejectWithValue }) => {
    try {
      const lockSessionId = getLockSessionId();
      const res = await api.post('/seats/lock', {
        showId,
        seats,
        lockSessionId,
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const releaseSeatsBackend = createAsyncThunk(
  'booking/releaseSeatsBackend',
  async ({ showId, seats }, { rejectWithValue }) => {
    try {
      const lockSessionId = getLockSessionId();
      const res = await api.post('/seats/release', {
        showId,
        seats,
        lockSessionId,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  currentShow: null,
  selectedSeats: [],
  lockSessionId: getLockSessionId(),
  lockedUntil: null,
  lockSecondsRemaining: 0,
  foodCart: [],
  coupon: null,
  confirmedBooking: null,
  loading: false,
  lockLoading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    toggleSeat: (state, action) => {
      const seat = action.payload; // { seatId, row, number, category, price }
      const existsIndex = state.selectedSeats.findIndex((s) => s.seatId === seat.seatId);

      if (existsIndex >= 0) {
        state.selectedSeats.splice(existsIndex, 1);
      } else {
        // Limit to 10 seats per booking
        if (state.selectedSeats.length < 10) {
          state.selectedSeats.push(seat);
        }
      }
    },
    clearSeats: (state) => {
      state.selectedSeats = [];
      state.lockedUntil = null;
      state.lockSecondsRemaining = 0;
    },
    setLockTimer: (state, action) => {
      state.lockedUntil = action.payload;
    },
    decrementLockTimer: (state) => {
      if (state.lockSecondsRemaining > 0) {
        state.lockSecondsRemaining -= 1;
      }
    },
    addFoodItem: (state, action) => {
      const item = action.payload;
      const index = state.foodCart.findIndex((f) => f._id === item._id);
      if (index >= 0) {
        state.foodCart[index].quantity += 1;
      } else {
        state.foodCart.push({ ...item, quantity: 1 });
      }
    },
    removeFoodItem: (state, action) => {
      const id = action.payload;
      const index = state.foodCart.findIndex((f) => f._id === id);
      if (index >= 0) {
        if (state.foodCart[index].quantity > 1) {
          state.foodCart[index].quantity -= 1;
        } else {
          state.foodCart.splice(index, 1);
        }
      }
    },
    clearFood: (state) => {
      state.foodCart = [];
    },
    applyCouponSuccess: (state, action) => {
      state.coupon = action.payload;
    },
    removeCoupon: (state) => {
      state.coupon = null;
    },
    setConfirmedBooking: (state, action) => {
      state.confirmedBooking = action.payload;
    },
    resetBookingState: (state) => {
      state.selectedSeats = [];
      state.lockedUntil = null;
      state.lockSecondsRemaining = 0;
      state.foodCart = [];
      state.coupon = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch show details
      .addCase(fetchShowDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShowDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShow = action.payload;
      })
      .addCase(fetchShowDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Lock seats
      .addCase(lockSeatsBackend.pending, (state) => {
        state.lockLoading = true;
        state.error = null;
      })
      .addCase(lockSeatsBackend.fulfilled, (state, action) => {
        state.lockLoading = false;
        state.lockedUntil = action.payload.lockedUntil;
        state.lockSecondsRemaining = action.payload.lockDurationSeconds || 300;
      })
      .addCase(lockSeatsBackend.rejected, (state, action) => {
        state.lockLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  toggleSeat,
  clearSeats,
  setLockTimer,
  decrementLockTimer,
  addFoodItem,
  removeFoodItem,
  clearFood,
  applyCouponSuccess,
  removeCoupon,
  setConfirmedBooking,
  resetBookingState,
} = bookingSlice.actions;

export default bookingSlice.reducer;
