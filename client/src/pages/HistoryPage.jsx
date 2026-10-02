import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  History,
  Truck,
  Camera,
  Calendar,
  Clock,
  MapPin,
  Scale,
  CheckCircle,
  AlertCircle,
  Volume2,
  Trash2,
  Tag,
  FileText,
} from 'lucide-react';
import { useVoice } from '../context/VoiceContext';
import TextToSpeech from '../components/TextToSpeech';

const HistoryPage = () => {
  const { speak } = useVoice();
  const [activeTab, setActiveTab] = useState('pickups'); // 'pickups' | 'classifications'
  const [pickups, setPickups] = useState([]);
  const [classifications, setClassifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pickupRes, classRes] = await Promise.all([
        axios.get('/api/pickups/my'),
        axios.get('/api/classifications/my'),
      ]);

      if (pickupRes.data.success) {
        setPickups(pickupRes.data.data);
      }
      if (classRes.data.success) {
        setClassifications(classRes.data.data);
      }
    } catch (err) {
      console.warn('Failed to load history records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteClassification = async (id) => {
    try {
      await axios.delete(`/api/classifications/${id}`);
      setClassifications((prev) => prev.filter((c) => c._id !== id));
    } catch (e) {
      console.error('Delete failed:', e);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-950 text-emerald-400 border-emerald-500/50';
      case 'Scheduled':
        return 'bg-teal-950 text-teal-400 border-teal-500/50';
      case 'In Progress':
        return 'bg-amber-950 text-amber-400 border-amber-500/50';
      case 'Cancelled':
        return 'bg-rose-950 text-rose-400 border-rose-500/50';
      default:
        return 'bg-blue-950 text-blue-400 border-blue-500/50';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold mb-2">
            <History size={14} />
            <span>Activity & Environmental Ledger</span>
          </div>
          <h1 className="text-3xl font-black text-white">Your Circular History</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Track past doorstep pickups and previously classified waste items.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center p-1.5 rounded-2xl bg-gray-900 border border-gray-800">
          <button
            type="button"
            onClick={() => setActiveTab('pickups')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'pickups'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Truck size={16} />
            <span>Pickups ({pickups.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('classifications')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'classifications'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Camera size={16} />
            <span>Classified Items ({classifications.length})</span>
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-400">Loading activity history...</p>
        </div>
      ) : activeTab === 'pickups' ? (
        /* Pickups List */
        <div className="space-y-4">
          {pickups.length > 0 ? (
            pickups.map((pickup) => {
              const spokenPickupInfo = `Pickup for ${pickup.wasteType}, quantity ${pickup.estimatedWeight} kilograms. Status is ${pickup.status}. Scheduled for ${pickup.preferredDate} during ${pickup.timeSlot}. Assigned to ${pickup.assignedServiceName}.`;

              return (
                <div
                  key={pickup._id}
                  className="rounded-2xl bg-gray-900/90 border border-emerald-500/30 hover:border-emerald-500/50 p-6 shadow-xl backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border ${getStatusBadge(
                          pickup.status
                        )}`}
                      >
                        {pickup.status}
                      </span>
                      <span className="text-sm font-bold text-white">{pickup.wasteType}</span>
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <Scale size={13} /> {pickup.estimatedWeight} kg
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} className="text-emerald-400" />
                        {pickup.preferredDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} className="text-teal-400" />
                        {pickup.timeSlot}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={13} className="text-gray-400" />
                        {pickup.address}, {pickup.city}
                      </span>
                    </div>

                    {pickup.notes && (
                      <div className="p-2.5 rounded-xl bg-gray-950/70 border border-gray-800 text-xs text-gray-300 flex items-start gap-2">
                        <FileText size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span>{pickup.notes}</span>
                      </div>
                    )}

                    <div className="text-xs text-gray-400">
                      Partner:{' '}
                      <strong className="text-emerald-300 font-medium">
                        {pickup.assignedServiceName}
                      </strong>
                    </div>
                  </div>

                  {/* Right Side: Audio Status Reader */}
                  <div className="shrink-0 flex items-center gap-2">
                    <TextToSpeech
                      text={spokenPickupInfo}
                      label="Listen to Status"
                      size="sm"
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-16 text-center text-gray-400 bg-gray-900/60 rounded-3xl border border-gray-800 p-8 space-y-2">
              <Truck size={36} className="mx-auto text-emerald-500/50" />
              <p className="font-semibold text-gray-200">No pickups scheduled yet.</p>
              <p className="text-xs">Schedule your first scrap pickup in seconds.</p>
            </div>
          )}
        </div>
      ) : (
        /* Classifications Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classifications.length > 0 ? (
            classifications.map((item) => (
              <div
                key={item._id}
                className="rounded-3xl bg-gray-900/90 border border-emerald-500/30 overflow-hidden shadow-xl backdrop-blur-md flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 w-full relative overflow-hidden bg-gray-950">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-gray-950/90 text-emerald-400 border border-emerald-500/50 backdrop-blur-md">
                        {item.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-950/90 text-white border border-emerald-600/40 backdrop-blur-md">
                        {item.confidence}% Match
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-bold text-white">{item.title}</h3>
                    <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
                      {item.disposalInstructions}
                    </p>

                    {item.notes && (
                      <div className="p-2 rounded-xl bg-gray-950 border border-gray-800 text-xs text-gray-400">
                        <span className="font-semibold text-emerald-400 block mb-0.5">Your Voice Notes:</span>
                        <span>"{item.notes}"</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-gray-800/80 flex items-center justify-between gap-2 mt-2">
                  <TextToSpeech
                    text={`Classification: ${item.title}. Category: ${item.category}. ${item.disposalInstructions} Preparation: ${item.preparation}. Your notes: ${item.notes || 'None'}`}
                    label="Listen"
                    size="sm"
                  />

                  <button
                    type="button"
                    onClick={() => handleDeleteClassification(item._id)}
                    className="p-2 rounded-xl text-gray-500 hover:text-rose-400 hover:bg-gray-800 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-gray-400 bg-gray-900/60 rounded-3xl border border-gray-800 p-8 space-y-2">
              <Camera size={36} className="mx-auto text-emerald-500/50" />
              <p className="font-semibold text-gray-200">No waste classified yet.</p>
              <p className="text-xs">Use the AI Classifier to analyze waste items.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
