# ShopKart - Full-Stack MERN E-Commerce Marketplace

ShopKart is a complete, production-ready full-stack e-commerce marketplace built using the **MERN** stack (MongoDB, Express.js, React, Node.js). It features modern marketplace UI inspired by premier Indian e-commerce platforms, including full-text product search, category navigation, multi-faceted filtering, persistent cart, wishlist, multi-step checkout, real-time order tracking, review rating aggregations, and an administrative dashboard with analytics.

---

## 📸 Key Features

### 🛍️ Customer Experience
- **Dynamic Homepage**: Hero promotional banner carousel, 10 category chips, Deals of the Day with live countdown timer, Best Sellers, Trending items, and curated customer recommendations.
- **Product Listing & Filtering**: Multi-faceted filter sidebar by Category, Brand, Price Range, Minimum Rating, and Discount %, with server-side sorting (Price Low to High, High to Low, Highest Rated, Newest, Popularity) and pagination.
- **Product Details Showcase**: Multi-image thumbnail gallery, specifications key-value table, bank offers, delivery PIN-code checker, live stock indicator, quantity selector, and related products recommendations.
- **Verified Customer Reviews**: 5-star rating submission with aggregate rating recalculation directly synced in MongoDB.
- **Shopping Cart**: Real-time server-persisted cart supporting quantity increments, item removals, Save for Later, and automated price breakdown (MRP, discounts, free delivery threshold calculation).
- **Wishlist**: One-tap wishlist toggle persisted to the user's MongoDB document with immediate "Move to Cart" support.
- **Multi-Step Checkout**: Saved addresses selection, add new delivery address form with PIN code and landmark, Order Summary review, and payment method selection (Cash on Delivery or Instant Online Simulation).
- **Order Tracking**: Visual 6-stage delivery timeline (`Order Placed` ➔ `Confirmed` ➔ `Packed` ➔ `Shipped` ➔ `Out for Delivery` ➔ `Delivered`), order history, and self-serve cancellation with automated inventory stock restoration.
- **Authentication**: JWT token-based auth with bcrypt password hashing, session persistence, and profile address management.

### 🛡️ Administrator Panel (`/admin`)
- **Executive Dashboard**: Live revenue totals, orders count, customers count, and inventory metrics with Category Revenue Distribution progress bars and Orders by Status distribution.
- **Catalog Management (`/admin/products`)**: Create, Read, Update, and Delete (CRUD) products with image URLs, specifications, prices, discounts, and inventory stock.
- **Order Fulfillment (`/admin/orders`)**: View all customer shipments, filter by lifecycle status, view shipping details, and update tracking stages with automatic customer timeline synchronization.
- **Customer Administration (`/admin/users`)**: Search registered users, view purchase counts, toggle admin privileges, and activate/deactivate accounts.

---

## 🗂️ Project Structure

