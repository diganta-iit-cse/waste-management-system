import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeTrailer } from '../../features/ui/uiSlice';
import { X } from 'lucide-react';

const TrailerModal = () => {
  const dispatch = useDispatch();
  const { isOpen, trailerUrl, title } = useSelector((state) => state.ui.trailerModal);

  if (!isOpen || !trailerUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-cinema-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-cinema-850">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand"></span>
            Trailer: {title}
          </h3>
          <button
            onClick={() => dispatch(closeTrailer())}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={`${trailerUrl}?autoplay=1`}
            title={title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
