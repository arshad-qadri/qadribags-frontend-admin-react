import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosClient from '../../api/axiosClient'

export const fetchOrderByOrderNumber = createAsyncThunk(
  'orders/fetchOrderByOrderNumber',
  async (orderNumber, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/orders/order/${orderNumber}`)
      return response.data?.data?.order || null
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Unable to fetch order details.',
      )
    }
  },
)

const fetchOrderByOrderNumberSlice = createSlice({
  name: 'fetchOrderByOrderNumber',
  initialState: {
    item: null,
    loading: false,
    loaded: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByOrderNumber.pending, (state) => {
        state.loading = true
        state.loaded = false
        state.error = null
      })
      .addCase(fetchOrderByOrderNumber.fulfilled, (state, action) => {
        state.loading = false
        state.loaded = true
        state.item = action.payload
      })
      .addCase(fetchOrderByOrderNumber.rejected, (state, action) => {
        state.loading = false
        state.loaded = true
        state.item = null
        state.error = action.payload
      })
  },
})

export default fetchOrderByOrderNumberSlice.reducer
