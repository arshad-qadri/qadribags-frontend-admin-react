import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosClient from '../../api/axiosClient'
import { customerStatus } from '../../utils/common'
import { fetchCustomerByCustomerId } from './fetchCustomerByCustomerId'
import { fetchCustomers } from './fetchCustomers'

export const toggleCustomerStatus = createAsyncThunk(
  'customers/toggleCustomerStatus',
  async ({ customerId, nextStatus }, { dispatch, rejectWithValue }) => {
    try {
      await axiosClient.post(
        `/customers/customer/active-inactive-by-id/${customerId}`,
        { status: nextStatus },
      )

      await dispatch(fetchCustomers()).unwrap()
      return await dispatch(fetchCustomerByCustomerId(customerId)).unwrap()
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Unable to update customer status.',
      )
    }
  },
)

const toggleCustomerStatusSlice = createSlice({
  name: 'toggleCustomerStatus',
  initialState: {
    updating: false,
    error: null,
    lastStatus: customerStatus.ACTIVE,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(toggleCustomerStatus.pending, (state) => {
        state.updating = true
        state.error = null
      })
      .addCase(toggleCustomerStatus.fulfilled, (state, action) => {
        state.updating = false
        state.lastStatus = action.payload?.status || state.lastStatus
      })
      .addCase(toggleCustomerStatus.rejected, (state, action) => {
        state.updating = false
        state.error = action.payload
      })
  },
})

export default toggleCustomerStatusSlice.reducer
