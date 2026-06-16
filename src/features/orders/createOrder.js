import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosClient from '../../api/axiosClient'

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/orders/create', orderData)
      return response.data?.data || null
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Unable to create order.',
      )
    }
  },
)

const createOrderSlice = createSlice({
  name: 'createOrder',
  initialState: {
    creating: false,
    createdOrder: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.creating = true
        state.createdOrder = null
        state.error = null
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.creating = false
        state.createdOrder = action.payload
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.creating = false
        state.createdOrder = null
        state.error = action.payload
      })
  },
})

export default createOrderSlice.reducer