```
shopkart/
├── client/                               # Frontend (React 18 + Vite + Tailwind CSS)
│   ├── public/
│   │   └── favicon.svg                   # ShopKart brand favicon
│   ├── src/
│   │   ├── assets/                       # Static brand assets
│   │   ├── components/
│   │   │   ├── common/                   # Shared UI (Badge, Modal, Pagination, RatingStars, Toast)
│   │   │   ├── layout/                   # Navbar, CategoryNav, Footer, MobileBottomNav
│   │   │   ├── product/                  # ProductCard, ProductFilterSidebar
│   │   │   └── routes/                   # ProtectedRoute, AdminRoute
│   │   ├── context/                      # AuthContext, CartContext, WishlistContext, ToastContext
│   │   ├── layouts/                      # MainLayout, AdminLayout
│   │   ├── pages/                        # HomePage, ProductListing, ProductDetails, Cart, Checkout,
│   │   │                                 # Orders, OrderDetails, Wishlist, Login, Register, Profile,
│   │   │                                 # AdminDashboard, AdminProducts, AdminOrders, AdminUsers
│   │   ├── services/
│   │   │   └── api.js                    # Axios instance with JWT interceptors & REST methods
│   │   ├── utils/
│   │   │   └── formatters.js             # INR Currency (₹), date, and discount formatters
│   │   ├── App.jsx                       # Main client application router
│   │   ├── index.css                     # Tailwind CSS entry with custom scrollbars
│   │   └── main.jsx                      # React DOM root entry
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── .env.example
│
├── server/                               # Backend (Node.js + Express + MongoDB/Mongoose)
│   ├── config/
│   │   └── db.js                         # MongoDB connection with zero-setup embedded fallback
│   ├── controllers/
│   │   ├── adminController.js            # Admin analytics metrics, orders, user management
│   │   ├── authController.js             # Register, login, profile, addresses
│   │   ├── cartController.js             # Cart CRUD, save-for-later, move-to-cart
│   │   ├── categoryController.js         # Category CRUD & product counts
│   │   ├── orderController.js            # Order placement, status tracking, cancellation
│   │   ├── productController.js          # Product search, facet filters, sorting, CRUD
│   │   ├── reviewController.js           # Reviews submission & ratings aggregation
│   │   └── wishlistController.js         # Wishlist toggle & items sync
│   ├── middleware/
│   │   ├── authMiddleware.js             # JWT verification (protect) & Admin role check (adminOnly)
│   │   └── errorMiddleware.js            # Central error handler & CastError / duplicate key handling
│   ├── models/
│   │   ├── Cart.js                       # Cart schema with active and saved-for-later items
│   │   ├── Category.js                   # Category schema with slug generation
│   │   ├── Order.js                      # Order schema with shipping, items, status history
│   │   ├── Product.js                    # Product schema with full-text search & specs
│   │   ├── Review.js                     # Review schema with compound index & rating aggregation
│   │   └── User.js                       # User schema with bcrypt password hashing & addresses
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── wishlistRoutes.js
│   ├── seed/
│   │   ├── seedData.js                   # 10 categories, 38 realistic products with specs
│   │   └── seeder.js                     # Database seeding script with demo orders & reviews
│   ├── utils/
│   │   └── jwt.js                        # JWT token creation and verification
│   ├── server.js                         # Main Express application server
│   ├── test_e2e.js                       # Comprehensive 24-step automated test suite
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@example.com` | `Admin@123` | Full Admin Console (`/admin`), Product CRUD, Order Status Updates, User Management |
| **Demo Customer** | `user@example.com` | `User@123` | Shopping, Saved Addresses, Cart, Wishlist, Order History |

> **Tip**: The login page has **One-Click Demo Buttons** ("Demo Admin" and "Demo Customer") to instantly prefill credentials for rapid testing.

---

## ⚙️ Environment Variables

### Backend (`shopkart/server/.env`)
```ini
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/shopkart
JWT_SECRET=shopkart_super_secret_jwt_key_2026_secured
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```
*(Note: If no local MongoDB is running, the server automatically boots an embedded MongoDB engine out of the box with zero setup required).*

### Frontend (`shopkart/client/.env`)
```ini
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Installation & Running

### 1. Backend Server Setup
```bash
cd shopkart/server
npm install
npm run seed     # Populates 10 categories, 38 products, demo accounts, and sample orders
npm run dev      # Starts Express server on http://localhost:5000
```

### 2. Frontend Client Setup
In a new terminal window:
```bash
cd shopkart/client
npm install
npm run dev      # Starts Vite React dev server on http://localhost:5173
```

### 3. Run Automated End-to-End Tests
To test the complete 24-step user & admin lifecycle (Register ➔ Login ➔ Search ➔ Filter ➔ Cart ➔ Checkout ➔ Order Tracking ➔ Admin CRUD ➔ Reviews):
```bash
cd shopkart/server
node test_e2e.js
```

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve authenticated user profile & wishlist |
| `PUT` | `/api/auth/profile` | Private | Update user name, phone, or password |
| `POST` | `/api/auth/address` | Private | Add new shipping address |
| `PUT` | `/api/auth/address/:id` | Private | Edit existing shipping address |
| `DELETE` | `/api/auth/address/:id` | Private | Delete shipping address |

### Products (`/api/products`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Public | List products with search, category, brand, min/max price, rating, discount, sort & pagination |
| `GET` | `/api/products/featured` | Public | Get Deals of the Day, Best Sellers, Trending, Recommended |
| `GET` | `/api/products/:id` | Public | Get product details with specifications & related items |
| `POST` | `/api/products` | Admin | Create a new catalog product |
| `PUT` | `/api/products/:id` | Admin | Update product details, stock, or price |
| `DELETE` | `/api/products/:id` | Admin | Permanently delete product |

### Categories (`/api/categories`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | Public | List all 10 categories with product count badges |
| `POST` | `/api/categories` | Admin | Create category |
| `PUT` | `/api/categories/:id` | Admin | Update category |
| `DELETE` | `/api/categories/:id` | Admin | Delete category (protected against active products) |

### Cart (`/api/cart`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cart` | Private | Get user's cart items, saved items, and calculated totals |
| `POST` | `/api/cart` | Private | Add product with quantity to active cart |
| `PUT` | `/api/cart/:productId` | Private | Update item quantity in cart |
| `DELETE` | `/api/cart/:productId` | Private | Remove item from cart |
| `DELETE` | `/api/cart` | Private | Clear all items from active cart |
| `POST` | `/api/cart/save-for-later/:productId` | Private | Move item to Save for Later list |
| `POST` | `/api/cart/move-to-cart/:productId` | Private | Move saved-for-later item back to active cart |

