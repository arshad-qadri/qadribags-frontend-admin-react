import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosClient from '../../api/axiosClient'

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/products/list')

      return response.data?.data || []
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Unable to fetch products.',
      )
    }
  },
)

const fetchProductsSlice = createSlice({
  name: 'fetchProducts',
  initialState: {
    items: [],
    loading: false,
    loaded: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.loaded = true
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.loaded = true
        state.error = action.payload
      })
  },
})

export default fetchProductsSlice.reducer
