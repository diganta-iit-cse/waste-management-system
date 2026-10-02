const categoriesData = [
  {
    name: 'Mobiles',
    slug: 'mobiles',
    description: 'Latest Smartphones, 5G Mobiles, and Accessories',
    icon: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&auto=format&fit=crop&q=80'
  },
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Laptops, Smartwatches, Headphones, and Cameras',
    icon: 'Laptop',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&auto=format&fit=crop&q=80'
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    description: 'Men & Women Clothing, Footwear, and Accessories',
    icon: 'Shirt',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&auto=format&fit=crop&q=80'
  },
  {
    name: 'Home',
    slug: 'home',
    description: 'Furniture, Decor, Lighting, and Bedding',
    icon: 'Home',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&auto=format&fit=crop&q=80'
  },
  {
    name: 'Kitchen',
    slug: 'kitchen',
    description: 'Cookware, Blenders, Dining, and Appliances',
    icon: 'Utensils',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&auto=format&fit=crop&q=80'
  },
  {
    name: 'Beauty',
    slug: 'beauty',
    description: 'Skincare, Haircare, Makeup, and Fragrances',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&auto=format&fit=crop&q=80'
  },
  {
    name: 'Grocery',
    slug: 'grocery',
    description: 'Staples, Snacks, Beverages, and Organic Goods',
    icon: 'ShoppingBag',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80'
  },
  {
    name: 'Sports',
    slug: 'sports',
    description: 'Fitness Equipment, Activewear, and Outdoor Gear',
    icon: 'Dumbbell',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80'
  },
  {
    name: 'Books',
    slug: 'books',
    description: 'Bestsellers, Fiction, Non-Fiction, and Academic',
    icon: 'BookOpen',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&auto=format&fit=crop&q=80'
  },
  {
    name: 'Toys',
    slug: 'toys',
    description: 'Educational Toys, Action Figures, and Board Games',
    icon: 'Gamepad2',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&auto=format&fit=crop&q=80'
  }
];

