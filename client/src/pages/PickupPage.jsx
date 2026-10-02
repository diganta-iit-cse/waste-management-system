import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {
  Truck,
  Mic,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Scale,
  FileText,
  CheckCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useVoice } from '../context/VoiceContext';
import { useAuth } from '../context/AuthContext';
import VoiceInput from '../components/VoiceInput';
import TextToSpeech from '../components/TextToSpeech';

const WASTE_TYPES = [
  'Mixed Recyclables',
  'Plastic',
  'Paper / Cardboard',
  'E-Waste',
  'Metal',
  'Glass',
];

const TIME_SLOTS = [
  'Morning (10:00 AM - 01:00 PM)',
  'Afternoon (02:00 PM - 05:00 PM)',
  'Evening (05:00 PM - 08:00 PM)',
];

const PickupPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { speak, speakFeedback } = useVoice();
  const { user } = useAuth();

  // Form Fields
  const [formData, setFormData] = useState({
    userName: user?.name || 'Rahul Sharma',
    phone: user?.phone || '+91 98765 43210',
    address: user?.address || 'B-42 Green Park Extension',
    city: user?.city || 'New Delhi',
    pincode: '110016',
    wasteType: searchParams.get('wasteType') || 'Plastic',
    estimatedWeight: 5,
    preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    timeSlot: TIME_SLOTS[0],
    notes: searchParams.get('notes') || '',
    assignedServiceName: searchParams.get('service') || 'GreenScrap Doorstep Kabadiwala',
  });

  // Voice Smart Fill States (Requirement #63)
  const [voiceQuickSpeech, setVoiceQuickSpeech] = useState('');
  const [voiceExtractionStatus, setVoiceExtractionStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Requirement #63: Natural voice parse into pickup form
  const handleVoiceQuickFill = async (spokenSentence) => {
    if (!spokenSentence) return;
    setVoiceQuickSpeech(spokenSentence);
    setVoiceExtractionStatus('Analyzing speech with AI parser...');

    try {
      const res = await axios.post('/api/pickups/voice-parse', {
        speechText: spokenSentence,
      });

      if (res.data.success) {
        const { wasteType, estimatedWeight, notes } = res.data.extractedData;
        setFormData((prev) => ({
          ...prev,
          wasteType: wasteType || prev.wasteType,
          estimatedWeight: estimatedWeight || prev.estimatedWeight,
          notes: notes || prev.notes,
        }));

        setVoiceExtractionStatus(`Extracted: ${wasteType} • ${estimatedWeight} kg`);
        speakFeedback(res.data.feedback);
      }
    } catch (err) {
      console.warn('Backend parse failed, using client fallback:', err);
      // Client-side fallback keyword extraction
      const text = spokenSentence.toLowerCase();
      let extractedType = 'Mixed Recyclables';
      if (text.includes('plastic')) extractedType = 'Plastic';
      else if (text.includes('paper') || text.includes('cardboard') || text.includes('raddi')) extractedType = 'Paper / Cardboard';
      else if (text.includes('e-waste') || text.includes('electronic') || text.includes('battery')) extractedType = 'E-Waste';
      else if (text.includes('metal') || text.includes('iron') || text.includes('can')) extractedType = 'Metal';

      const weightMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:kg|kgs|kilogram|kilograms)?/i);
      const extractedWeight = weightMatch ? parseFloat(weightMatch[1]) : 5;

      setFormData((prev) => ({
        ...prev,
        wasteType: extractedType,
        estimatedWeight: extractedWeight,
        notes: `Voice request: "${spokenSentence}"`,
      }));

      const feedback = `Extracted waste type as ${extractedType} and estimated quantity as ${extractedWeight} kilograms. Please review and edit before submitting.`;
      setVoiceExtractionStatus(`Extracted: ${extractedType} • ${extractedWeight} kg`);
      speakFeedback(feedback);
    }
  };

  const handleInputChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  // Requirement #63 & #54: Never auto-submit; user reviews and manually clicks
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await axios.post('/api/pickups', formData);
      if (res.data.success) {
        setSubmitSuccess(true);
        // Requirement #54: Voice feedback
        speakFeedback('Your pickup request has been submitted successfully.');

        setTimeout(() => {
          navigate('/history');
        }, 1800);
      }
    } catch (err) {
      console.error('Pickup submission failed:', err);
      speakFeedback('Sorry, something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
          <Truck size={15} />
          <span>Doorstep Digital Weighing & Instant Cash/UPI Settlement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Schedule Doorstep Scrap Pickup</h1>
        <p className="text-sm sm:text-base text-gray-400">
          Speak to fill any field or speak your whole request at once. Review and edit before clicking submit.
        </p>
      </div>

      {/* Requirement #63: Smart Voice Quick Fill Section */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/60 via-gray-900 to-gray-900 border border-emerald-500/40 shadow-2xl backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles size={18} className="text-emerald-400" />
              Voice Quick-Fill (Smart Autofill)
            </h3>
            <p className="text-xs text-gray-300">
              Speak a full sentence, e.g. <em>"I want to schedule a pickup for 5 kilograms of plastic bottles."</em>
            </p>
          </div>
          <span className="text-[11px] font-semibold text-emerald-400/90 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-600/40">
            Rule: Review before submit
          </span>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-2xl bg-gray-950 border border-emerald-500/30">
          <input
            type="text"
            placeholder='Click mic and say: "I want to schedule a pickup for 5 kilograms of plastic bottles"'
            value={voiceQuickSpeech}
            onChange={(e) => setVoiceQuickSpeech(e.target.value)}
            className="flex-1 px-4 py-2 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
          />
          <VoiceInput
            onTranscript={(text) => handleVoiceQuickFill(text)}
            size="md"
            label="Speak Pickup Details"
          />
          <button
            type="button"
            onClick={() => handleVoiceQuickFill(voiceQuickSpeech)}
            disabled={!voiceQuickSpeech.trim()}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-semibold text-xs transition-all"
          >
            Extract
          </button>
        </div>

        {voiceExtractionStatus && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-xs text-emerald-200 flex items-center gap-2 animate-in fade-in">
            <CheckCircle size={15} className="text-emerald-400 shrink-0" />
            <span className="font-medium">{voiceExtractionStatus}</span>
          </div>
        )}
      </div>

      {/* Main Pickup Form with individual 🎤 buttons on all text fields (Requirement #50) */}
      <form onSubmit={handleSubmit} className="bg-gray-900/95 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
        <h2 className="text-xl font-bold text-white pb-3 border-b border-gray-800 flex items-center justify-between">
          <span>Pickup Request Details</span>
          <span className="text-xs font-normal text-gray-400">All fields editable</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Name with 🎤 */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User size={14} className="text-emerald-400" /> Full Name
              </span>
              <span className="text-[11px] text-gray-500">or Speak</span>
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                required
                value={formData.userName}
                onChange={(e) => handleInputChange('userName', e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 pr-12 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <div className="absolute right-2">
                <VoiceInput
                  onTranscript={(txt) => handleInputChange('userName', txt)}
                  size="sm"
                  label="Speak Name"
                />
              </div>
            </div>
          </div>

          {/* 2. Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
              <Phone size={14} className="text-emerald-400" /> Contact Phone
            </label>
            <div className="relative flex items-center">
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          </div>

          {/* 3. Address with 🎤 (Continuous speech support as per requirement #50) */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-emerald-400" /> Pickup Address (House / Flat / Street)
              </span>
              <span className="text-[11px] text-emerald-400">🎤 Continuous Voice Enabled</span>
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="e.g. Flat 302, Palm Meadows, Whitefield"
                className="w-full px-4 py-3 pr-12 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <div className="absolute right-2">
                <VoiceInput
                  onTranscript={(txt) => handleInputChange('address', txt)}
                  value={formData.address}
                  append={true}
                  continuous={true}
                  size="sm"
                  label="Speak Address"
                />
              </div>
            </div>
          </div>

          {/* 4. City and Pincode */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300">City</label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300">Pincode</label>
            <input
              type="text"
              required
              value={formData.pincode}
              onChange={(e) => handleInputChange('pincode', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          {/* 5. Waste Type with 🎤 */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center justify-between">
              <span>Primary Waste Material</span>
              <span className="text-[11px] text-gray-400">or Speak</span>
            </label>
            <div className="relative flex items-center gap-2">
              <select
                value={formData.wasteType}
                onChange={(e) => handleInputChange('wasteType', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                {WASTE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="shrink-0">
                <VoiceInput
                  onTranscript={(txt) => {
                    const matched = WASTE_TYPES.find((w) =>
                      txt.toLowerCase().includes(w.toLowerCase().split(' ')[0])
                    );
                    if (matched) handleInputChange('wasteType', matched);
                  }}
                  size="sm"
                  label="Speak Material"
                />
              </div>
            </div>
          </div>

          {/* 6. Estimated Quantity with 🎤 */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Scale size={14} className="text-emerald-400" /> Estimated Quantity (kg)
              </span>
              <span className="text-[11px] text-gray-400">or Speak</span>
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                min="1"
                step="0.5"
                required
                value={formData.estimatedWeight}
                onChange={(e) => handleInputChange('estimatedWeight', parseFloat(e.target.value) || 1)}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <div className="absolute right-2">
                <VoiceInput
                  onTranscript={(txt) => {
                    const num = parseFloat(txt.replace(/[^\d.]/g, ''));
                    if (!isNaN(num) && num > 0) handleInputChange('estimatedWeight', num);
                  }}
                  size="sm"
                  label="Speak Quantity"
                />
              </div>
            </div>
          </div>

          {/* 7. Preferred Date & Time Slot */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
              <Calendar size={14} className="text-emerald-400" /> Preferred Date
            </label>
            <input
              type="date"
              required
              value={formData.preferredDate}
              onChange={(e) => handleInputChange('preferredDate', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
              <Clock size={14} className="text-emerald-400" /> Preferred Time Slot
            </label>
            <select
              value={formData.timeSlot}
              onChange={(e) => handleInputChange('timeSlot', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          {/* 8. Additional Notes with 🎤 (Continuous speech support as per requirement #50) */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText size={14} className="text-emerald-400" /> Additional Notes & Instructions
              </span>
              <span className="text-[11px] text-emerald-400">🎤 Continuous Voice Dictation</span>
            </label>
            <div className="relative">
              <textarea
                rows="3"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="e.g. Stacked neatly in garage; please bring change for ₹500 or UPI QR scanner."
                className="w-full p-4 pr-12 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <div className="absolute right-3 top-3">
                <VoiceInput
                  onTranscript={(txt) => handleInputChange('notes', txt)}
                  value={formData.notes}
                  append={true}
                  continuous={true}
                  size="sm"
                  label="Dictate Notes"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Kabadiwala */}
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-600/30 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
            <span className="text-gray-300">
              Assigned Partner:{' '}
              <strong className="text-emerald-300 font-bold">{formData.assignedServiceName}</strong>
            </span>
          </div>
          <span className="text-gray-400 text-xs hidden sm:inline">Certified Weighing Scale Partner</span>
        </div>

        {/* Review Note & Submit Button (Requirement #63: Never auto-submit, user clicks) */}
        <div className="pt-4 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-gray-400">
            Please review the details above. Clicking submit confirms your doorstep booking.
          </div>

          <button
            type="submit"
            disabled={isSubmitting || submitSuccess}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-base shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Scheduling...</span>
              </>
            ) : submitSuccess ? (
              <>
                <CheckCircle size={20} className="text-emerald-300" />
                <span>Pickup Request Submitted!</span>
              </>
            ) : (
              <>
                <Truck size={20} />
                <span>Submit Pickup Request</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PickupPage;
