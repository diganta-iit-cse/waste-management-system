import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Camera,
  Upload,
  Sparkles,
  Volume2,
  Mic,
  CheckCircle,
  Truck,
  RotateCcw,
  Save,
  Tag,
  Leaf,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useVoice } from '../context/VoiceContext';
import { useAuth } from '../context/AuthContext';
import VoiceInput from '../components/VoiceInput';
import TextToSpeech from '../components/TextToSpeech';

const PRESET_SAMPLES = [
  {
    id: 'plastic-bottle',
    name: 'Plastic Water Bottle',
    category: 'Recyclable',
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    query: 'plastic bottle pet',
  },
  {
    id: 'cardboard-box',
    name: 'Cardboard Box',
    category: 'Paper',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
    query: 'cardboard box kraft paper',
  },
  {
    id: 'smartphone-battery',
    name: 'Smartphone & Battery',
    category: 'E-Waste',
    image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80',
    query: 'smartphone battery e-waste lithium',
  },
  {
    id: 'banana-peel',
    name: 'Fruit Peels / Organic',
    category: 'Organic',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
    query: 'banana peel food organic fruit',
  },
  {
    id: 'aluminum-can',
    name: 'Aluminum Beverage Can',
    category: 'Metal',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    query: 'aluminum can soda beverage',
  },
  {
    id: 'glass-jar',
    name: 'Glass Container Jar',
    category: 'Glass',
    image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80',
    query: 'glass jar silica container',
  },
  {
    id: 'medicine-blister',
    name: 'Pharma Blister Pack',
    category: 'Hazardous',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    query: 'medicine blister pills hazardous',
  },
];

