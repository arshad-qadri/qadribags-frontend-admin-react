import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosClient from '../../api/axiosClient'
import { fetchCustomers } from './fetchCustomers'

export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await axiosClient.delete(`/customers/delete/${id}`)
      return await dispatch(fetchCustomers()).unwrap()
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Unable to delete customer.',
      )
    }
  },
)

const deleteCustomerSlice = createSlice({
  name: 'deleteCustomer',
  initialState: {
    deleting: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteCustomer.pending, (state) => {
        state.deleting = true
        state.error = null
      })
      .addCase(deleteCustomer.fulfilled, (state) => {
        state.deleting = false
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.deleting = false
        state.error = action.payload
      })
  },
})

export default deleteCustomerSlice.reducer
