import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosClient from '../../api/axiosClient'

export const fetchCustomerOrdersByCustomerId = createAsyncThunk(
  'customers/fetchCustomerOrdersByCustomerId',
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(
        `/orders/customer-order-list/${customerId}`,
      )
      return response.data?.data?.orders || []
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Unable to fetch customer orders.',
      )
    }
  },
)

const fetchCustomerOrdersByCustomerIdSlice = createSlice({
  name: 'fetchCustomerOrdersByCustomerId',
  initialState: {
    items: [],
    loading: false,
    loaded: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerOrdersByCustomerId.pending, (state) => {
        state.loading = true
        state.loaded = false
        state.error = null
      })
      .addCase(fetchCustomerOrdersByCustomerId.fulfilled, (state, action) => {
        state.loading = false
        state.loaded = true
        state.items = action.payload
      })
      .addCase(fetchCustomerOrdersByCustomerId.rejected, (state, action) => {
        state.loading = false
        state.loaded = true
        state.items = []
        state.error = action.payload
      })
  },
})

export default fetchCustomerOrdersByCustomerIdSlice.reducer
