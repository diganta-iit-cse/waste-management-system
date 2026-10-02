require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const { connectDB, closeDB } = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Review = require('../models/Review');
const { categoriesData, productsRawData } = require('./seedData');

const seedData = async (exitOnComplete = true) => {
  try {
    console.log('--- Connecting to database for seeding ---');
    await connectDB();

    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany(),
      Category.deleteMany(),
      Product.deleteMany(),
      Cart.deleteMany(),
      Order.deleteMany(),
      Review.deleteMany()
    ]);
    console.log('✓ Cleared all collections.');

    console.log('Creating demo users...');
    // Create Admin and Regular demo users
    const adminUser = await User.create({
      name: 'ShopKart Administrator',
      email: 'admin@example.com',
      phone: '+91 9876543210',
      password: 'Admin@123',
      role: 'admin',
      addresses: [
        {
          fullName: 'ShopKart HQ',
          phone: '+91 9876543210',
          street: 'Block 4, Outer Ring Road, Bellandur',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560103',
          landmark: 'EcoWorld Tech Park',
          addressType: 'Work',
          isDefault: true
        }
      ]
    });

    const regularUser = await User.create({
      name: 'Rohan Sharma',
      email: 'user@example.com',
      phone: '+91 9811223344',
      password: 'User@123',
      role: 'user',
      addresses: [
        {
          fullName: 'Rohan Sharma',
          phone: '+91 9811223344',
          street: 'Flat 402, Sunshine Heights, MG Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          landmark: 'Near Metro Station',
          addressType: 'Home',
          isDefault: true
        },
        {
          fullName: 'Rohan Sharma (Office)',
          phone: '+91 9811223344',
          street: 'Level 8, Express Towers, Nariman Point',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400021',
          landmark: 'Opposite State Bank',
          addressType: 'Work',
          isDefault: false
        }
      ]
    });
    console.log(`✓ Created Admin: ${adminUser.email} & User: ${regularUser.email}`);

    console.log('Creating categories...');
    const insertedCategories = await Category.insertMany(categoriesData);
    const categoryMap = {};
    insertedCategories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });
    console.log(`✓ Inserted ${insertedCategories.length} categories.`);

    console.log('Creating products...');
    const productsToInsert = productsRawData.map(prod => {
      const { categorySlug, ...rest } = prod;
      return {
        ...rest,
        category: categoryMap[categorySlug] || insertedCategories[0]._id
      };
    });

    const insertedProducts = await Product.insertMany(productsToInsert);
    console.log(`✓ Inserted ${insertedProducts.length} products.`);

    // Pre-populate regular user's wishlist with 2 items
    regularUser.wishlist = [insertedProducts[0]._id, insertedProducts[5]._id];
    await regularUser.save();
    console.log('✓ Initialized user wishlist with 2 items.');

    // Pre-populate regular user's cart with 1 active item and 1 save-for-later item
    await Cart.create({
      user: regularUser._id,
      items: [
        {
          product: insertedProducts[1]._id, // Samsung Galaxy S24 Ultra
          quantity: 1,
          price: insertedProducts[1].price
        }
      ],
      savedForLater: [
        {
          product: insertedProducts[8]._id, // Tommy Hilfiger casual shirt
          price: insertedProducts[8].price
        }
      ]
    });
    console.log('✓ Initialized user cart.');

    // Create reviews for products
    console.log('Adding reviews...');
    const sampleReviews = [
      {
        user: regularUser._id,
        product: insertedProducts[0]._id, // iPhone 15 Pro
        rating: 5,
        title: 'Worth every rupee!',
        comment: 'The natural titanium finish feels unbelievable in hand. Incredible performance and battery life!'
      },
      {
        user: adminUser._id,
        product: insertedProducts[0]._id,
        rating: 5,
        title: 'Superb Camera & Build Quality',
        comment: 'Pro cameras and 120Hz display make this the best flagship phone right now.'
      },
      {
        user: regularUser._id,
        product: insertedProducts[5]._id, // MacBook Air M3
        rating: 5,
        title: 'Lightweight Beast',
        comment: 'Battery lasts almost 2 whole days of regular coding and browsing. Super fast!'
      },
      {
        user: regularUser._id,
        product: insertedProducts[6]._id, // Sony WH-1000XM5
        rating: 5,
        title: 'Best Noise Cancellation in the world',
        comment: 'Cuts out all flight and commute noise completely. Super comfy earcups.'
      },
      {
        user: regularUser._id,
        product: insertedProducts[11]._id, // Levi's Jeans
        rating: 4,
        title: 'Comfortable Stretch Denim',
        comment: 'Fits true to size and stretch material is very comfortable for daily office wear.'
      }
    ];

    for (const rev of sampleReviews) {
      await Review.create(rev);
    }
    console.log(`✓ Added ${sampleReviews.length} sample reviews.`);

    // Create sample past orders for analytics and order history demonstration
    console.log('Creating demo orders...');
    const now = new Date();
    const daysAgo = (days) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const demoOrders = [
      {
        user: regularUser._id,
        items: [
          {
            product: insertedProducts[5]._id, // MacBook Air
            name: insertedProducts[5].name,
            image: insertedProducts[5].images[0],
            price: insertedProducts[5].price,
            originalPrice: insertedProducts[5].originalPrice,
            quantity: 1
          }
        ],
        shippingAddress: regularUser.addresses[0],
        paymentMethod: 'Mock Online Payment',
        paymentStatus: 'Completed',
        paymentDetails: {
          transactionId: 'TXN_ONLINE_883172',
          paidAt: daysAgo(5)
        },
        orderStatus: 'Delivered',
        deliveredAt: daysAgo(2),
        statusHistory: [
          { status: 'Order Placed', timestamp: daysAgo(5), note: 'Order placed and paid online.' },
          { status: 'Confirmed', timestamp: daysAgo(4), note: 'Payment verified and order confirmed.' },
          { status: 'Packed', timestamp: daysAgo(4), note: 'Item packaged in Bangalore warehouse.' },
          { status: 'Shipped', timestamp: daysAgo(3), note: 'Dispatched via BlueDart Express (AWB #829102).' },
          { status: 'Out for Delivery', timestamp: daysAgo(2), note: 'Out for delivery with courier agent.' },
          { status: 'Delivered', timestamp: daysAgo(2), note: 'Delivered to recipient Rohan Sharma.' }
        ],
        itemsPrice: insertedProducts[5].price,
        discount: insertedProducts[5].originalPrice - insertedProducts[5].price,
        deliveryFee: 0,
        totalAmount: insertedProducts[5].price,
        createdAt: daysAgo(5)
      },
      {
        user: regularUser._id,
        items: [
          {
            product: insertedProducts[6]._id, // Sony Headphones
            name: insertedProducts[6].name,
            image: insertedProducts[6].images[0],
            price: insertedProducts[6].price,
            originalPrice: insertedProducts[6].originalPrice,
            quantity: 1
          },
          {
            product: insertedProducts[11]._id, // Levi's Jeans
            name: insertedProducts[11].name,
            image: insertedProducts[11].images[0],
            price: insertedProducts[11].price,
            originalPrice: insertedProducts[11].originalPrice,
            quantity: 2
          }
        ],
        shippingAddress: regularUser.addresses[0],
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'Pending',
        orderStatus: 'Shipped',
        statusHistory: [
          { status: 'Order Placed', timestamp: daysAgo(2), note: 'Order placed with Cash on Delivery.' },
          { status: 'Confirmed', timestamp: daysAgo(1), note: 'Seller accepted and confirmed order.' },
          { status: 'Packed', timestamp: daysAgo(1), note: 'Order packed.' },
          { status: 'Shipped', timestamp: daysAgo(0), note: 'Package is in transit to destination hub.' }
        ],
        itemsPrice: insertedProducts[6].price + (insertedProducts[11].price * 2),
        discount: 1000,
        deliveryFee: 0,
        totalAmount: insertedProducts[6].price + (insertedProducts[11].price * 2),
        createdAt: daysAgo(2)
      },
      {
        user: regularUser._id,
        items: [
          {
            product: insertedProducts[12]._id, // Nike Air Jordan
            name: insertedProducts[12].name,
            image: insertedProducts[12].images[0],
            price: insertedProducts[12].price,
            originalPrice: insertedProducts[12].originalPrice,
            quantity: 1
          }
        ],
        shippingAddress: regularUser.addresses[0],
        paymentMethod: 'Mock Online Payment',
        paymentStatus: 'Completed',
        orderStatus: 'Order Placed',
        statusHistory: [
          { status: 'Order Placed', timestamp: now, note: 'Order received and being processed.' }
        ],
        itemsPrice: insertedProducts[12].price,
        discount: 2500,
        deliveryFee: 0,
        totalAmount: insertedProducts[12].price,
        createdAt: now
      }
    ];

    await Order.insertMany(demoOrders);
    console.log(`✓ Inserted ${demoOrders.length} demo orders.`);

    console.log('\n==========================================');
    console.log('DATABASE SEEDED SUCCESSFULLY!');
    console.log('DEMO ACCOUNTS:');
    console.log('  Admin User: admin@example.com / Admin@123');
    console.log('  Normal User: user@example.com / User@123');
    console.log(`  Categories: ${insertedCategories.length}`);
    console.log(`  Products: ${insertedProducts.length}`);
    console.log('==========================================\n');

    if (exitOnComplete) {
      await closeDB();
      process.exit(0);
    }
  } catch (error) {
    console.error('Seeding Error:', error);
    if (exitOnComplete) {
      await closeDB();
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
