import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export const fetchLowStockAlerts = createAsyncThunk(
  "inventory/fetchLowStockAlertSlice",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/inventory/low-stock-alerts");

      return response.data?.data?.lowStockAlerts || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch low stock alerts.",
      );
    }
  },
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const lowStockAlertSlice = createSlice({
  name: "lowStockAlert",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLowStockAlerts.pending, (state) => {
      state.loading = true;
      state.items = [];
      state.error = null;
    });
    builder.addCase(fetchLowStockAlerts.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
      state.error = null;
    });
    builder.addCase(fetchLowStockAlerts.rejected, (state, action) => {
      state.loading = false;
      state.items = [];
      state.error = action.payload;
    });
  },
});

export default lowStockAlertSlice.reducer;
