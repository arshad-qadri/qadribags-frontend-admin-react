import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export const inventoryCategory = createAsyncThunk(
  "inventory/category",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(
        "/inventory/inventory-by-ctagory-percentage",
      );

      return response.data?.data?.categoryItems || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch inevtory category.",
      );
    }
  },
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const inventoryCategorySlice = createSlice({
  name: "inventoryCategory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(inventoryCategory.pending, (state) => {
      state.loading = true;
      state.items = [];
      state.error = null;
    });
    builder.addCase(inventoryCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
      state.error = null;
    });
    builder.addCase(inventoryCategory.rejected, (state, action) => {
      state.loading = false;
      state.items = [];
      state.error = action.payload;
    });
  },
});

export default inventoryCategorySlice.reducer;
