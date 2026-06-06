import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosClient from '../../api/axiosClient'
import { fetchProductBySku } from './fetchProductBySku'

export const toggleProductStatus = createAsyncThunk(
  'products/toggleProductStatus',
  async ({ sku, status }, { dispatch, rejectWithValue }) => {
    try {
      await axiosClient.post(`/products/active-inactive/${sku}`, {
        status,
      })

      const refreshedProduct = await dispatch(fetchProductBySku(sku)).unwrap()
      return refreshedProduct
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Unable to update product status.',
      )
    }
  },
)

const toggleProductStatusSlice = createSlice({
  name: 'toggleProductStatus',
  initialState: {
    statusUpdating: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(toggleProductStatus.pending, (state) => {
        state.statusUpdating = true
        state.error = null
      })
      .addCase(toggleProductStatus.fulfilled, (state) => {
        state.statusUpdating = false
      })
      .addCase(toggleProductStatus.rejected, (state, action) => {
        state.statusUpdating = false
        state.error = action.payload
      })
  },
})

export default toggleProductStatusSlice.reducer
