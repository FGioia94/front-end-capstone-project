# notAnEcommerceClone

A React-based e-commerce application with an innovative game mode twist. This project combines traditional online shopping functionality with an interactive gaming experience where products behave like blocks falling down! Built as my front-end course capstone project at EPICODE.

## 🎯 Overview

notAnEcommerceClone is a full-featured e-commerce platform that fetches real product data from the Fake Store API. Users can browse, search, filter, and purchase products just like any traditional online store (Well, not really purchase as no payment gateway is implemented - i thought that wasa bit out of scope). But here's the twist: switch to Game Mode and the shopping experience becomes an arcade-style game where you dodge falling products while they rain down from above!

## ✨ Features

### Product Browsing & Shopping
- **Product Catalog**: Browse a complete catalog of products fetched from the Fake Store API
- **Advanced Search**: Real-time search functionality to find products quickly
- **Price Filtering**: Filter products by price range with an intuitive slider interface
- **Sorting Options**: Sort products by price, title, category, or rating
- **Product Details**: View detailed product information including images, descriptions, and ratings
- **Shopping Cart**: 
  - Add products to cart with automatic quantity management
  - Update quantities or remove items
  - Cart persists across sessions using sessionStorage
  - Real-time cart total calculation

### User Authentication
- **Registration System**: Create new user accounts with username and password
- **Login/Logout**: Secure authentication with persistent sessions using localStorage - There are three types of users: Not logged in, standard login, admin login, with different permissions.
- **Role-Based Access**: Support for regular users and admin roles
- **User Context**: Global user state management for seamless auth experience

### Game Mode 🎮
- **Interactive Gameplay**: Products fall from the top of the screen at varying speeds
- **Player Controls**: Move your player left and right to avoid colliding with falling products
- **Collision Detection**: collision physics between player and products
- **Score Tracking**: Earn points for survival time
- **Speed Control**: Adjust game speed with a real-time slider
- **Pause/Resume**: Pause the game at any time
- **High Score System**: Track and display high scores with persistence
- **Game Over State**: Clear game over UI with score display and restart options

### Admin Features
- **Admin Dashboard**: Special control panel visible only to admin users
- **Background Controls**: Customize the game field background
- **Enhanced Permissions**: Additional controls and settings for store management

### Responsive Design
- **Mobile-Friendly**: Fully responsive layout that works on all device sizes
- **Bootstrap Integration**: Professional UI components and styling
- **Custom CSS**: Tailored styling for unique components and game elements
- **Adaptive Controls**: Player size and controls adjust for mobile devices

## 🛠️ Tech Stack

### Core Technologies
- **React 19.2.0** - Modern React with latest features and hooks
- **Redux Toolkit 2.11.2** - Centralized state management with slices
- **React Redux 9.2.0** - React bindings for Redux
- **React Router 7.11.0** - Client-side routing and navigation

### UI & Styling
- **Bootstrap 5.3.8** - Responsive component library
- **React Bootstrap 2.10.10** - Bootstrap components as React components
- **normalize.css** - CSS reset for consistent styling across browsers
- **Custom CSS** - Component-specific styling

