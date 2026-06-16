import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosClient from '../../api/axiosClient'

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/orders/all-orders')
      return response.data?.data?.orders || []
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Unable to fetch orders.',
      )
    }
  },
)

const fetchOrdersSlice = createSlice({
  name: 'fetchOrders',
  initialState: {
    items: [],
    loading: false,
    loaded: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true
        state.loaded = false
        state.error = null
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false
        state.loaded = true
        state.items = action.payload
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false
        state.loaded = true
        state.items = []
        state.error = action.payload
      })
  },
})

export default fetchOrdersSlice.reducer