### Wishlist (`/api/wishlist`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/wishlist` | Private | Get populated wishlist products |
| `POST` | `/api/wishlist/:productId` | Private | Add product to wishlist |
| `DELETE` | `/api/wishlist/:productId` | Private | Remove product from wishlist |

### Orders (`/api/orders`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Private | Validate stock, save order, decrement inventory, clear cart |
| `GET` | `/api/orders` | Private | List all past orders of current customer |
| `GET` | `/api/orders/:id` | Private | Get single order details with status tracking history |
| `PUT` | `/api/orders/:id/cancel` | Private | Cancel order & restore inventory stock |

### Reviews (`/api/products/:id/reviews` & `/api/reviews`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products/:id/reviews` | Public | Get all reviews for a product |
| `POST` | `/api/products/:id/reviews` | Private | Post/update review & trigger automatic rating recalculation |
| `PUT` | `/api/reviews/:id` | Private | Edit review |
| `DELETE` | `/api/reviews/:id` | Private/Admin | Remove review |

### Administrator API (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard` | Admin | Revenue metrics, order breakdown, category analytics |
| `GET` | `/api/admin/orders` | Admin | View all orders across all customers with status filter |
| `PUT` | `/api/admin/orders/:id/status` | Admin | Update order status (`Packed`, `Shipped`, `Delivered`, etc.) |
| `GET` | `/api/admin/users` | Admin | List all registered users with purchase statistics |
| `PUT` | `/api/admin/users/:id/role` | Admin | Change user role between `user` and `admin` |
| `PUT` | `/api/admin/users/:id/status` | Admin | Deactivate or activate customer accounts |

---

## 🔄 How Frontend Communicates with Backend

1. **Central Axios API Layer (`src/services/api.js`)**:
   All HTTP communication is routed through a configured Axios instance pointing to `VITE_API_URL` (default `http://localhost:5000/api`).
2. **Automatic JWT Authorization via Interceptors**:
   Whenever a user signs in, their JWT token is stored in browser `localStorage`. An Axios request interceptor attaches the token as `Authorization: Bearer <token>` on all outgoing requests.
3. **Session & Error Management**:
   An Axios response interceptor monitors for HTTP `401 Unauthorized`. If a token expires on a protected route, the session is cleared automatically.
4. **State Synchronization via React Context**:
   - `AuthContext`: Maintains active user state, profile data, and provides address management.
   - `CartContext`: Automatically synchronizes cart changes directly with MongoDB and refreshes item badges across the navbar.
   - `WishlistContext`: Persists liked products in MongoDB and coordinates heart icons and move-to-cart workflows.
   - `ToastContext`: Displays feedback toasts on API operations (e.g. items added, quantities updated, orders confirmed).
5. **CORS & Secure Headers**:
   Express server is configured with `cors({ origin: process.env.CLIENT_URL, credentials: true })`, preventing unauthorized cross-origin requests while ensuring secure data transfer.