### External APIs
- **Fake Store API** - Product data source (https://fakestoreapi.com)

## 📁 Project Structure

```
notAnEcommerceClone/
├── public/                      # Static assets
├── src/
│   ├── assets/                 # Images, fonts, and other assets
│   ├── components/             # React components
│   │   ├── AdminBackgroundPanel/   # Admin background customization
│   │   ├── Cart/                    # Shopping cart component
│   │   ├── Checkout/                # Checkout process
│   │   ├── Contacts/                # Contact information
│   │   ├── ControlPanel/            # Game control panel
│   │   ├── CustomNavbar/            # Navigation bar
│   │   ├── GameField/               # Main game/product display
│   │   ├── Login/                   # Login form
│   │   ├── Player/                  # Game player component
│   │   ├── PriceFilter/             # Price range filter
│   │   ├── ProductCard/             # Individual product card
│   │   ├── ProductDetail/           # Detailed product view
│   │   ├── Register/                # Registration form
│   │   ├── SearchBar/               # Product search
│   │   ├── SearchResult/            # Search results display
│   │   ├── SortControls/            # Product sorting controls
│   │   └── SpeedSlider/             # Game speed control
│   ├── context/                # React Context providers
│   │   └── UserContext.jsx         # User authentication context
│   ├── store/                  # Redux store configuration
│   │   ├── index.js               # Store setup
│   │   └── slices/                # Redux slices
│   │       ├── cartSlice.js       # Shopping cart state
│   │       ├── productsSlice.js   # Products state & API calls
│   │       └── userSlice.js       # User authentication state
│   ├── utils/                  # Utility functions
│   │   ├── highscoreUtils.js     # High score management
│   │   └── mathUtils.js          # Math helpers for game
│   ├── App.jsx                 # Main App component
│   ├── App.css                 # Global app styles
│   ├── main.jsx                # Application entry point
│   └── index.css               # Global CSS
├── eslint.config.js            # ESLint configuration
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
└── README.md                   # This file
```

## 🎮 How to Use

### Shopping Mode

1. **Browse Products**: Scroll through the product catalog on the main page
2. **Search**: Use the search bar to find specific products
3. **Filter**: Adjust the price range slider to filter products by price
4. **Sort**: Use sorting controls to organize products by price, title, category, or rating
5. **View Details**: Click on any product card to see detailed information
6. **Add to Cart**: Click "Add to Cart" on product cards
7. **Manage Cart**: 
   - Click the cart icon in the navbar to view your cart
   - Adjust quantities using the +/- buttons
   - Remove items with the remove button
8. **Checkout**: Proceed to checkout from the cart page

### Game Mode

1. **Enable Game Mode**: Toggle the "Game Mode" switch in the control panel
2. **Controls**: 
   - Use **Arrow Keys** (← →) or finger touch in mobile mode to move the player left and right
   - Products fall from the top of the screen
   - Avoid colliding with falling products
3. **Speed Control**: Adjust game speed using the speed slider
4. **Pause**: Click the pause button or press **Space** to pause the game
5. **Score**: Your score increases the longer you survive
6. **Game Over**: When you collide with a product, the game ends and displays your score
7. **High Scores**: Your best scores are saved and displayed

### User Accounts

**Regular User**:
- Create an account or login to save your cart
- Track your orders and checkout history
- Access personalized features

**Admin User**:
- All regular user features
- Access to admin control panel
- Customize game field background
- Additional store management options



## 🏗️ State Management

### Redux Store

The application uses Redux Toolkit for centralized state management with three main slices:

1. **Products Slice** (`productsSlice.js`)
   - Manages product catalog
   - Handles async product fetching from Fake Store API
   - Loading and error states

2. **Cart Slice** (`cartSlice.js`)
   - Shopping cart items and quantities
   - Cart operations (add, remove, update, clear)
   - SessionStorage persistence

3. **User Slice** (`userSlice.js`)
   - User authentication state
   - Login/logout actions
   - Role-based access control
   - LocalStorage persistence

## 🎨 Styling Approach

- **Component-Level CSS**: Each component has its own CSS file for isolated styling
- **Bootstrap/React Bootstrap Framework**: Provides responsive grid, buttons, forms, and modals
- **Custom CSS Variables**: Used for consistent theming

## 🔒 Data Persistence

- **Cart Data**: Stored in `sessionStorage` - persists during browser session
- **User Data**: Stored in `localStorage` - persists across browser sessions
- **High Scores**: Stored in `localStorage` - permanent score tracking

## 🐛 Known Issues & Future Improvements

- [ ] Add more game modes and difficulty levels
- [ ] Speed don't always reset correctly when playing again
- [ ] Collisions fail at times
- [ ] User profile pages with order history
- [ ] Product reviews and ratings system
- [ ] Wishlist functionality

