import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const userLogin = createAsyncThunk('user/login', async (request) => {
  try {
    const response = await axios.post('http://localhost:8000/login/', request);
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    window.location.href = '/';
    return { isAuthenticated: true, user: response.data.user };
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
});

export const logoutUser = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  return { type: 'LOGOUT_USER' }; // Explicitly define the action type
};

export const refreshToken = createAsyncThunk('user/refresh', async (_, { getState }) => {
  const state = getState();
  const { refresh_token } = state.user;

  if (!refresh_token || !state.isAuthenticated) {
    return { isAuthenticated: false };
  }

  try {
    const response = await axios.post('http://localhost:8000/token/refresh/', {
      refresh: refreshToken,
    });

    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
    }

    return { isAuthenticated: true };
  } catch (error) {
    console.error('Error refreshing token:', error);
    return { isAuthenticated: false };
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isAuthenticated: !!localStorage.getItem('access_token'),
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.error.message;
      })
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = action.payload.isAuthenticated;
        state.user = action.payload.user || null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.error.message;
      })
      .addCase({ type: 'LOGOUT_USER' }, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
        state.error = null;
      });
  },
});

export default userSlice.reducer;