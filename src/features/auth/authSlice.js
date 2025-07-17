import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  status: 'idle',
  error: null,
};

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Failed to fetch user');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials) => {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, credentials);
    return response.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },

    updateFollowing: (state, action) => {
      const { targetId } = action.payload;
      if (!state.user) return;

      const isFollowing = state.user.following.includes(targetId);
      if (isFollowing) {
        state.user.following = state.user.following.filter((id) => id !== targetId);
      } else {
        state.user.following.push(targetId);
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = { ...action.payload };
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.user = null;
        state.error = action.payload;
      });
  },
});

export const { logout, updateFollowing } = authSlice.actions;
export default authSlice.reducer;
