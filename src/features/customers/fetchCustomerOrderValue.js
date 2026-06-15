import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosClient from '../../api/axiosClient'

export const fetchCustomerOrderValue = createAsyncThunk(
  'customers/fetchCustomerOrderValue',
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/orders/order-value/${customerId}`)
      return (
        response.data?.data || {
          order_value: 0,
          due_amount: 0,
        }
      )
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Unable to fetch customer order value.',
      )
    }
  },
)

const fetchCustomerOrderValueSlice = createSlice({
  name: 'fetchCustomerOrderValue',
  initialState: {
    item: {
      order_value: 0,
      due_amount: 0,
    },
    loading: false,
    loaded: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerOrderValue.pending, (state) => {
        state.loading = true
        state.loaded = false
        state.error = null
      })
      .addCase(fetchCustomerOrderValue.fulfilled, (state, action) => {
        state.loading = false
        state.loaded = true
        state.item = action.payload
      })
      .addCase(fetchCustomerOrderValue.rejected, (state, action) => {
        state.loading = false
        state.loaded = true
        state.item = {
          order_value: 0,
          due_amount: 0,
        }
        state.error = action.payload
      })
  },
})

export default fetchCustomerOrderValueSlice.reducer
