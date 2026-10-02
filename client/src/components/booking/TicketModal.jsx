import React from 'react';
import { X, Printer, Download, Film, MapPin, Calendar, Clock, QrCode } from 'lucide-react';

const TicketModal = ({ isOpen, onClose, booking }) => {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const movie = booking.movie || {};
  const theatre = booking.theatre || {};
  const screen = booking.screen || {};
  const show = booking.show || {};
  const seats = booking.seats || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-lg bg-cinema-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Modal Top Actions */}
        <div className="flex items-center justify-between p-4 bg-cinema-850 border-b border-white/10 print:hidden">
          <span className="text-xs uppercase tracking-wider font-bold text-brand">
            Official CineBook M-Ticket
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Boarding Pass Body */}
        <div className="p-6 space-y-6 print:p-2">
          {/* Movie Header */}
          <div className="flex gap-4">
            {movie.posterUrl && (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-20 h-28 object-cover rounded-xl shadow-md border border-white/10 flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-brand/20 text-brand mb-1">
                {movie.certification || 'U/A'} • {show.format || '2D'}
              </span>
              <h2 className="text-xl font-black text-white print:text-black leading-tight">
                {movie.title}
              </h2>
              <p className="text-xs text-gray-400 print:text-gray-600 mt-1">
                {theatre.name}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {theatre.address || theatre.city} • {screen.name}
              </p>
            </div>
          </div>

          {/* Ticket Information Grid */}
          <div className="grid grid-cols-3 gap-2.5 p-4 rounded-2xl bg-cinema-850/80 border border-white/5 print:bg-gray-100 print:text-black">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Date</span>
              <p className="text-xs font-bold text-white print:text-black mt-0.5">{show.date}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Showtime</span>
              <p className="text-xs font-bold text-white print:text-black mt-0.5">{show.startTime}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Auditorium</span>
              <p className="text-xs font-bold text-brand mt-0.5">{screen.name?.split('-')[0] || 'Screen 1'}</p>
            </div>
          </div>

          {/* Seats Callout */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-brand/15 to-cinema-850 border border-brand/30 print:border-gray-300">
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block">
              Seats Confirmed ({seats.length})
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {seats.map((s, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-brand text-white font-extrabold text-sm shadow-md"
                >
                  {s.seatId || `${s.row}${s.number}`}
                </span>
              ))}
            </div>
          </div>

          {/* Perforated Divider */}
          <div className="relative flex items-center justify-between my-2">
            <div className="w-5 h-5 rounded-full bg-cinema-950 -ml-8.5 border-r border-white/10 print:hidden"></div>
            <div className="w-full border-t-2 border-dashed border-white/15 mx-2"></div>
            <div className="w-5 h-5 rounded-full bg-cinema-950 -mr-8.5 border-l border-white/10 print:hidden"></div>
          </div>

          {/* QR Code and Barcode Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                Booking Reference
              </span>
              <span className="text-lg font-black tracking-widest text-brand font-mono">
                {booking.bookingId}
              </span>
              <span className="text-xs text-gray-400 mt-1">
                Total Paid: <strong className="text-white print:text-black">₹{booking.totalAmount}</strong>
              </span>
              <span className="text-[10px] text-gray-500 mt-1">
                Show this QR Code at the cinema entrance for scan & entry.
              </span>
            </div>

            {/* QR Code */}
            <div className="p-2 bg-white rounded-2xl shadow-lg border border-gray-200 flex-shrink-0">
              {booking.qrCode ? (
                <img
                  src={booking.qrCode}
                  alt={`QR ${booking.bookingId}`}
                  className="w-28 h-28 object-contain"
                />
              ) : (
                <div className="w-28 h-28 flex flex-col items-center justify-center text-gray-400 text-xs">
                  <QrCode className="w-8 h-8 text-black" />
                  <span className="text-[10px] font-mono mt-1 text-black font-bold">
                    {booking.bookingId}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;
