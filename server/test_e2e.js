const BASE_URL = 'http://localhost:5000/api';

const req = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const config = {
    method: options.method || 'GET',
    headers,
  };
  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const res = await fetch(url, config);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.message || `HTTP ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return { status: res.status, data };
};

const runTests = async () => {
  console.log('🧪 Starting CineBook Full-Stack End-to-End Verification Test Suite...\n');
  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
      failed++;
    }
  };

  let userToken = '';
  let adminToken = '';
  let testMovieId = '';
  let testShowId = '';
  let testBookingId = '';
  let testBookingDocId = '';

  // 1. Health check
  await test('Server Health Check (/api/health)', async () => {
    const res = await req('/health');
    if (res.data.status !== 'OK') throw new Error('Health check returned non-OK');
  });

  // 2. Customer Authentication
  await test('Customer Authentication (Login with user@cinebook.com)', async () => {
    const res = await req('/auth/login', {
      method: 'POST',
      body: {
        email: 'user@cinebook.com',
        password: 'User@123',
      },
    });
    if (!res.data.data.token) throw new Error('No JWT token returned');
    userToken = res.data.data.token;
  });

  // 3. Admin Authentication
  await test('Admin Authentication & Privileges (admin@cinebook.com)', async () => {
    const res = await req('/auth/login', {
      method: 'POST',
      body: {
        email: 'admin@cinebook.com',
        password: 'Admin@123',
      },
    });
    if (res.data.data.role !== 'admin') throw new Error('User is not admin');
    adminToken = res.data.data.token;
  });

  // 4. Movies Retrieval
  await test('Fetch Movies Catalog with Genres & Formats (/api/movies)', async () => {
    const res = await req('/movies');
    if (!res.data.data || res.data.data.length < 5) throw new Error('Movie catalog is insufficient');
    testMovieId = res.data.data[0]._id;
  });

  // 5. Single Movie Details
  await test('Fetch Movie By ID with Reviews (/api/movies/:id)', async () => {
    const res = await req(`/movies/${testMovieId}`);
    if (!res.data.data.title) throw new Error('Movie title missing');
  });

  // 6. Theatres
  await test('Fetch Theatres by City (/api/theatres?city=Mumbai)', async () => {
    const res = await req('/theatres?city=Mumbai');
    if (!res.data.data || res.data.data.length === 0) throw new Error('No theatres in Mumbai');
  });

  // 7. Shows
  await test('Fetch Scheduled Movie Shows (/api/shows?movie=...)', async () => {
    const res = await req(`/shows?movie=${testMovieId}`);
    if (!res.data.data || res.data.data.length === 0) throw new Error('No shows for movie');
    testShowId = res.data.data[0]._id;
  });

  // 8. Seat Map & Dynamic Pricing Tiers
  await test('Inspect Show Seat Map with Dynamic Pricing Tiers (/api/shows/:id)', async () => {
    const res = await req(`/shows/${testShowId}`);
    if (!res.data.data.seatMap || res.data.data.seatMap.length === 0) {
      throw new Error('Seat map was not generated');
    }
  });

  // 9. Real-Time Seat Locking
  const sessionA = 'session_customer_123';
  await test('Real-Time Seat Locking (5-Minute Hold) (/api/seats/lock)', async () => {
    const res = await req('/seats/lock', {
      method: 'POST',
      body: {
        showId: testShowId,
        seats: ['A1', 'A2'],
        lockSessionId: sessionA,
      },
    });
    if (!res.data.data.lockedSeats.includes('A1')) throw new Error('Seat A1 not locked');
    if (res.data.data.lockDurationSeconds !== 300) throw new Error('Lock duration not 300s');
  });

  // 10. Concurrency & Conflict Prevention
  await test('Prevent Double-Locking from Concurrent Session (HTTP 409 Conflict)', async () => {
    try {
      await req('/seats/lock', {
        method: 'POST',
        body: {
          showId: testShowId,
          seats: ['A1'],
          lockSessionId: 'different_session_999',
        },
      });
      throw new Error('Should have failed with 409 conflict');
    } catch (err) {
      if (err.status !== 409) {
        throw new Error(`Expected 409 Conflict, got ${err.status}`);
      }
    }
  });

  // 11. Food Concessions
  await test('Concession Items (Popcorn, Combos, Beverages) (/api/food)', async () => {
    const res = await req('/food');
    if (!res.data.data || res.data.data.length < 5) throw new Error('Food items insufficient');
  });

  // 12. Coupon Validation
  await test('Backend Coupon Validation (WELCOME100)', async () => {
    const res = await req('/coupons/validate', {
      method: 'POST',
      body: {
        code: 'WELCOME100',
        amount: 600,
      },
    });
    if (res.data.data.discountAmount !== 100) throw new Error('Discount amount incorrect');
  });

  // 13. Create Confirmed Booking
  await test('Create Confirmed Booking with QR Ticket Generation (/api/bookings)', async () => {
    const res = await req('/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` },
      body: {
        showId: testShowId,
        seats: [
          { seatId: 'A1', row: 'A', number: 1, category: 'VIP', price: 350 },
          { seatId: 'A2', row: 'A', number: 2, category: 'VIP', price: 350 },
        ],
        foodItems: [{ name: 'Caramel Popcorn', price: 240, quantity: 1 }],
        couponCode: 'WELCOME100',
        paymentMethod: 'mock_card',
        isMock: true,
      },
    });

    testBookingId = res.data.data.bookingId;
    testBookingDocId = res.data.data._id;
    if (!res.data.data.bookingId.startsWith('CB-2026-')) {
      throw new Error('Invalid booking ID pattern');
    }
    if (!res.data.data.qrCode || !res.data.data.qrCode.startsWith('data:image')) {
      throw new Error('QR code data URL was not generated');
    }
    if (res.data.data.bookingStatus !== 'confirmed') {
      throw new Error('Status not confirmed');
    }
  });

  // 14. Double Booking Prevention
  await test('Prevent Double-Booking on Confirmed Seats (HTTP 400 Bad Request)', async () => {
    try {
      await req('/bookings', {
        method: 'POST',
        headers: { Authorization: `Bearer ${userToken}` },
        body: {
          showId: testShowId,
          seats: [{ seatId: 'A1', row: 'A', number: 1, category: 'VIP', price: 350 }],
          paymentMethod: 'mock_card',
          isMock: true,
        },
      });
      throw new Error('Should have rejected double-booking');
    } catch (err) {
      if (err.status !== 400) {
        throw new Error(`Expected 400 Bad Request, got ${err.status}`);
      }
    }
  });

  // 15. Customer "My Bookings"
  await test('Customer My Bookings Retrieval (/api/bookings/my)', async () => {
    const res = await req('/bookings/my', {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    if (!res.data.data.some((b) => b.bookingId === testBookingId)) {
      throw new Error('Created booking not found in customer history');
    }
  });

  // 16. Admin Dashboard Telemetry
  await test('Admin Dashboard KPI Stats & Box Office Revenue (/api/bookings/admin/stats)', async () => {
    const res = await req('/bookings/admin/stats', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (typeof res.data.data.totalRevenue !== 'number') {
      throw new Error('Invalid revenue type');
    }
    if (!res.data.data.last7Days || res.data.data.last7Days.length !== 7) {
      throw new Error('7-day revenue trend data missing');
    }
  });

  // 17. Booking Cancellation & Refund
  await test('Ticket Cancellation & 75% Refund Computation (/api/bookings/:id/cancel)', async () => {
    const res = await req(`/bookings/${testBookingDocId}/cancel`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` },
      body: { reason: 'Change of schedule' },
    });
    if (res.data.data.bookingStatus !== 'cancelled') {
      throw new Error('Booking status was not marked cancelled');
    }
    if (!res.data.data.refundAmount || res.data.data.refundAmount <= 0) {
      throw new Error('Refund amount not computed');
    }
  });

  console.log(`\n======================================================`);
  console.log(`  🏁 Test Suite Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`======================================================\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
};

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
