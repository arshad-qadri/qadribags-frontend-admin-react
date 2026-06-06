import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export const fetchLowStockProductCount = createAsyncThunk(
  "inventory/fetchLowStockProductCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(
        "/inventory/low-stock-product-count",
      );

      return response.data?.data?.lowStock || {};
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch inevtory category.",
      );
    }
  },
);

const initialState = {
  count: 0,
  loading: false,
  error: null,
};

const lowStockProductCountSlice = createSlice({
  name: "lowStockProductCountSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLowStockProductCount.pending, (state) => {
      state.loading = true;
      state.count = 0 ;
      state.error = null;
    });
    builder.addCase(fetchLowStockProductCount.fulfilled, (state, action) => {
      state.loading = false;
      state.count = action.payload;
      state.error = null;
    });
    builder.addCase(fetchLowStockProductCount.rejected, (state, action) => {
      state.loading = false;
      state.count = 0;
      state.error = action.payload;
    });
  },
});

export default lowStockProductCountSlice.reducer;
