import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosClient from '../../api/axiosClient'
import { buildCustomerPayload } from './customerHelpers'
import { fetchCustomers } from './fetchCustomers'

export const createCustomer = createAsyncThunk(
  'customers/createCustomer',
  async (customerData, { dispatch, rejectWithValue }) => {
    try {
      await axiosClient.post('/customers/create', buildCustomerPayload(customerData))
      return await dispatch(fetchCustomers()).unwrap()
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Unable to create customer.',
      )
    }
  },
)

const createCustomerSlice = createSlice({
  name: 'createCustomer',
  initialState: {
    creating: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCustomer.pending, (state) => {
        state.creating = true
        state.error = null
      })
      .addCase(createCustomer.fulfilled, (state) => {
        state.creating = false
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.creating = false
        state.error = action.payload
      })
  },
})

export default createCustomerSlice.reducer
