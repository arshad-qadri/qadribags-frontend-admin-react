import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export const fetchAvailableStockAndProductCount = createAsyncThunk(
  "inventory/fetchAvailableStockAndProductCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(
        "/inventory/total-available-stock-product-count",
      );

      return response.data?.data || {};
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch inevtory category.",
      );
    }
  },
);

const initialState = {
  stockAndProductCount: null,
  loading: false,
  error: null,
};

const availableStockAndProductCountSlice = createSlice({
  name: "availableStockAndProductCountSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAvailableStockAndProductCount.pending, (state) => {
      state.loading = true;
      state.stockAndProductCount = null ;
      state.error = null;
    });
    builder.addCase(fetchAvailableStockAndProductCount.fulfilled, (state, action) => {
      state.loading = false;
      state.stockAndProductCount = action.payload;
      state.error = null;
    });
    builder.addCase(fetchAvailableStockAndProductCount.rejected, (state, action) => {
      state.loading = false;
      state.stockAndProductCount = null;
      state.error = action.payload;
    });
  },
});

export default availableStockAndProductCountSlice.reducer;
