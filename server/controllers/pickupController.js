const PickupRequest = require('../models/PickupRequest');

// @desc    Parse spoken sentence to extract pickup fields
// @route   POST /api/pickups/voice-parse
const parseVoicePickup = async (req, res) => {
  try {
    const { speechText } = req.body;
    if (!speechText) {
      return res.status(400).json({ success: false, message: 'Speech text is required' });
    }

    const text = speechText.toLowerCase();

    // 1. Extract Quantity (e.g. "5 kilograms", "5kg", "10 kg", "2.5 kgs", "twenty kg")
    let extractedWeight = 5; // default fallback
    const weightMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:kg|kgs|kilogram|kilograms|kilo|kilos)?/i);
    if (weightMatch && weightMatch[1]) {
      const parsedNum = parseFloat(weightMatch[1]);
      if (!isNaN(parsedNum) && parsedNum > 0) {
        extractedWeight = parsedNum;
      }
    }

    // 2. Extract Waste Type
    let extractedWasteType = 'Mixed Recyclables';
    if (text.includes('plastic') || text.includes('bottle') || text.includes('pet')) {
      extractedWasteType = 'Plastic';
    } else if (text.includes('paper') || text.includes('cardboard') || text.includes('raddi') || text.includes('newspaper') || text.includes('carton')) {
      extractedWasteType = 'Paper / Cardboard';
    } else if (text.includes('e-waste') || text.includes('ewaste') || text.includes('electronic') || text.includes('battery') || text.includes('computer')) {
      extractedWasteType = 'E-Waste';
    } else if (text.includes('metal') || text.includes('iron') || text.includes('can') || text.includes('copper') || text.includes('aluminum')) {
      extractedWasteType = 'Metal';
    } else if (text.includes('glass') || text.includes('jar')) {
      extractedWasteType = 'Glass';
    }

    // 3. Spoken feedback explanation
    const feedback = `Extracted waste type as ${extractedWasteType} and estimated quantity as ${extractedWeight} kilograms. Please review and complete your details before submitting.`;

    res.json({
      success: true,
      originalSpeech: speechText,
      extractedData: {
        wasteType: extractedWasteType,
        estimatedWeight: extractedWeight,
        notes: `Voice request: "${speechText}"`,
      },
      feedback,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new pickup request
// @route   POST /api/pickups
const createPickup = async (req, res) => {
  try {
    const {
      userName,
      phone,
      address,
      city,
      pincode,
      wasteType,
      estimatedWeight,
      preferredDate,
      timeSlot,
      notes,
      assignedServiceName,
    } = req.body;

    const pickup = await PickupRequest.create({
      user: req.user ? req.user._id : null,
      userName: userName || (req.user ? req.user.name : 'Eco Citizen'),
      phone: phone || (req.user ? req.user.phone : '+91 98765 43210'),
      address: address || 'Default Address',
      city: city || 'New Delhi',
      pincode: pincode || '110001',
      wasteType: wasteType || 'Mixed Recyclables',
      estimatedWeight: estimatedWeight ? Number(estimatedWeight) : 5,
      preferredDate: preferredDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      timeSlot: timeSlot || 'Morning (10:00 AM - 01:00 PM)',
      notes: notes || '',
      assignedServiceName: assignedServiceName || 'GreenScrap Kabadiwala Network',
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      data: pickup,
      message: 'Your pickup request has been submitted successfully.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's pickups
// @route   GET /api/pickups/my
const getMyPickups = async (req, res) => {
  try {
    const filter = req.user ? { user: req.user._id } : {};
    const pickups = await PickupRequest.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: pickups.length, data: pickups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all pickups (Admin)
// @route   GET /api/pickups/all
const getAllPickups = async (req, res) => {
  try {
    const pickups = await PickupRequest.find().sort({ createdAt: -1 });
    res.json({ success: true, count: pickups.length, data: pickups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update pickup status (Admin / Partner)
// @route   PATCH /api/pickups/:id/status
const updatePickupStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const pickup = await PickupRequest.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ success: false, message: 'Pickup request not found' });
    }

    pickup.status = status || pickup.status;
    await pickup.save();

    res.json({
      success: true,
      data: pickup,
      message: `Pickup status updated to ${pickup.status}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel pickup request
// @route   DELETE /api/pickups/:id
const cancelPickup = async (req, res) => {
  try {
    const pickup = await PickupRequest.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ success: false, message: 'Pickup request not found' });
    }
    pickup.status = 'Cancelled';
    await pickup.save();
    res.json({ success: true, message: 'Pickup request has been cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  parseVoicePickup,
  createPickup,
  getMyPickups,
  getAllPickups,
  updatePickupStatus,
  cancelPickup,
};