const ClassifyPage = () => {
  const navigate = useNavigate();
  const { speak, speakFeedback } = useVoice();
  const { user } = useAuth();

  const [selectedImage, setSelectedImage] = useState(PRESET_SAMPLES[0].image);
  const [selectedName, setSelectedName] = useState(PRESET_SAMPLES[0].name);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [classificationResult, setClassificationResult] = useState(null);
  const [spokenNotes, setSpokenNotes] = useState('');
  const [saveStatus, setSaveStatus] = useState('');

  // Perform AI Classification
  const runClassification = async (payload) => {
    setIsAnalyzing(true);
    setClassificationResult(null);
    setSaveStatus('');

    try {
      const res = await axios.post('/api/classifications/ai-classify', payload);
      if (res.data.success) {
        const data = res.data.data;
        setClassificationResult(data);

        // Requirement #54: Voice feedback after successful classification
        speakFeedback(`Your waste has been identified as ${data.category.toLowerCase()}.`);
      }
    } catch (err) {
      console.error('Classification error:', err);
      speakFeedback('Sorry, something went wrong. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Trigger classification for sample
  const handleSelectSample = (sample) => {
    setSelectedImage(sample.image);
    setSelectedName(sample.name);
    runClassification({
      query: sample.query,
      sampleKey: sample.id,
      imageUrl: sample.image,
      fileName: sample.name,
    });
  };

  // Handle local file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
        setSelectedName(file.name);
        runClassification({
          query: file.name,
          imageUrl: reader.result,
          fileName: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Save to History (with spoken notes)
  const handleSaveToHistory = async () => {
    if (!classificationResult) return;
    try {
      setSaveStatus('Saving...');
      const res = await axios.post('/api/classifications', {
        ...classificationResult,
        notes: spokenNotes,
        imageUrl: selectedImage,
      });

      if (res.data.success) {
        setSaveStatus('Saved to History!');
        speakFeedback('Classification has been saved to your history.');
        setTimeout(() => setSaveStatus(''), 3500);
      }
    } catch (err) {
      console.error('Save error:', err);
      setSaveStatus('Error saving');
    }
  };

  // Requirement #46 format:
  // "Waste identified: Plastic Bottle. Category: Recyclable. Confidence: 94 percent. Material: PET plastic. Disposal method: Place the bottle in a dry recyclable waste collection container. Preparation: Empty and rinse the bottle before disposal."
  const detailedAudioResult = classificationResult
    ? `Waste identified: ${classificationResult.title}. Category: ${classificationResult.category}. Confidence: ${classificationResult.confidence} percent. Material: ${classificationResult.material}. Disposal method: ${classificationResult.disposalInstructions} Preparation: ${classificationResult.preparation}`
    : '';

  // Requirement #61: Explain Result
  const explainResultText = classificationResult
    ? `This image appears to contain a ${classificationResult.title}. It has been classified as ${classificationResult.category} with a confidence of ${classificationResult.confidence} percent. ${classificationResult.preparation} ${classificationResult.disposalInstructions}`
    : '';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
          <Sparkles size={15} />
          <span>AI Computer Vision + Regional Voice Synthesis</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">AI Waste Identification & Segregation</h1>
        <p className="text-sm sm:text-base text-gray-400">
          Upload a photo or choose a sample to identify waste material, listen to step-by-step disposal instructions, and add voice notes.
        </p>
      </div>

      {/* Preset Samples Picker */}
      <div className="bg-gray-900/80 border border-emerald-500/30 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
          Select Preset Test Samples or Upload Custom Photo:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {PRESET_SAMPLES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className={`p-2 rounded-xl text-left border transition-all flex flex-col items-center text-center gap-2 ${
                selectedName === sample.name
                  ? 'bg-emerald-950/90 border-emerald-400 ring-2 ring-emerald-400/50 scale-105'
                  : 'bg-gray-950/70 border-gray-800 hover:border-gray-700 text-gray-300'
              }`}
            >
              <img
                src={sample.image}
                alt={sample.name}
                className="w-14 h-14 rounded-lg object-cover shadow-sm"
              />
              <span className="text-[11px] font-semibold text-gray-200 line-clamp-1">{sample.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Classifier Workflow Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Upload & Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gray-900/90 border border-emerald-500/30 rounded-3xl p-5 shadow-2xl backdrop-blur-md space-y-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-950 border border-gray-800 flex items-center justify-center">
              <img
                src={selectedImage}
                alt={selectedName}
                className={`w-full h-full object-cover transition-all duration-300 ${
                  isAnalyzing ? 'scale-105 blur-sm opacity-60' : ''
                }`}
              />

              {/* Scanning Animation Overlay */}
              {isAnalyzing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/80 backdrop-blur-sm z-20">
                  <div className="w-16 h-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mb-3" />
                  <span className="text-emerald-400 font-bold text-sm animate-pulse">
                    AI Analyzing Material...
                  </span>
                  <div className="w-3/4 h-1.5 bg-gray-800 rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-emerald-500 animate-pulse w-2/3 rounded-full" />
                  </div>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <div className="flex gap-2">
              <label className="flex-1 cursor-pointer py-3 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold text-sm flex items-center justify-center gap-2 border border-gray-700 transition-colors">
                <Upload size={17} />
                <span>Upload New Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() =>
                  runClassification({
                    query: selectedName,
                    imageUrl: selectedImage,
                    fileName: selectedName,
                  })
                }
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5"
              >
                <Sparkles size={17} />
                <span>Analyze</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Result & Audio Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {classificationResult ? (
            <div className="bg-gray-900/95 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6 animate-in fade-in duration-300">
              {/* Result Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-gray-800">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        classificationResult.category === 'Recyclable' ||
                        classificationResult.category === 'Paper' ||
                        classificationResult.category === 'Metal' ||
                        classificationResult.category === 'Glass'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50'
                          : classificationResult.category === 'Organic'
                          ? 'bg-teal-950 text-teal-400 border border-teal-500/50'
                          : 'bg-rose-950 text-rose-400 border border-rose-500/50'
                      }`}
                    >
                      {classificationResult.category}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      Confidence: <strong className="text-emerald-400 font-bold">{classificationResult.confidence}%</strong>
                    </span>
                    {classificationResult.imageMeta && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-800/90 text-emerald-300 font-mono border border-emerald-500/20">
                        {classificationResult.imageMeta.format} • {classificationResult.imageMeta.fileSizeKb} KB
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-black text-white">{classificationResult.title}</h2>
                  <p className="text-xs text-emerald-300/80 font-medium mt-0.5">
                    Material: {classificationResult.material}
                  </p>
                </div>

                {/* Requirement #61: 🔊 Explain Result */}
                <div className="shrink-0">
                  <TextToSpeech
                    text={explainResultText}
                    label="Explain Result"
                    size="md"
                    className="shadow-lg"
                  />
                </div>
              </div>

              {/* Requirement #46: Full Audio Player (Speak, Pause, Resume, Stop) */}
              <div className="p-4 rounded-2xl bg-gray-950/80 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Volume2 size={15} />
                    <span>🔊 Listen to Complete Result</span>
                  </span>
                  <span className="text-[11px] text-gray-400">Audio playback controls</span>
                </div>
                {/* Full Audio Controls component */}
                <TextToSpeech
                  text={detailedAudioResult}
                  label="Listen to Result"
                  showControls={true}
                  className="w-full justify-start"
                />
              </div>

              {/* Material & Segregation Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gray-950/60 border border-gray-800 space-y-1">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle size={14} /> How to Dispose
                  </span>
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                    {classificationResult.disposalInstructions}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-950/60 border border-gray-800 space-y-1">
                  <span className="text-xs font-bold text-teal-400 flex items-center gap-1">
                    <Leaf size={14} /> Preparation Steps
                  </span>
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                    {classificationResult.preparation}
                  </p>
                </div>
              </div>

              {/* Bin Color & Eco Impact Banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-600/30 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-300">Bin Destination:</span>
                  <span className="font-bold text-emerald-300 px-2.5 py-1 rounded-lg bg-emerald-900/80 border border-emerald-500/50">
                    {classificationResult.binColor}
                  </span>
                </div>
                <div className="text-gray-300">
                  <span className="text-emerald-400 font-bold">+{classificationResult.ecoPoints}</span> Eco-Credits •{' '}
                  <span className="text-emerald-400 font-bold">{classificationResult.co2SavedKg} kg</span> CO₂ avoided
                </div>
              </div>

              {/* Requirement #43: Spoken Notes via 🎤 VoiceInput */}
              <div className="p-4 rounded-2xl bg-gray-950/80 border border-gray-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                    <Mic size={14} className="text-emerald-400" />
                    <span>Classification Notes (Spoken or Typed)</span>
                  </label>
                  <span className="text-[11px] text-gray-400">Speak into mic to add notes</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={spokenNotes}
                    onChange={(e) => setSpokenNotes(e.target.value)}
                    placeholder='e.g. "Collected 20 bottles from office party"'
                    className="flex-1 px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  {/* Reusable VoiceInput for notes */}
                  <VoiceInput
                    onTranscript={(text) => setSpokenNotes(text)}
                    value={spokenNotes}
                    append={true}
                    continuous={true}
                    label="Speak Notes"
                    size="md"
                  />
                </div>
              </div>

              {/* Action Buttons: Save to History, Find Kabadiwala, Book Pickup */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSaveToHistory}
                  className="py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
                >
                  <Save size={16} />
                  <span>{saveStatus || 'Save to History'}</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/services?query=${encodeURIComponent(
                        classificationResult.category.toLowerCase()
                      )}`
                    )
                  }
                  className="py-3 px-5 rounded-xl bg-gray-800 hover:bg-gray-700 text-emerald-300 font-semibold text-sm border border-emerald-500/30 transition-colors flex items-center gap-2"
                >
                  <Truck size={16} />
                  <span>Find Kabadiwala</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/pickup?wasteType=${encodeURIComponent(
                        classificationResult.category
                      )}&notes=${encodeURIComponent(
                        `Classified ${classificationResult.title}. ${spokenNotes}`
                      )}`
                    )
                  }
                  className="py-3 px-5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold text-sm border border-gray-700 transition-colors flex items-center gap-1.5"
                >
                  <span>Schedule Pickup</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-12 text-center text-gray-400 flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-950 flex items-center justify-center text-emerald-500/50">
                <Camera size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-200">No Image Classified Yet</h3>
              <p className="text-xs sm:text-sm max-w-sm">
                Pick a sample from the gallery above or click "Analyze" to run AI identification with voice reading.
              </p>
              <button
                type="button"
                onClick={() => handleSelectSample(PRESET_SAMPLES[0])}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all"
              >
                Analyze Plastic Bottle Sample
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassifyPage;
