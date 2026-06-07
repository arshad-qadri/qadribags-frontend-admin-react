import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosClient from '../../api/axiosClient'
import { buildCustomerPayload } from './customerHelpers'
import { fetchCustomerByCustomerId } from './fetchCustomerByCustomerId'
import { fetchCustomers } from './fetchCustomers'

export const updateCustomer = createAsyncThunk(
  'customers/updateCustomer',
  async ({ id, customerData, customerId }, { dispatch, rejectWithValue }) => {
    try {
      await axiosClient.put(
        `/customers/customer/update-by-id/${id}`,
        buildCustomerPayload(customerData),
      )

      await dispatch(fetchCustomers()).unwrap()

      if (customerId) {
        return await dispatch(fetchCustomerByCustomerId(customerId)).unwrap()
      }

      return null
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Unable to update customer.',
      )
    }
  },
)

const updateCustomerSlice = createSlice({
  name: 'updateCustomer',
  initialState: {
    updating: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateCustomer.pending, (state) => {
        state.updating = true
        state.error = null
      })
      .addCase(updateCustomer.fulfilled, (state) => {
        state.updating = false
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.updating = false
        state.error = action.payload
      })
  },
})

export default updateCustomerSlice.reducer
