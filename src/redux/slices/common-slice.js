// src/redux/slices/common-slice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import Api from "../../dependencies/instanceAxios";

export const fetchCategories = createAsyncThunk(
  "common/fetchCategories",
  async (_, thunkAPI) => {
    try {
      const response = await Api.get(`categories`);
      return response?.data.data ?? [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const commonSlice = createSlice({
  name: "common",
  initialState: {
    categories: [],
    isLoadingCategories: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoadingCategories = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoadingCategories = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoadingCategories = false;
        state.error = action.payload || "Failed to fetch categories";
      });
  },
});

export default commonSlice.reducer;
