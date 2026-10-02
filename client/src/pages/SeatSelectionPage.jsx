import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchShowDetails,
  lockSeatsBackend,
  clearSeats,
  decrementLockTimer,
} from '../features/booking/bookingSlice';
import { addToast } from '../features/ui/uiSlice';
import SeatMap from '../components/booking/SeatMap';
import SeatLegend from '../components/booking/SeatLegend';
import PriceSummary from '../components/booking/PriceSummary';
import { Film, Calendar, Clock, MapPin, ArrowLeft, AlertCircle } from 'lucide-react';

const SeatSelectionPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    currentShow,
    selectedSeats,
    lockSecondsRemaining,
    lockLoading,
    loading,
    error,
  } = useSelector((state) => state.booking);

  // Load show details
  useEffect(() => {
    if (showId) {
      dispatch(fetchShowDetails(showId));
    }
    return () => {
      // Clean up on unmount if no booking was confirmed
    };
  }, [showId, dispatch]);

  // Lock timer countdown interval
  useEffect(() => {
    if (lockSecondsRemaining <= 0) return;
    const interval = setInterval(() => {
      dispatch(decrementLockTimer());
    }, 1000);
    return () => clearInterval(interval);
  }, [lockSecondsRemaining, dispatch]);

  // Handle Proceed button click -> Lock seats on backend & go to food or checkout
  const handleProceed = async () => {
    if (selectedSeats.length === 0) {
      dispatch(addToast({ type: 'error', message: 'Please select at least 1 seat to proceed' }));
      return;
    }

    try {
      const seatIds = selectedSeats.map((s) => s.seatId);
      const res = await dispatch(lockSeatsBackend({ showId, seats: seatIds })).unwrap();
      dispatch(
        addToast({
          type: 'success',
          message: `Seats [${seatIds.join(', ')}] locked for 5 minutes!`,
        })
      );
      // Navigate to Food concession page
      navigate(`/booking/${showId}/food`);
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err || 'Failed to lock seats' }));
      // Refresh seat status to show updated availability
      dispatch(fetchShowDetails(showId));
    }
  };

  if (loading || !currentShow) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const movie = currentShow.movie || {};
  const theatre = currentShow.theatre || {};
  const screen = currentShow.screen || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      {/* Top Breadcrumb & Movie Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-cinema-850 hover:bg-cinema-800 text-gray-300 hover:text-white border border-white/5 transition-colors"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>{movie.title}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-brand/20 text-brand border border-brand/30">
                {currentShow.format || '2D'}
              </span>
            </h1>
            <p className="text-xs text-gray-400 mt-0.5 flex flex-wrap items-center gap-2">
              <span className="text-gray-300 font-medium">{theatre.name}</span>
              <span>•</span>
              <span>{screen.name}</span>
              <span>•</span>
              <span className="text-white font-semibold">{currentShow.date}</span>
              <span>•</span>
              <span className="text-amber-400 font-semibold">{currentShow.startTime}</span>
            </p>
          </div>
        </div>

        {/* Legend Ribbon */}
        <div className="w-full md:w-auto">
          <SeatLegend pricing={currentShow.pricing} />
        </div>
      </div>

      {/* Main Seat Map & Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cinema Auditorium Seat Map */}
        <div className="lg:col-span-2 bg-cinema-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
          <SeatMap
            seatMap={currentShow.seatMap || []}
            lockedSeats={currentShow.lockedSeats || []}
            bookedSeats={currentShow.bookedSeats || []}
          />
        </div>

        {/* Sticky Price Breakdown */}
        <div className="lg:col-span-1">
          <PriceSummary
            onProceed={handleProceed}
            proceedLabel="Proceed to Snacks →"
            loading={lockLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;
