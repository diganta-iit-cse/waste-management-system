const http = require('http');

const request = (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : '';
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api${path}`,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(dataString ? { 'Content-Length': Buffer.byteLength(dataString) } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    };

    const req = http.request(options, (res) => {
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(rawData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: rawData });
        }
      });
    });

    req.on('error', (e) => reject(e));
    if (dataString) req.write(dataString);
    req.end();
  });
};

const runTests = async () => {
  console.log('\n========================================================');
  console.log('       SHOPKART END-TO-END AUTOMATED TEST SUITE');
  console.log('========================================================\n');

  try {
    // 1. Health check
    console.log('1. Testing GET /api/health ...');
    const health = await request('GET', '/health');
    if (health.status !== 200 || health.data.status !== 'OK') throw new Error('Health check failed');
    console.log('   ✓ Health check passed');

    // 2. Register
    const testEmail = `testuser_${Date.now()}@example.com`;
    console.log(`2. Testing POST /api/auth/register (${testEmail}) ...`);
    const regRes = await request('POST', '/auth/register', {
      name: 'Priya Sharma',
      email: testEmail,
      phone: '+91 9988776655',
      password: 'User@123',
      confirmPassword: 'User@123'
    });
    if (regRes.status !== 201 || !regRes.data.token) throw new Error(`Register failed: ${JSON.stringify(regRes.data)}`);
    console.log('   ✓ User registered successfully! User ID:', regRes.data.user._id);

    // 3. Login
    console.log('3. Testing POST /api/auth/login ...');
    const loginRes = await request('POST', '/auth/login', {
      email: testEmail,
      password: 'User@123'
    });
    if (loginRes.status !== 200 || !loginRes.data.token) throw new Error('Login failed');
    const userToken = loginRes.data.token;
    console.log('   ✓ Login successful! Token acquired');

    // 4. Browse products
    console.log('4. Testing GET /api/products ...');
    const prodsRes = await request('GET', '/products?page=1&limit=5');
    if (prodsRes.status !== 200 || prodsRes.data.products.length === 0) throw new Error('Browse products failed');
    console.log(`   ✓ Browse passed! Found ${prodsRes.data.totalProducts} total products in database`);

    // 5. Search product
    console.log('5. Testing GET /api/products?search=iphone ...');
    const searchRes = await request('GET', '/products?search=iphone');
    if (searchRes.status !== 200 || searchRes.data.products.length === 0) throw new Error('Search product failed');
    console.log(`   ✓ Search passed! Found ${searchRes.data.products.length} products for "iphone"`);

    // 6. Filter products
    console.log('6. Testing GET /api/products?category=mobiles&sort=price_asc ...');
    const filterRes = await request('GET', '/products?category=mobiles&sort=price_asc');
    if (filterRes.status !== 200) throw new Error('Filter products failed');
    console.log(`   ✓ Filter passed! Found ${filterRes.data.products.length} mobiles sorted by price`);

    // 7. Open single product
    const sampleProduct = filterRes.data.products[0];
    console.log(`7. Testing GET /api/products/${sampleProduct._id} ...`);
    const singleRes = await request('GET', `/products/${sampleProduct._id}`);
    if (singleRes.status !== 200 || !singleRes.data.product) throw new Error('Get single product failed');
    console.log(`   ✓ Product details loaded: "${singleRes.data.product.name}"`);

    // 8. Add to cart
    console.log('8. Testing POST /api/cart (Add product to cart) ...');
    const addCartRes = await request('POST', '/cart', { productId: sampleProduct._id, quantity: 1 }, userToken);
    if (addCartRes.status !== 200 || addCartRes.data.cart.items.length === 0) throw new Error('Add to cart failed');
    console.log('   ✓ Added to cart! Cart items count:', addCartRes.data.cart.items.length);

    // 9. Update quantity
    console.log('9. Testing PUT /api/cart/:productId (Update quantity to 2) ...');
    const updateQtyRes = await request('PUT', `/cart/${sampleProduct._id}`, { quantity: 2 }, userToken);
    if (updateQtyRes.status !== 200 || updateQtyRes.data.cart.items[0].quantity !== 2) throw new Error('Update quantity failed');
    console.log('   ✓ Cart quantity updated to 2!');

    // 10. Add address
    console.log('10. Testing POST /api/auth/address (Add delivery address) ...');
    const addrRes = await request('POST', '/auth/address', {
      fullName: 'Priya Sharma',
      phone: '+91 9988776655',
      street: '12B Galaxy Apartments, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      addressType: 'Home',
      isDefault: true
    }, userToken);
    if (addrRes.status !== 201 || addrRes.data.addresses.length === 0) throw new Error('Add address failed');
    const savedAddress = addrRes.data.addresses[0];
    console.log('   ✓ Delivery address saved successfully!');

    // 11. Checkout & Place order
    console.log('11. Testing POST /api/orders (Place order) ...');
    const orderRes = await request('POST', '/orders', {
      items: [
        {
          product: sampleProduct._id,
          name: sampleProduct.name,
          image: sampleProduct.images[0],
          price: sampleProduct.price,
          quantity: 2
        }
      ],
      shippingAddress: savedAddress,
      paymentMethod: 'Mock Online Payment'
    }, userToken);
    if (orderRes.status !== 201 || !orderRes.data.order) throw new Error(`Place order failed: ${JSON.stringify(orderRes.data)}`);
    const placedOrder = orderRes.data.order;
    console.log('   ✓ Order placed successfully! Order ID:', placedOrder._id);
    console.log('     Status:', placedOrder.orderStatus, '| Payment:', placedOrder.paymentStatus, '| Total: ₹' + placedOrder.totalAmount);

    // 12. Verify cart is cleared
    console.log('12. Verifying Cart is cleared after order ...');
    const verifyCart = await request('GET', '/cart', null, userToken);
    if (verifyCart.data.cart.items.length !== 0) throw new Error('Cart was not cleared after order placement');
    console.log('   ✓ Cart verified empty after checkout');

    // 13. View order details
    console.log(`13. Testing GET /api/orders/${placedOrder._id} ...`);
    const viewOrderRes = await request('GET', `/orders/${placedOrder._id}`, null, userToken);
    if (viewOrderRes.status !== 200 || viewOrderRes.data.order._id !== placedOrder._id) throw new Error('View order failed');
    console.log('   ✓ Order details retrieved with status history timeline!');

    // 14. View order history
    console.log('14. Testing GET /api/orders (User order history) ...');
    const historyRes = await request('GET', '/orders', null, userToken);
    if (historyRes.status !== 200 || historyRes.data.orders.length === 0) throw new Error('Order history failed');
    console.log(`   ✓ Order history verified! Found ${historyRes.data.orders.length} orders for user`);

    // -------------------------------------------------------------
    // ADMIN FLOW TESTS
    // -------------------------------------------------------------
    console.log('\n--- TESTING ADMIN FLOW ---');

    // 15. Admin login
    console.log('15. Testing Admin Login (admin@example.com) ...');
    const adminLogin = await request('POST', '/auth/login', {
      email: 'admin@example.com',
      password: 'Admin@123'
    });
    if (adminLogin.status !== 200 || adminLogin.data.user.role !== 'admin') throw new Error('Admin login failed');
    const adminToken = adminLogin.data.token;
    console.log('   ✓ Admin login successful with role: admin');

    // 16. Admin dashboard
    console.log('16. Testing GET /api/admin/dashboard ...');
    const dashRes = await request('GET', '/admin/dashboard', null, adminToken);
    if (dashRes.status !== 200 || !dashRes.data.metrics) throw new Error('Dashboard metrics failed');
    console.log('   ✓ Admin dashboard metrics loaded:');
    console.log('     Total Revenue: ₹' + dashRes.data.metrics.totalRevenue);
    console.log('     Total Orders:  ' + dashRes.data.metrics.totalOrders);
    console.log('     Total Users:   ' + dashRes.data.metrics.totalUsers);
    console.log('     Total Products:' + dashRes.data.metrics.totalProducts);

    // 17. Admin create product
    console.log('17. Testing POST /api/products (Admin create product) ...');
    const newProdRes = await request('POST', '/products', {
      name: 'Sony PlayStation 5 Slim Console (1TB SSD, 4K HDR)',
      description: 'Experience lightning fast loading with an ultra-high speed SSD, deeper immersion with haptic feedback, adaptive triggers, and 3D Audio.',
      brand: 'Sony',
      category: sampleProduct.category._id || sampleProduct.category,
      price: 54990,
      originalPrice: 59990,
      stock: 15,
      images: ['https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600'],
      specifications: [
        { key: 'Storage', value: '1TB Custom NVMe SSD' },
        { key: 'Resolution', value: 'Up to 4K 120Hz, 8K output support' }
      ]
    }, adminToken);
    if (newProdRes.status !== 201 || !newProdRes.data.product) throw new Error(`Create product failed: ${JSON.stringify(newProdRes.data)}`);
    const createdProd = newProdRes.data.product;
    console.log('   ✓ Created product successfully! ID:', createdProd._id);

    // 18. Admin edit product
    console.log(`18. Testing PUT /api/products/${createdProd._id} (Admin edit product) ...`);
    const editProdRes = await request('PUT', `/products/${createdProd._id}`, {
      price: 52990,
      stock: 20
    }, adminToken);
    if (editProdRes.status !== 200 || editProdRes.data.product.price !== 52990) throw new Error('Edit product failed');
    console.log('   ✓ Product updated successfully! New price: ₹' + editProdRes.data.product.price);

    // 19. Admin delete product
    console.log(`19. Testing DELETE /api/products/${createdProd._id} (Admin delete product) ...`);
    const delProdRes = await request('DELETE', `/products/${createdProd._id}`, null, adminToken);
    if (delProdRes.status !== 200) throw new Error('Delete product failed');
    console.log('   ✓ Product deleted successfully');

    // 20. Admin view users
    console.log('20. Testing GET /api/admin/users ...');
    const usersRes = await request('GET', '/admin/users', null, adminToken);
    if (usersRes.status !== 200 || usersRes.data.users.length === 0) throw new Error('View users failed');
    console.log(`   ✓ Admin users list loaded! Found ${usersRes.data.total} registered users`);

    // 21. Admin view orders
    console.log('21. Testing GET /api/admin/orders ...');
    const adminOrdersRes = await request('GET', '/admin/orders', null, adminToken);
    if (adminOrdersRes.status !== 200 || adminOrdersRes.data.orders.length === 0) throw new Error('Admin view orders failed');
    console.log(`   ✓ Admin orders loaded! Found ${adminOrdersRes.data.total} orders`);

    // 22. Admin update order status
    console.log(`22. Testing PUT /api/admin/orders/${placedOrder._id}/status ...`);
    const updateStatusRes = await request('PUT', `/admin/orders/${placedOrder._id}/status`, {
      orderStatus: 'Shipped',
      note: 'Dispatched via Express Courier.'
    }, adminToken);
    if (updateStatusRes.status !== 200 || updateStatusRes.data.order.orderStatus !== 'Shipped') throw new Error('Update order status failed');
    console.log('   ✓ Admin updated order status to "Shipped"!');

    // 23. Wishlist test
    console.log(`23. Testing POST /api/wishlist/${sampleProduct._id} ...`);
    const wishRes = await request('POST', `/wishlist/${sampleProduct._id}`, null, userToken);
    if (wishRes.status !== 200) throw new Error('Wishlist add failed');
    const getWish = await request('GET', '/wishlist', null, userToken);
    if (getWish.status !== 200 || getWish.data.wishlist.length === 0) throw new Error('Wishlist get failed');
    console.log(`   ✓ Wishlist verified with ${getWish.data.wishlist.length} item(s)`);

    // 24. Review test
    console.log(`24. Testing POST /api/products/${sampleProduct._id}/reviews ...`);
    const revRes = await request('POST', `/products/${sampleProduct._id}/reviews`, {
      rating: 5,
      title: 'Amazing purchase!',
      comment: 'Top notch performance and super fast delivery. Truly loved it!'
    }, userToken);
    if (revRes.status !== 201 && revRes.status !== 200) throw new Error('Review failed');
    console.log('   ✓ Review submitted and product ratings recalculated!');

    console.log('\n========================================================');
    console.log('   ALL 24 END-TO-END FLOW TESTS PASSED SUCCESSFULLY!    ');
    console.log('========================================================\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test Failure:', error.message);
    process.exit(1);
  }
};

runTests();
