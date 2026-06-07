import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosClient from '../../api/axiosClient'

export const fetchCustomerByCustomerId = createAsyncThunk(
  'customers/fetchCustomerByCustomerId',
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(
        `/customers/customer/get-by-id/${customerId}`,
      )
      return response.data?.data || null
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Unable to fetch customer details.',
      )
    }
  },
)

const fetchCustomerByCustomerIdSlice = createSlice({
  name: 'fetchCustomerByCustomerId',
  initialState: {
    item: null,
    loading: false,
    loaded: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerByCustomerId.pending, (state) => {
        state.loading = true
        state.loaded = false
        state.error = null
      })
      .addCase(fetchCustomerByCustomerId.fulfilled, (state, action) => {
        state.loading = false
        state.loaded = true
        state.item = action.payload
      })
      .addCase(fetchCustomerByCustomerId.rejected, (state, action) => {
        state.loading = false
        state.loaded = true
        state.item = null
        state.error = action.payload
      })
  },
})

export default fetchCustomerByCustomerIdSlice.reducer
