# 🌶️ Seasoned - E-Commerce with Game Mode

A modern, interactive e-commerce web application built with React that transforms online shopping into an engaging gaming experience. Browse high-end culinary products in a beautiful interface, or challenge yourself in Game Mode where you dodge falling products while shopping!

## 🎮 Features

### Product Browsing
- **Product Catalog**: Browse a curated selection of premium culinary products
- **Search Functionality**: Real-time search with instant results
- **Advanced Filtering**: Filter products by price range
- **Sorting Options**: Sort by name (A-Z, Z-A) or price (low-high, high-low)
- **Product Details**: Detailed view for each product with full descriptions
- **Shopping Cart**: Add items to cart, adjust quantities, remove items
- **Checkout System**: Complete purchase flow with order summary

### Game Mode 🕹️
- **Interactive Gameplay**: Dodge falling products while browsing
- **Progressive Difficulty**: Speed increases over time for added challenge
- **Score Tracking**: Compete for high scores
- **Collision Detection**: Sophisticated physics for smooth gameplay
- **Pause/Resume**: Press ESC to pause/resume game
- **Danger Indicator**: Products glow red when close to the player
- **Mobile Responsive**: Optimized controls for touch devices

### Admin Features 👑
- **Speed Control**: Adjust game speed (1x - 3x multiplier)
- **Background Customization**: Choose from 5 dynamic color palettes
  - Vibrant (purple/red/yellow)
  - Cool (blue/cyan/purple)
  - Warm (orange/red/yellow)
  - Sunset (pink/orange/yellow)
  - Forest (green tones)
- **Opacity Control**: Fine-tune background transparency (0-100%)
- **Dark Mode UI**: Automatic dark theme with high-contrast buttons
- **Admin Badge**: Visible ⚡ Admin Mode indicator

### User Experience
- **Authentication**: Login/Register system with role-based access
- **Session Persistence**: Cart and user state persist across sessions
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile
- **Loading States**: Skeleton screens for better perceived performance
- **Smooth Animations**: Polished transitions and micro-interactions

## 🛠️ Tech Stack

- **React 19.2.0** - Latest React with improved hooks and performance
- **Redux Toolkit 2.11.2** - Modern Redux with built-in Thunk middleware
- **React Redux 9.2.0** - React bindings for Redux
- **React Router 7.11.0** - Client-side routing and navigation
- **React Bootstrap 2.10.10** - UI components with Bootstrap styling
- **Vite 7.2.4** - Fast build tool with HMR
- **SWC** - Lightning-fast JavaScript/TypeScript compiler

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/front-end-capstone-project.git
   cd front-end-capstone-project/seasoned
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🚀 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## 👨‍💼 Admin Access

To test admin features, see [ADMIN_ACCESS.md](./ADMIN_ACCESS.md) for detailed instructions.

**Quick admin setup:**
1. Open browser console (F12)
2. Run:
   ```javascript
   localStorage.setItem('user', JSON.stringify({username: 'admin', role: 'admin', loginTime: new Date().toISOString()}))
   ```
3. Refresh the page

## 📁 Project Structure

```
seasoned/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, icons
│   ├── components/      # React components
│   │   ├── Cart/        # Shopping cart component
│   │   ├── ControlPanel/ # Game controls
│   │   ├── CustomNavbar/ # Navigation bar
│   │   ├── GameField/   # Main game/product display
│   │   ├── Player/      # Game player character
│   │   ├── ProductCard/ # Product display cards
│   │   └── SortControls/ # Sorting interface
│   ├── store/           # Redux store configuration
│   │   └── slices/      # Redux slices (cart, products, user)
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main app component
│   ├── App.css          # Global styles
│   └── main.jsx         # Application entry point
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
└── vite.config.js       # Vite configuration
```

## 🎯 Key Features Explained

### State Management
- **Redux Store**: Centralized state with three slices (products, cart, user)
- **Session Persistence**: Cart automatically saves to sessionStorage
- **Auth Persistence**: User session stored in localStorage

### Performance Optimizations
- **Memoized Selectors**: Combined Redux selectors to reduce subscriptions
- **useCallback Hooks**: Prevent unnecessary re-renders
- **Inline Ref Syncing**: Eliminates redundant useEffect hooks
- **Conditional Rendering**: Smart component mounting/unmounting

### Game Mechanics
- **Collision Detection**: Precise AABB collision detection
- **Collision Resolution**: Iterative algorithm prevents product overlap
- **Dynamic Positioning**: Seeded random positioning for consistency
- **Progressive Difficulty**: Speed multiplier increases over time
- **Respawn System**: Products respawn at top when reaching bottom

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is part of the EPICODE Front-End Development course capstone project.

## 🤝 Contributing

This is an educational project. Feel free to fork and experiment!

## 📧 Contact

For questions or feedback about this project, please reach out through the course channels.

---

**Built with ❤️ and ☕ as part of the EPICODE Front-End Development Course**
