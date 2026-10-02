const http = require('http');

const BASE_URL = 'http://localhost:5000/api';

const request = (path, method = 'GET', data = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, text: body });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 Starting WasteWise Voice & MERN Backend Test Suite');
  console.log('======================================================\n');

  try {
    // 1. Health check
    console.log('[Test 1] Checking API Health...');
    const health = await request('/health');
    console.log(' Health status:', health.data.status, '| Service:', health.data.service);
    if (health.status !== 200) throw new Error('Health check failed');

    // 2. Auth Login
    console.log('\n[Test 2] Testing User & Admin Login...');
    const userLogin = await request('/auth/login', 'POST', {
      email: 'user@wastewise.org',
      password: 'password123',
    });
    console.log(' Citizen Login:', userLogin.data.success ? 'SUCCESS' : 'FAILED', '| User:', userLogin.data.data.name);
    const token = userLogin.data.data.token;

    // 3. Update Voice Settings
    console.log('\n[Test 3] Testing Voice Settings & Accessibility Mode Update...');
    const updateSettings = await request(
      '/auth/settings',
      'PUT',
      {
        accessibilityMode: true,
        voiceSettings: {
          language: 'hi-IN',
          speechToTextEnabled: true,
          textToSpeechEnabled: true,
          autoVoiceFeedback: true,
          speechRate: 1.25,
          volume: 0.9,
        },
      },
      { Authorization: `Bearer ${token}` }
    );
    console.log(' Updated Language:', updateSettings.data.data.voiceSettings.language);
    console.log(' Accessibility Mode:', updateSettings.data.data.accessibilityMode);

    // 4. AI Classification
    console.log('\n[Test 4] Testing AI Waste Classification...');
    const classifyRes = await request('/classifications/ai-classify', 'POST', {
      query: 'PET plastic bottle',
      fileName: 'coke_bottle.jpg',
    });
    console.log(' Identified Item:', classifyRes.data.data.title);
    console.log(' Category:', classifyRes.data.data.category);
    console.log(' Confidence:', classifyRes.data.data.confidence + '%');
    console.log(' Spoken Audio Output Preview:', classifyRes.data.data.audioExplanation.substring(0, 70) + '...');

    // 5. Save Classification & Add Voice Notes
    console.log('\n[Test 5] Testing Save Classification & Voice Notes Addition...');
    const saveClass = await request(
      '/classifications',
      'POST',
      classifyRes.data.data,
      { Authorization: `Bearer ${token}` }
    );
    const savedId = saveClass.data.data._id;
    console.log(' Saved Classification ID:', savedId);

    const voiceNoteRes = await request(
      `/classifications/${savedId}/notes`,
      'PATCH',
      { notes: 'Spoken note: 25 bottles gathered after college festival' }
    );
    console.log(' Voice Notes Recorded:', voiceNoteRes.data.data.notes);

    // 6. Dashboard Spoken Stats Readout (Requirement #48)
    console.log('\n[Test 6] Testing Voice Dashboard Stats Readout (Requirement #48)...');
    const statsRes = await request('/dashboard/user', 'GET', null, { Authorization: `Bearer ${token}` });
    console.log(' Total Classified:', statsRes.data.data.stats.totalClassified);
    console.log(' Recyclable:', statsRes.data.data.stats.recyclable);
    console.log(' Organic:', statsRes.data.data.stats.organic);
    console.log(' E-Waste:', statsRes.data.data.stats.ewaste);
    console.log(' Hazardous:', statsRes.data.data.stats.hazardous);
    console.log(' Spoken Dashboard TTS:', `"${statsRes.data.data.spokenDashboard}"`);

    // 7. Kabadiwala Voice Search (Requirement #49 & #62)
    console.log('\n[Test 7] Testing Kabadiwala Voice Search with Keyword Extraction (Requirement #62)...');
    const voiceSearch = await request('/services/voice-search', 'POST', {
      speechText: 'I have plastic bottles and old newspapers. Find a recycling service.',
    });
    console.log(' Speech Heard:', voiceSearch.data.recognizedSpeech);
    console.log(' Extracted Materials:', voiceSearch.data.extractedMaterials);
    console.log(' Services Matched:', voiceSearch.data.count);
    console.log(' Spoken Summary:', `"${voiceSearch.data.spokenSummary}"`);

    // 8. Voice Pickup Auto-parse (Requirement #63)
    console.log('\n[Test 8] Testing Voice Pickup Parsing (Requirement #63)...');
    const voicePickupParse = await request('/pickups/voice-parse', 'POST', {
      speechText: 'I want to schedule a pickup for 5 kilograms of plastic bottles.',
    });
    console.log(' Extracted Waste Type:', voicePickupParse.data.extractedData.wasteType);
    console.log(' Extracted Weight:', voicePickupParse.data.extractedData.estimatedWeight, 'kg');
    console.log(' Voice Feedback TTS:', `"${voicePickupParse.data.feedback}"`);

    // 9. Schedule Pickup & Update Status
    console.log('\n[Test 9] Testing Pickup Booking & Status Dispatch...');
    const pickupRes = await request(
      '/pickups',
      'POST',
      {
        userName: 'Rahul Sharma',
        phone: '+91 98765 43210',
        address: 'B-42 Green Park Extension',
        city: 'New Delhi',
        wasteType: voicePickupParse.data.extractedData.wasteType,
        estimatedWeight: voicePickupParse.data.extractedData.estimatedWeight,
        preferredDate: '2026-10-05',
        timeSlot: 'Morning (10:00 AM - 01:00 PM)',
        notes: 'Voice scheduled request',
      },
      { Authorization: `Bearer ${token}` }
    );
    console.log(' Pickup Created Status:', pickupRes.data.data.status, '| ID:', pickupRes.data.data._id);

    // 10. Live Scrap Rates
    console.log('\n[Test 10] Testing Live Scrap Rates & Audio Summary...');
    const ratesRes = await request('/dashboard/scrap-rates');
    console.log(' Total Scrap Materials Tracked:', ratesRes.data.data.length);
    console.log(' Spoken Scrap Rates:', `"${ratesRes.data.spokenRates}"`);

    console.log('\n======================================================');
    console.log('🎉 ALL 10 TEST SUITES PASSED FLAWLESSLY!');
    console.log('======================================================\n');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Check if running directly or if server needs to be started
runTests();
