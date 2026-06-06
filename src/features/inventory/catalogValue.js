import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export const fetchCatalogValue = createAsyncThunk(
  "inventory/fetchCatalogValue",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/inventory/catalog-value");

      return response.data?.data || {};
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch inevtory category.",
      );
    }
  },
);

const initialState = {
  catalog: null,
  loading: false,
  error: null,
};

const catalogValueSlice = createSlice({
  name: "catalogValueSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCatalogValue.pending, (state) => {
      state.loading = true;
      state.catalog = null;
      state.error = null;
    });
    builder.addCase(fetchCatalogValue.fulfilled, (state, action) => {
      state.loading = false;
      state.catalog = action.payload;
      state.error = null;
    });
    builder.addCase(fetchCatalogValue.rejected, (state, action) => {
      state.loading = false;
      state.catalog = null;
      state.error = action.payload;
    });
  },
});

export default catalogValueSlice.reducer;
