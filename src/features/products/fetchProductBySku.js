import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosClient from '../../api/axiosClient'

export const fetchProductBySku = createAsyncThunk(
  'products/fetchProductBySku',
  async (sku, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/products/get-product-by-sku/${sku}`)

      return response.data?.data || null
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Unable to fetch product details.',
      )
    }
  },
)

const fetchProductBySkuSlice = createSlice({
  name: 'fetchProductBySku',
  initialState: {
    item: null,
    loading: true,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductBySku.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductBySku.fulfilled, (state, action) => {
        state.loading = false
        state.item = action.payload
      })
      .addCase(fetchProductBySku.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default fetchProductBySkuSlice.reducer
