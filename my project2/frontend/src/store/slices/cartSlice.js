import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/cart`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/cart/add`, { productId, quantity });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add to cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/cart/update/${productId}`, { quantity });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update cart item');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/cart/remove/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to remove from cart');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/cart/clear`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to clear cart');
    }
  }
);

export const applyCoupon = createAsyncThunk(
  'cart/applyCoupon',
  async ({ couponCode, discount }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/cart/apply-coupon`, { couponCode, discount });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to apply coupon');
    }
  }
);

export const removeCoupon = createAsyncThunk(
  'cart/removeCoupon',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/cart/remove-coupon`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to remove coupon');
    }
  }
);

export const getCartSummary = createAsyncThunk(
  'cart/getCartSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/cart/summary`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to get cart summary');
    }
  }
);

const initialState = {
  items: [],
  coupon: null,
  subtotal: 0,
  discount: 0,
  total: 0,
  itemCount: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        const cart = action.payload.cart;
        state.items = cart.items || [];
        state.coupon = cart.coupon;
        state.subtotal = cart.subtotal || 0;
        state.discount = cart.discountAmount || 0;
        state.total = cart.total || 0;
        state.itemCount = cart.totalItems || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        const cart = action.payload.cart;
        state.items = cart.items || [];
        state.coupon = cart.coupon;
        state.subtotal = cart.subtotal || 0;
        state.discount = cart.discountAmount || 0;
        state.total = cart.total || 0;
        state.itemCount = cart.totalItems || 0;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Cart Item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        const cart = action.payload.cart;
        state.items = cart.items || [];
        state.coupon = cart.coupon;
        state.subtotal = cart.subtotal || 0;
        state.discount = cart.discountAmount || 0;
        state.total = cart.total || 0;
        state.itemCount = cart.totalItems || 0;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        const cart = action.payload.cart;
        state.items = cart.items || [];
        state.coupon = cart.coupon;
        state.subtotal = cart.subtotal || 0;
        state.discount = cart.discountAmount || 0;
        state.total = cart.total || 0;
        state.itemCount = cart.totalItems || 0;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.coupon = null;
        state.subtotal = 0;
        state.discount = 0;
        state.total = 0;
        state.itemCount = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Apply Coupon
      .addCase(applyCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.loading = false;
        const cart = action.payload.cart;
        state.items = cart.items || [];
        state.coupon = cart.coupon;
        state.subtotal = cart.subtotal || 0;
        state.discount = cart.discountAmount || 0;
        state.total = cart.total || 0;
        state.itemCount = cart.totalItems || 0;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove Coupon
      .addCase(removeCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCoupon.fulfilled, (state, action) => {
        state.loading = false;
        const cart = action.payload.cart;
        state.items = cart.items || [];
        state.coupon = cart.coupon;
        state.subtotal = cart.subtotal || 0;
        state.discount = cart.discountAmount || 0;
        state.total = cart.total || 0;
        state.itemCount = cart.totalItems || 0;
      })
      .addCase(removeCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Cart Summary
      .addCase(getCartSummary.fulfilled, (state, action) => {
        const summary = action.payload.summary;
        state.subtotal = summary.subtotal || 0;
        state.discount = summary.discount || 0;
        state.total = summary.total || 0;
        state.itemCount = summary.itemCount || 0;
      });
  },
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;
