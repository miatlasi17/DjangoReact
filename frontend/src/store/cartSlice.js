// src/store/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define async thunk for fetching cart data
export const fetchCartData = createAsyncThunk('cart/fetchCartData', async () => {
  try {
    const response = await axios.get('http://localhost:8000/cart/', {
      withCredentials: true, // Important for including cookies
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
});

// Create a slice for cart
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total_price: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartData.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.total_price = action.payload.total_price || 0;
      })
      .addCase(fetchCartData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default cartSlice.reducer;
