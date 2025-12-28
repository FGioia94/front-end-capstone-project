import { createSlice } from '@reduxjs/toolkit';

// Load user from localStorage
const loadUserFromStorage = () => {
  try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    return null;
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: loadUserFromStorage(),
    isLoggedIn: !!loadUserFromStorage(),
  },
  reducers: {
    login: (state, action) => {
      const { username, role = 'user' } = action.payload;
      const userData = { username, role, loginTime: new Date().toISOString() };
      state.user = userData;
      state.isLoggedIn = true;
      localStorage.setItem('user', JSON.stringify(userData));
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem('user');
    },
  },
});

export const { login, logout } = userSlice.actions;

// Selectors
export const selectUser = (state) => state.user.user;
export const selectIsLoggedIn = (state) => state.user.isLoggedIn;
export const selectIsAdmin = (state) => state.user.user?.role === 'admin';
export const selectIsUser = (state) => state.user.user?.role === 'user';

export default userSlice.reducer;
