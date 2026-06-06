import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export const fetchProductCount = createAsyncThunk(
  "inventory/product-count",
  async (_, { rejectWithValue }) => {
    try {
        // alert("hi")
      const response = await axiosClient.get(
        "/inventory/product-count",
      );
      console.log(" response.data?.data?.productCount===", response.data?.data);
      
      return response.data?.data || {};
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch inevtory category.",
      );
    }
  },
);

const initialState = {
  counts: null,
  loading: false,
  error: null,
};

const productCountSlice = createSlice({
  name: "productCountSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProductCount.pending, (state) => {
      state.loading = true;
      state.counts = null;
      state.error = null;
    });
    builder.addCase(fetchProductCount.fulfilled, (state, action) => {
      state.loading = false;
      state.counts = action.payload;
      state.error = null;
    });
    builder.addCase(fetchProductCount.rejected, (state, action) => {
      state.loading = false;
      state.counts = null;
      state.error = action.payload;
    });
  },
});

export default productCountSlice.reducer;
