import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ShieldCheck,
  Truck,
  Users,
  Camera,
  CheckCircle,
  AlertCircle,
  Clock,
  Volume2,
  Plus,
  Edit,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { useVoice } from '../context/VoiceContext';
import TextToSpeech from '../components/TextToSpeech';

const AdminDashboardPage = () => {
  const { speak } = useVoice();
  const [metrics, setMetrics] = useState({
    totalUsers: 2,
    totalPickups: 3,
    totalServices: 6,
    totalClassifications: 25,
    pendingPickups: 1,
  });
  const [pickups, setPickups] = useState([]);
  const [spokenAdminSummary, setSpokenAdminSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusUpdateMessage, setStatusUpdateMessage] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [dashRes, pickupsRes] = await Promise.all([
        axios.get('/api/dashboard/admin'),
        axios.get('/api/pickups/all'),
      ]);

      if (dashRes.data.success) {
        setMetrics(dashRes.data.data.metrics);
        setSpokenAdminSummary(dashRes.data.data.spokenAdminSummary);
      }
      if (pickupsRes.data.success) {
        setPickups(pickupsRes.data.data);
      }
    } catch (err) {
      console.warn('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleStatusChange = async (pickupId, newStatus) => {
    try {
      const res = await axios.patch(`/api/pickups/${pickupId}/status`, { status: newStatus });
      if (res.data.success) {
        setPickups((prev) =>
          prev.map((p) => (p._id === pickupId ? { ...p, status: newStatus } : p))
        );
        setStatusUpdateMessage(`Status updated to ${newStatus}`);
        setTimeout(() => setStatusUpdateMessage(''), 3000);
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gray-900/90 border border-amber-500/30 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950 text-amber-400 text-xs font-semibold mb-2 border border-amber-500/40">
            <ShieldCheck size={14} />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">WasteWise Operations HQ</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Dispatch doorstep pickups, oversee Kabadiwala partner compliance, and monitor circular waste flow.
          </p>
        </div>

        {/* Spoken Admin Summary Button */}
        {spokenAdminSummary && (
          <div className="shrink-0">
            <TextToSpeech
              text={spokenAdminSummary}
              label="Read Admin Summary"
              size="md"
              className="bg-amber-950/80 hover:bg-amber-900 text-amber-300 border-amber-600/50"
            />
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <Truck size={22} />
            <span className="text-xs font-semibold">Total Requests</span>
          </div>
          <div className="text-3xl font-black text-white">{metrics.totalPickups}</div>
          <div className="text-xs text-gray-400 mt-1">
            {metrics.pendingPickups} pending dispatch
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800">
          <div className="flex items-center justify-between text-teal-400 mb-2">
            <Camera size={22} />
            <span className="text-xs font-semibold">Classifications</span>
          </div>
          <div className="text-3xl font-black text-white">{metrics.totalClassifications}</div>
          <div className="text-xs text-gray-400 mt-1">AI items logged</div>
        </div>

        <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <ShieldCheck size={22} />
            <span className="text-xs font-semibold">Recycling Hubs</span>
          </div>
          <div className="text-3xl font-black text-white">{metrics.totalServices}</div>
          <div className="text-xs text-gray-400 mt-1">Verified Kabadiwalas</div>
        </div>

        <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800">
          <div className="flex items-center justify-between text-cyan-400 mb-2">
            <Users size={22} />
            <span className="text-xs font-semibold">Registered Users</span>
          </div>
          <div className="text-3xl font-black text-white">{metrics.totalUsers}</div>
          <div className="text-xs text-gray-400 mt-1">Eco Citizens</div>
        </div>
      </div>

      {/* Status update alert */}
      {statusUpdateMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-xs sm:text-sm text-emerald-200 flex items-center gap-2 animate-in fade-in">
          <CheckCircle size={16} className="text-emerald-400" />
          <span>{statusUpdateMessage}</span>
        </div>
      )}

      {/* Pickup Requests Dispatch Table */}
      <div className="rounded-3xl bg-gray-900/90 border border-emerald-500/30 overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Doorstep Pickup Dispatch Desk</h2>
            <p className="text-xs text-gray-400">Update request status as Kabadiwala collects scrap</p>
          </div>
          <span className="text-xs text-emerald-400 font-bold bg-emerald-950 px-3 py-1 rounded-full border border-emerald-600/40">
            Live Stream
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-gray-300">
            <thead className="bg-gray-950/80 text-[11px] uppercase tracking-wider text-gray-400 border-b border-gray-800">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Waste Type & Qty</th>
                <th className="p-4">Address</th>
                <th className="p-4">Date & Slot</th>
                <th className="p-4">Partner</th>
                <th className="p-4">Status Dispatch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {pickups.map((p) => (
                <tr key={p._id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-white">{p.userName}</div>
                    <div className="text-xs text-gray-400">{p.phone}</div>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-emerald-400">{p.wasteType}</span>
                    <div className="text-xs text-gray-400">{p.estimatedWeight} kg</div>
                  </td>
                  <td className="p-4 max-w-xs">
                    <div className="truncate">{p.address}</div>
                    <div className="text-xs text-gray-400">{p.city}</div>
                  </td>
                  <td className="p-4">
                    <div>{p.preferredDate}</div>
                    <div className="text-xs text-gray-400">{p.timeSlot}</div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs text-teal-300">{p.assignedServiceName}</span>
                  </td>
                  <td className="p-4">
                    <select
                      value={p.status}
                      onChange={(e) => handleStatusChange(p._id, e.target.value)}
                      className={`text-xs font-bold py-1.5 px-3 rounded-xl border focus:outline-none ${
                        p.status === 'Completed'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-500/50'
                          : p.status === 'In Progress'
                          ? 'bg-amber-950 text-amber-400 border-amber-500/50'
                          : p.status === 'Cancelled'
                          ? 'bg-rose-950 text-rose-400 border-rose-500/50'
                          : 'bg-blue-950 text-blue-400 border-blue-500/50'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
