import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosClient from '../../api/axiosClient'

export const updateOrder = createAsyncThunk(
  'orders/updateOrder',
  async ({ orderNumber, orderData }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put(`/orders/edit/${orderNumber}`, orderData)
      return response.data?.data || null
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Unable to update order.',
      )
    }
  },
)

const updateOrderSlice = createSlice({
  name: 'updateOrder',
  initialState: {
    updating: false,
    updatedOrder: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateOrder.pending, (state) => {
        state.updating = true
        state.updatedOrder = null
        state.error = null
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.updating = false
        state.updatedOrder = action.payload
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.updating = false
        state.updatedOrder = null
        state.error = action.payload
      })
  },
})

export default updateOrderSlice.reducer
