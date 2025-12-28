import { createSlice } from '@reduxjs/toolkit';

// Load cart from sessionStorage
const loadCartFromStorage = () => {
  try {
    const stored = sessionStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
};

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCartFromStorage(),
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }

      // Sync with sessionStorage
      sessionStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
      sessionStorage.setItem('cart', JSON.stringify(state.items));
    },
    updateCartQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
        sessionStorage.setItem('cart', JSON.stringify(state.items));
      }
    },
    clearCart: (state) => {
      state.items = [];
      sessionStorage.removeItem('cart');
    },
    setCart: (state, action) => {
      state.items = action.payload;
      sessionStorage.setItem('cart', JSON.stringify(state.items));
    },
  },
});

export const { addToCart, removeFromCart, updateCartQuantity, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
