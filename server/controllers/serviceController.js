const RecyclingService = require('../models/RecyclingService');

// Haversine formula to calculate distance between coordinates in kilometers
const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
};

// Keyword mapping for waste material extraction
const MATERIAL_KEYWORDS = {
  Plastic: ['plastic', 'bottle', 'bottles', 'pet', 'polythene', 'containers', 'cups', 'poly'],
  Paper: ['paper', 'newspaper', 'newspapers', 'cardboard', 'carton', 'books', 'magazines', 'raddi', 'kraft'],
  Metal: ['metal', 'iron', 'steel', 'aluminum', 'can', 'cans', 'copper', 'brass', 'tin', 'loha'],
  'E-Waste': ['e-waste', 'ewaste', 'electronic', 'electronics', 'phone', 'battery', 'laptop', 'charger', 'circuit', 'gadget'],
  Glass: ['glass', 'jar', 'jars', 'bottles', 'mirror', 'silica'],
};

// @desc    Get all recycling services / Kabadiwalas with filtering & real distance calculation
// @route   GET /api/services
const getAllServices = async (req, res) => {
  try {
    const { city, material, query, verified, userLat, userLng } = req.query;
    const filter = {};

    if (city && city !== 'All') {
      filter.city = new RegExp(city, 'i');
    }

    if (verified === 'true') {
      filter.verified = true;
    }

    if (material && material !== 'All') {
      filter.acceptedMaterials = { $in: [new RegExp(material, 'i')] };
    }

    if (query) {
      filter.$or = [
        { name: new RegExp(query, 'i') },
        { address: new RegExp(query, 'i') },
        { city: new RegExp(query, 'i') },
        { description: new RegExp(query, 'i') },
        { acceptedMaterials: { $in: [new RegExp(query, 'i')] } },
      ];
    }

    let services = await RecyclingService.find(filter).sort({ rating: -1 }).lean();

    // If user GPS coordinates provided, calculate real distance to each recycling center
    if (userLat && userLng) {
      const uLat = parseFloat(userLat);
      const uLng = parseFloat(userLng);
      services = services.map((s) => {
        const sLat = s.location?.latitude || 28.6139;
        const sLng = s.location?.longitude || 77.209;
        const dist = calculateDistanceKm(uLat, uLng, sLat, sLng);
        return { ...s, distanceKm: dist };
      });

      // Sort by nearest distance
      services.sort((a, b) => a.distanceKm - b.distanceKm);
    }

    res.json({ success: true, count: services.length, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Search services by spoken phrase (Keyword & Material Extraction)
// @route   POST /api/services/voice-search
const voiceSearchServices = async (req, res) => {
  try {
    const { speechText, userLat, userLng } = req.body;
    if (!speechText) {
      const all = await RecyclingService.find().sort({ rating: -1 }).lean();
      return res.json({ success: true, extractedMaterials: [], count: all.length, data: all });
    }

    const textLower = speechText.toLowerCase();

    // 1. Extract materials matching keywords
    const detectedMaterials = [];
    for (const [matCategory, keywords] of Object.entries(MATERIAL_KEYWORDS)) {
      if (keywords.some((kw) => textLower.includes(kw))) {
        detectedMaterials.push(matCategory);
      }
    }

    // 2. Build search query
    let filter = {};
    if (detectedMaterials.length > 0) {
      const regexPatterns = detectedMaterials.map((m) => new RegExp(m, 'i'));
      filter.acceptedMaterials = { $in: regexPatterns };
    } else {
      const cleanWords = textLower
        .replace(/(find|recycling|center|centres|near|me|service|kabadiwala|i have|want|to)/gi, '')
        .trim();
      if (cleanWords) {
        filter.$or = [
          { name: new RegExp(cleanWords, 'i') },
          { address: new RegExp(cleanWords, 'i') },
          { acceptedMaterials: { $in: [new RegExp(cleanWords, 'i')] } },
        ];
      }
    }

    let matchingServices = await RecyclingService.find(filter).sort({ rating: -1 }).lean();

    // Attach real distance if GPS available
    if (userLat && userLng) {
      const uLat = parseFloat(userLat);
      const uLng = parseFloat(userLng);
      matchingServices = matchingServices.map((s) => {
        const sLat = s.location?.latitude || 28.6139;
        const sLng = s.location?.longitude || 77.209;
        return { ...s, distanceKm: calculateDistanceKm(uLat, uLng, sLat, sLng) };
      });
      matchingServices.sort((a, b) => a.distanceKm - b.distanceKm);
    }

    const spokenSummary =
      matchingServices.length > 0
        ? `Found ${matchingServices.length} verified recycling services matching your request for ${detectedMaterials.join(', ') || 'waste materials'}.`
        : `No direct recycling services found for ${speechText}. Showing verified local partners.`;

    const fallbackList = await RecyclingService.find().limit(6).lean();

    res.json({
      success: true,
      recognizedSpeech: speechText,
      extractedMaterials: detectedMaterials,
      count: matchingServices.length,
      spokenSummary,
      data: matchingServices.length > 0 ? matchingServices : fallbackList,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single recycling service
// @route   GET /api/services/:id
const getServiceById = async (req, res) => {
  try {
    const service = await RecyclingService.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Recycling service not found' });
    }
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new recycling service (Admin)
// @route   POST /api/services
const createService = async (req, res) => {
  try {
    const service = await RecyclingService.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update recycling service (Admin)
// @route   PUT /api/services/:id
const updateService = async (req, res) => {
  try {
    const service = await RecyclingService.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete recycling service (Admin)
// @route   DELETE /api/services/:id
const deleteService = async (req, res) => {
  try {
    const service = await RecyclingService.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    await service.deleteOne();
    res.json({ success: true, message: 'Recycling service deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllServices,
  voiceSearchServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