const productsRawData = [
  // MOBILES (5 products)
  {
    name: 'Apple iPhone 15 Pro (128 GB, Natural Titanium)',
    brand: 'Apple',
    categorySlug: 'mobiles',
    price: 127990,
    originalPrice: 134900,
    discount: 5,
    stock: 25,
    rating: 4.8,
    numReviews: 1420,
    description: 'iPhone 15 Pro forged in titanium and featuring the groundbreaking A17 Pro chip, customizable Action button, and a more versatile Pro camera system.',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Display', value: '6.1-inch Super Retina XDR OLED 120Hz' },
      { key: 'Processor', value: 'A17 Pro Chip 3nm Hexa-Core' },
      { key: 'Camera', value: '48MP + 12MP + 12MP Triple Camera with 3x Telephoto' },
      { key: 'Battery', value: '3274 mAh with 20W Fast Charging' },
      { key: 'Storage', value: '128 GB NVMe' }
    ],
    isDealOfTheDay: true,
    isBestSeller: true,
    tags: ['iphone', 'apple', 'smartphone', '5g', 'flagship']
  },
  {
    name: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256 GB)',
    brand: 'Samsung',
    categorySlug: 'mobiles',
    price: 119999,
    originalPrice: 134999,
    discount: 11,
    stock: 18,
    rating: 4.7,
    numReviews: 980,
    description: 'Meet Galaxy S24 Ultra with Galaxy AI. A sleek, sturdy titanium exterior surrounds a breathtaking 6.8 inch flat screen and unmatched 200MP camera system.',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Display', value: '6.8-inch Dynamic LTPO AMOLED 2X 120Hz' },
      { key: 'Processor', value: 'Snapdragon 8 Gen 3 for Galaxy' },
      { key: 'Camera', value: '200MP + 50MP + 10MP + 12MP Quad Camera' },
      { key: 'Stylus', value: 'Integrated S-Pen support' }
    ],
    isTrending: true,
    isFeatured: true,
    tags: ['samsung', 'galaxy', 's24', 'ai', '5g', 'flagship']
  },
  {
    name: 'OnePlus 12 5G (Flowy Emerald, 16GB RAM, 512GB Storage)',
    brand: 'OnePlus',
    categorySlug: 'mobiles',
    price: 64999,
    originalPrice: 69999,
    discount: 7,
    stock: 35,
    rating: 4.6,
    numReviews: 640,
    description: 'OnePlus 12 seamlessly blends flagship power with luxurious design, boasting 4th Gen Hasselblad Camera and 100W SUPERVOOC charging.',
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Display', value: '6.82-inch 2K 120Hz ProXDR Display' },
      { key: 'Charging', value: '100W SUPERVOOC + 50W AIRVOOC' },
      { key: 'Camera', value: '50MP Sony LYT-808 with OIS' }
    ],
    isBestSeller: true,
    tags: ['oneplus', 'android', 'flagship killer', 'fast charging']
  },
  {
    name: 'Google Pixel 8 (Hazel, 128 GB)',
    brand: 'Google',
    categorySlug: 'mobiles',
    price: 58999,
    originalPrice: 75999,
    discount: 22,
    stock: 20,
    rating: 4.5,
    numReviews: 450,
    description: 'Google Pixel 8 powered by Google Tensor G3 for breakthrough photo and video capabilities, and useful AI all day.',
    images: [
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Display', value: '6.2-inch Actua display 120Hz' },
      { key: 'Processor', value: 'Google Tensor G3' },
      { key: 'Updates', value: '7 years of OS & security updates' }
    ],
    isDealOfTheDay: true,
    tags: ['pixel', 'google', 'camera', 'ai', 'android']
  },
  {
    name: 'Redmi Note 13 Pro+ 5G (Fusion Purple, 256 GB)',
    brand: 'Xiaomi',
    categorySlug: 'mobiles',
    price: 29999,
    originalPrice: 33999,
    discount: 12,
    stock: 45,
    rating: 4.4,
    numReviews: 820,
    description: '3D Curved AMOLED Display with 200MP OIS camera, IP68 water resistance, and 120W HyperCharge.',
    images: [
      'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Display', value: '6.67-inch 1.5K 120Hz Curved AMOLED' },
      { key: 'Charging', value: '120W HyperCharge (100% in 19 mins)' },
      { key: 'Protection', value: 'Corning Gorilla Glass Victus + IP68' }
    ],
    isTrending: true,
    tags: ['redmi', 'budget', '200mp', 'xiaomi']
  },

  // ELECTRONICS (6 products)
  {
    name: 'Apple MacBook Air 15-inch M3 Chip (Midnight, 16GB, 512GB)',
    brand: 'Apple',
    categorySlug: 'electronics',
    price: 144900,
    originalPrice: 154900,
    discount: 6,
    stock: 15,
    rating: 4.9,
    numReviews: 730,
    description: 'Strikingly thin and fast MacBook Air with the M3 chip. Supercharged for work, play, and up to 18 hours of battery life.',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Display', value: '15.3-inch Liquid Retina Display 500 nits' },
      { key: 'Chip', value: 'Apple M3 8-core CPU / 10-core GPU' },
      { key: 'Battery', value: 'Up to 18 hours battery life' },
      { key: 'Weight', value: '1.51 kg' }
    ],
    isDealOfTheDay: true,
    isBestSeller: true,
    tags: ['macbook', 'apple', 'laptop', 'm3']
  },
  {
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones (Black)',
    brand: 'Sony',
    categorySlug: 'electronics',
    price: 26990,
    originalPrice: 34990,
    discount: 23,
    stock: 30,
    rating: 4.8,
    numReviews: 1200,
    description: 'Industry-leading noise cancellation optimized to your environment with two processors and 8 microphones. Crystal clear hands-free calls.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Battery Life', value: 'Up to 30 hours with ANC on' },
      { key: 'Connectivity', value: 'Bluetooth 5.2 with LDAC & Multipoint' },
      { key: 'Weight', value: '250g ultra-lightweight design' }
    ],
    isBestSeller: true,
    tags: ['sony', 'headphones', 'anc', 'wireless', 'music']
  },
  {
    name: 'Dell XPS 13 Plus Intel Core i7 13th Gen (16GB RAM, 1TB SSD)',
    brand: 'Dell',
    categorySlug: 'electronics',
    price: 159990,
    originalPrice: 185000,
    discount: 14,
    stock: 10,
    rating: 4.6,
    numReviews: 310,
    description: 'Zero-lattice keyboard, seamless glass haptic touchpad, and brilliant 3.5K OLED touch screen.',
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Processor', value: '13th Gen Intel Core i7-1360P' },
      { key: 'Display', value: '13.4-inch 3.5K OLED InfinityEdge Touch' },
      { key: 'OS', value: 'Windows 11 Home' }
    ],
    isFeatured: true,
    tags: ['dell', 'xps', 'laptop', 'intel', 'oled']
  },
  {
    name: 'Apple Watch Series 9 GPS 45mm (Midnight Aluminum Case)',
    brand: 'Apple',
    categorySlug: 'electronics',
    price: 41999,
    originalPrice: 44900,
    discount: 6,
    stock: 22,
    rating: 4.7,
    numReviews: 610,
    description: 'Smarter, brighter, mightier. Introducing the double-tap gesture, an easy way to interact with Apple Watch Series 9.',
    images: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Display', value: 'Always-On Retina up to 2000 nits' },
      { key: 'Sensors', value: 'ECG, Blood Oxygen, Temperature, Crash Detection' }
    ],
    isTrending: true,
    tags: ['smartwatch', 'apple', 'fitness', 'watch']
  },
  {
    name: 'Canon EOS R50 Mirrorless Camera with RF-S 18-45mm Lens',
    brand: 'Canon',
    categorySlug: 'electronics',
    price: 61990,
    originalPrice: 75995,
    discount: 18,
    stock: 12,
    rating: 4.7,
    numReviews: 240,
    description: 'Compact, lightweight 24.2 MP APS-C mirrorless camera designed for content creators and photo enthusiasts.',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Sensor', value: '24.2 MP APS-C CMOS Sensor' },
      { key: 'Video', value: '4K 30p uncropped oversampled from 6K' },
      { key: 'Autofocus', value: 'Dual Pixel CMOS AF II with Subject Detection' }
    ],
    tags: ['camera', 'canon', 'dslr', 'mirrorless', 'photography']
  },
  {
    name: 'Marshall Stanmore III Bluetooth Home Speaker (Black)',
    brand: 'Marshall',
    categorySlug: 'electronics',
    price: 31999,
    originalPrice: 39999,
    discount: 20,
    stock: 16,
    rating: 4.8,
    numReviews: 410,
    description: 'Re-engineered for a wider, more immersive stereo soundstage with iconic vintage rock-and-roll styling.',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Amplifiers', value: 'One 50W Class D for woofer, two 15W for tweeters' },
      { key: 'Connectivity', value: 'Bluetooth 5.2, 3.5mm Aux, RCA' }
    ],
    tags: ['speaker', 'marshall', 'audio', 'bluetooth']
  },

  // FASHION (5 products)
  {
    name: 'Levi’s Men’s 511 Slim Fit Stretchable Denim Jeans (Dark Indigo)',
    brand: 'Levi’s',
    categorySlug: 'fashion',
    price: 2499,
    originalPrice: 4299,
    discount: 42,
    stock: 50,
    rating: 4.4,
    numReviews: 1850,
    description: 'A modern slim with room to move. The 511 Slim Fit Stretch Jeans are a classic since right now.',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Material', value: '99% Cotton, 1% Elastane' },
      { key: 'Fit', value: 'Slim fit from hip to ankle' },
      { key: 'Care', value: 'Machine wash cold inside out' }
    ],
    isDealOfTheDay: true,
    isBestSeller: true,
    tags: ['jeans', 'levis', 'denim', 'mens fashion']
  },
  {
    name: 'Nike Air Jordan 1 Low Retro Sneakers (White/Gym Red)',
    brand: 'Nike',
    categorySlug: 'fashion',
    price: 8995,
    originalPrice: 11495,
    discount: 22,
    stock: 24,
    rating: 4.8,
    numReviews: 920,
    description: 'Inspired by the 1985 original, the Air Jordan 1 Low offers a clean, classic look that is familiar yet always fresh.',
    images: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Upper', value: 'Genuine leather and synthetic materials' },
      { key: 'Sole', value: 'Encapsulated Air-Sole unit in heel' }
    ],
    isTrending: true,
    tags: ['nike', 'sneakers', 'jordan', 'shoes', 'footwear']
  },
  {
    name: 'Tommy Hilfiger Men Solid Cotton Casual Shirt (Navy Blue)',
    brand: 'Tommy Hilfiger',
    categorySlug: 'fashion',
    price: 2999,
    originalPrice: 4999,
    discount: 40,
    stock: 40,
    rating: 4.5,
    numReviews: 540,
    description: 'Crafted from pure breathable premium cotton with iconic Tommy Hilfiger flag embroidery on chest.',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Material', value: '100% Organic Pima Cotton' },
      { key: 'Collar', value: 'Spread Collar with button placket' }
    ],
    isBestSeller: true,
    tags: ['shirt', 'casual', 'tommy hilfiger', 'menswear']
  },
  {
    name: 'Ray-Ban Aviator Classic Polarized Sunglasses (Gold/Green)',
    brand: 'Ray-Ban',
    categorySlug: 'fashion',
    price: 9490,
    originalPrice: 11890,
    discount: 20,
    stock: 28,
    rating: 4.7,
    numReviews: 760,
    description: 'Timeless teardrop shape originally designed for aviators in 1937. Crystal clear polarized UV400 lenses.',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Frame', value: 'Gold Plated Metal Wire' },
      { key: 'Lens', value: 'G-15 Polarized Crystal Glass' }
    ],
    tags: ['sunglasses', 'ray-ban', 'aviator', 'eyewear']
  },
  {
    name: 'Puma Men’s Active Poly Tracksuit (Black/Gold)',
    brand: 'Puma',
    categorySlug: 'fashion',
    price: 3499,
    originalPrice: 5999,
    discount: 42,
    stock: 35,
    rating: 4.3,
    numReviews: 380,
    description: 'DryCELL moisture-wicking technology keeps you comfortable and dry during workouts or daily leisure.',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Material', value: '100% Recycled Polyester' },
      { key: 'Technology', value: 'Puma dryCELL' }
    ],
    tags: ['puma', 'sportswear', 'tracksuit', 'activewear']
  },

  // HOME (3 products)
  {
    name: 'Wakefit Orthopedic Memory Foam King Size Mattress (78x72x8 inch)',
    brand: 'Wakefit',
    categorySlug: 'home',
    price: 13999,
    originalPrice: 21999,
    discount: 36,
    stock: 20,
    rating: 4.7,
    numReviews: 3200,
    description: 'Engineered with Next-Gen Memory Foam to adapt to your body contours and provide ergonomic spinal support.',
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Dimensions', value: '78 x 72 x 8 inches (King Size)' },
      { key: 'Warranty', value: '10 Years Manufacturer Warranty' },
      { key: 'Material', value: 'High Density Resilient Foam + Memory Foam' }
    ],
    isDealOfTheDay: true,
    isBestSeller: true,
    tags: ['mattress', 'wakefit', 'furniture', 'bedding']
  },
  {
    name: 'Philips Smart Wi-Fi LED Ceiling Light 36W (Tunable White & Color)',
    brand: 'Philips',
    categorySlug: 'home',
    price: 3899,
    originalPrice: 5999,
    discount: 35,
    stock: 45,
    rating: 4.5,
    numReviews: 890,
    description: 'Transform your room ambience with 16 million colors and tunable white lights controlled via WiZ app or voice assistants.',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Wattage', value: '36W' },
      { key: 'Compatibility', value: 'Alexa, Google Assistant, Apple Siri Shortcuts' }
    ],
    isTrending: true,
    tags: ['philips', 'lighting', 'smart home', 'led']
  },
  {
    name: 'Solimo Solid Wood Engineered Coffee Table (Dark Walnut Finish)',
    brand: 'Solimo',
    categorySlug: 'home',
    price: 4499,
    originalPrice: 7999,
    discount: 44,
    stock: 18,
    rating: 4.3,
    numReviews: 420,
    description: 'Elegant contemporary coffee table with bottom storage shelf for magazines and remotes, treated against termites.',
    images: [
      'https://images.unsplash.com/photo-1533090161767-e6ffed986b88?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Material', value: 'High grade engineered wood' },
      { key: 'Finish', value: 'Walnut scratch-resistant finish' }
    ],
    tags: ['table', 'coffee table', 'furniture', 'living room']
  },

  // KITCHEN (4 products)
  {
    name: 'Philips Daily Collection 750W Mixer Grinder with 3 Jars (Pistil Red)',
    brand: 'Philips',
    categorySlug: 'kitchen',
    price: 3299,
    originalPrice: 4895,
    discount: 33,
    stock: 35,
    rating: 4.5,
    numReviews: 2100,
    description: 'Powerful 750W motor with advanced air ventilation for tough grinding of chutneys, batters, and dry spices.',
    images: [
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Power', value: '750 Watts' },
      { key: 'Jars', value: '1.5L Wet jar, 1.0L Multipurpose jar, 0.3L Chutney jar' },
      { key: 'Blades', value: 'High-grade stainless steel' }
    ],
    isBestSeller: true,
    tags: ['mixer', 'grinder', 'kitchen', 'appliances']
  },
  {
    name: 'Prestige Deluxe Hard Anodized 3-Piece Cookware Set',
    brand: 'Prestige',
    categorySlug: 'kitchen',
    price: 2799,
    originalPrice: 4200,
    discount: 33,
    stock: 40,
    rating: 4.6,
    numReviews: 1450,
    description: 'Set includes Fry Pan, Omni Tawa, and Kadai with Glass Lid. Gas and induction compatible with heavy-duty body.',
    images: [
      'https://images.unsplash.com/photo-1584990347449-399066601f78?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Compatibility', value: 'Gas & Induction base' },
      { key: 'Coating', value: 'Hard Anodized Non-toxic' }
    ],
    isDealOfTheDay: true,
    tags: ['cookware', 'prestige', 'kadai', 'tawa']
  },
  {
    name: 'Morphy Richards 24 Litre Digital Air Fryer Oven',
    brand: 'Morphy Richards',
    categorySlug: 'kitchen',
    price: 9999,
    originalPrice: 15995,
    discount: 37,
    stock: 22,
    rating: 4.7,
    numReviews: 530,
    description: 'Rapid 360 degree hot air circulation fries with up to 90% less oil. Multiple presets for baking, roasting, and toasting.',
    images: [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Capacity', value: '24 Litres' },
      { key: 'Programs', value: '12 Pre-set Cooking Functions' }
    ],
    isTrending: true,
    tags: ['air fryer', 'oven', 'healthy', 'cooking']
  },
  {
    name: 'Milton Thermosteel Flip Lid Insulated Flask 1000ml (Silver)',
    brand: 'Milton',
    categorySlug: 'kitchen',
    price: 949,
    originalPrice: 1290,
    discount: 26,
    stock: 60,
    rating: 4.5,
    numReviews: 3400,
    description: 'Double walled vacuum insulated flask keeps beverages hot or cold for 24 hours. Made with 100% rust-free food grade steel.',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Capacity', value: '1000 ml' },
      { key: 'Thermal Retention', value: 'Hot & Cold 24 Hours' }
    ],
    isBestSeller: true,
    tags: ['milton', 'flask', 'thermosteel', 'bottle']
  },

  // BEAUTY (3 products)
  {
    name: 'Minimalist 10% Niacinamide Face Serum with Zinc (30ml)',
    brand: 'Minimalist',
    categorySlug: 'beauty',
    price: 569,
    originalPrice: 599,
    discount: 5,
    stock: 80,
    rating: 4.6,
    numReviews: 4800,
    description: 'Pure 10% Niacinamide and Zinc PCA serum clinically proven to reduce blemishes, dark spots, and oiliness.',
    images: [
      'https://images.unsplash.com/photo-1608248597359-55365538e1e7?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Skin Type', value: 'All skin types, especially oily & acne-prone' },
      { key: 'Formula', value: 'Fragrance-free, Silicone-free, Paraben-free' }
    ],
    isBestSeller: true,
    tags: ['serum', 'skincare', 'niacinamide', 'minimalist']
  },
  {
    name: 'Dyson Supersonic Hair Dryer (Iron/Fuchsia)',
    brand: 'Dyson',
    categorySlug: 'beauty',
    price: 34900,
    originalPrice: 38900,
    discount: 10,
    stock: 12,
    rating: 4.9,
    numReviews: 890,
    description: 'Engineered for fast drying with intelligent heat control to protect natural shine and prevent extreme heat damage.',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Motor', value: 'Dyson V9 digital motor spins at 110,000 RPM' },
      { key: 'Attachments', value: '5 magnetic styling nozzles included' }
    ],
    isFeatured: true,
    tags: ['dyson', 'hair dryer', 'haircare', 'luxury']
  },
  {
    name: 'Forest Essentials Soundarya Radiance Cream with 24K Gold (50g)',
    brand: 'Forest Essentials',
    categorySlug: 'beauty',
    price: 5475,
    originalPrice: 6200,
    discount: 12,
    stock: 25,
    rating: 4.8,
    numReviews: 610,
    description: 'An Ayurvedic formulation infused with 24 Karat Gold Bhasma and SPF 25 to provide extraordinary skin luminosity and firmness.',
    images: [
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Key Ingredients', value: '24K Gold Bhasma, Pure Saffron, Cow Milk' },
      { key: 'Benefits', value: 'Anti-aging, Radiance, Sun Protection SPF 25' }
    ],
    tags: ['ayurveda', 'cream', 'gold', 'luxury beauty']
  },

  // GROCERY (3 products)
  {
    name: 'Tata Tea Gold Leaf Tea 1kg Poly Pack',
    brand: 'Tata Tea',
    categorySlug: 'grocery',
    price: 495,
    originalPrice: 620,
    discount: 20,
    stock: 100,
    rating: 4.7,
    numReviews: 4500,
    description: 'Exquisite blend of gently rolled aromatic long leaves and fine Assam tea grains for rich taste and aroma.',
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Quantity', value: '1000g' },
      { key: 'Origin', value: 'Assam, India' }
    ],
    isBestSeller: true,
    tags: ['tea', 'chai', 'tata', 'grocery', 'beverage']
  },
  {
    name: 'Happilo 100% Natural California Almonds 1kg Value Pack',
    brand: 'Happilo',
    categorySlug: 'grocery',
    price: 799,
    originalPrice: 1299,
    discount: 38,
    stock: 75,
    rating: 4.6,
    numReviews: 2900,
    description: 'Premium quality raw California almonds packed with protein, fiber, healthy fats, and Vitamin E.',
    images: [
      'https://images.unsplash.com/photo-1508061252445-5350f3ab0a55?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Weight', value: '1 Kg' },
      { key: 'Preservatives', value: 'Zero Added Preservatives or Chemicals' }
    ],
    isDealOfTheDay: true,
    tags: ['almonds', 'dry fruits', 'happilo', 'healthy']
  },
  {
    name: 'Organic India Tulsi Green Tea Classic (100 Infusion Bags Tin)',
    brand: 'Organic India',
    categorySlug: 'grocery',
    price: 685,
    originalPrice: 795,
    discount: 14,
    stock: 50,
    rating: 4.6,
    numReviews: 1200,
    description: 'Certified organic blend of Rama, Krishna, and Vana Tulsi with premium green tea for enhanced immunity and natural energy.',
    images: [
      'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Count', value: '100 Tea Bags' },
      { key: 'Certifications', value: 'USDA Organic, India Organic' }
    ],
    tags: ['green tea', 'tulsi', 'organic', 'detox']
  },

  // SPORTS (3 products)
  {
    name: 'Optimum Nutrition (ON) Gold Standard 100% Whey Protein Powder (Double Rich Chocolate, 2kg)',
    brand: 'Optimum Nutrition',
    categorySlug: 'sports',
    price: 6499,
    originalPrice: 8499,
    discount: 24,
    stock: 40,
    rating: 4.8,
    numReviews: 5400,
    description: 'World’s #1 selling whey protein. 24g of high quality protein per serving with 5.5g naturally occurring BCAAs.',
    images: [
      'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Serving Size', value: '1 Scoop (30.4g)' },
      { key: 'Protein per serving', value: '24 Grams' },
      { key: 'Net Weight', value: '2 Kg (4.4 lbs)' }
    ],
    isBestSeller: true,
    tags: ['whey', 'protein', 'fitness', 'gym', 'supplements']
  },
  {
    name: 'Yonex Astrox 99 Pro Graphite Badminton Racket (Strung, Cherry Sunburst)',
    brand: 'Yonex',
    categorySlug: 'sports',
    price: 15490,
    originalPrice: 19990,
    discount: 23,
    stock: 15,
    rating: 4.8,
    numReviews: 310,
    description: 'Head-heavy power racket engineered in Japan with Rotational Generator System and Namd graphite for lethal smashes.',
    images: [
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Weight / Grip', value: '4U (Avg 83g) G5' },
      { key: 'String Tension', value: '20 - 28 lbs' }
    ],
    isTrending: true,
    tags: ['badminton', 'yonex', 'racket', 'sports']
  },
  {
    name: 'Kobo Cast Iron Adjustable Dumbbell Set with Rubber Coating (20kg Set)',
    brand: 'Kobo',
    categorySlug: 'sports',
    price: 3699,
    originalPrice: 5999,
    discount: 38,
    stock: 30,
    rating: 4.5,
    numReviews: 670,
    description: 'High-durability cast iron plates with comfortable anti-slip steel spinlock bars for versatile strength training.',
    images: [
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Total Weight', value: '20 Kilograms' },
      { key: 'Contents', value: '4x 2.5kg, 4x 1.25kg plates, 2 spinlock bars' }
    ],
    tags: ['dumbbells', 'weights', 'workout', 'home gym']
  },

  // BOOKS (3 products)
  {
    name: 'Atomic Habits: An Easy & Proven Way to Build Good Habits by James Clear',
    brand: 'Random House',
    categorySlug: 'books',
    price: 499,
    originalPrice: 799,
    discount: 38,
    stock: 120,
    rating: 4.9,
    numReviews: 8900,
    description: 'Transform your life with tiny changes in behavior. Over 10 million copies sold worldwide.',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Author', value: 'James Clear' },
      { key: 'Format', value: 'Hardcover, 320 pages' },
      { key: 'Language', value: 'English' }
    ],
    isBestSeller: true,
    tags: ['book', 'atomic habits', 'self help', 'bestseller']
  },
  {
    name: 'The Psychology of Money by Morgan Housel',
    brand: 'Harriman House',
    categorySlug: 'books',
    price: 349,
    originalPrice: 499,
    discount: 30,
    stock: 90,
    rating: 4.8,
    numReviews: 6200,
    description: 'Timeless lessons on wealth, greed, and happiness doing well with money isn’t necessarily about what you know. It’s about how you behave.',
    images: [
      'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Author', value: 'Morgan Housel' },
      { key: 'Format', value: 'Paperback, 256 pages' }
    ],
    isDealOfTheDay: true,
    tags: ['finance', 'book', 'money', 'investing']
  },
  {
    name: 'Sapiens: A Brief History of Humankind by Yuval Noah Harari',
    brand: 'Vintage',
    categorySlug: 'books',
    price: 450,
    originalPrice: 650,
    discount: 31,
    stock: 65,
    rating: 4.7,
    numReviews: 4100,
    description: '100,000 years ago, at least six human species inhabited the earth. Today there is just one. Us. How did our species succeed in the battle for dominance?',
    images: [
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Author', value: 'Yuval Noah Harari' },
      { key: 'Format', value: 'Paperback, 512 pages' }
    ],
    tags: ['history', 'sapiens', 'anthropology', 'book']
  },

  // TOYS (3 products)
  {
    name: 'LEGO Icons Bouquet of Roses Botanical Collection Building Kit (10328)',
    brand: 'LEGO',
    categorySlug: 'toys',
    price: 5499,
    originalPrice: 6499,
    discount: 15,
    stock: 25,
    rating: 4.9,
    numReviews: 720,
    description: 'Craft a radiant floral centerpiece with 12 red roses in different blooming stages and 4 sprigs of baby’s breath with small white flowers.',
    images: [
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Piece Count', value: '822 pieces' },
      { key: 'Age Group', value: '18+ Adult Building Set' }
    ],
    isTrending: true,
    tags: ['lego', 'botanical', 'toys', 'creativity', 'model']
  },
  {
    name: 'Hasbro Gaming Monopoly Deluxe Edition Board Game',
    brand: 'Hasbro',
    categorySlug: 'toys',
    price: 1899,
    originalPrice: 2499,
    discount: 24,
    stock: 40,
    rating: 4.7,
    numReviews: 1890,
    description: 'The fast-dealing property trading game where players buy, sell, dream, and scheme their way to riches.',
    images: [
      'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Players', value: '2 to 8 Players' },
      { key: 'Age', value: '8 Years & Above' }
    ],
    isBestSeller: true,
    tags: ['monopoly', 'board game', 'hasbro', 'family']
  },
  {
    name: 'Hot Wheels 10-Car Pack Die-Cast Vehicles Collection',
    brand: 'Hot Wheels',
    categorySlug: 'toys',
    price: 1499,
    originalPrice: 1999,
    discount: 25,
    stock: 55,
    rating: 4.8,
    numReviews: 2400,
    description: 'Since their debut in 1968, Hot Wheels vehicles have been an enduring favorite of collectors, car enthusiasts, and racing fans of all ages.',
    images: [
      'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=700&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { key: 'Scale', value: '1:64 Die-cast vehicles' },
      { key: 'Contents', value: '10 Authentic Hot Wheels cars' }
    ],
    tags: ['hot wheels', 'cars', 'die-cast', 'toys']
  }
];

module.exports = {
  categoriesData,
  productsRawData
};
