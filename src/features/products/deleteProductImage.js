import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosClient from '../../api/axiosClient'
import { fetchProductBySku } from './fetchProductBySku'

export const deleteProductImage = createAsyncThunk(
  'products/deleteProductImage',
  async ({ sku, publicId }, { dispatch, rejectWithValue }) => {
    try {
      await axiosClient.delete(`/products/delete-image/${sku}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          public_id: publicId,
        },
      })

      const refreshedProduct = await dispatch(fetchProductBySku(sku)).unwrap()
      return refreshedProduct
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Unable to delete product image.',
      )
    }
  },
)

const deleteProductImageSlice = createSlice({
  name: 'deleteProductImage',
  initialState: {
    imageDeleting: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteProductImage.pending, (state) => {
        state.imageDeleting = true
        state.error = null
      })
      .addCase(deleteProductImage.fulfilled, (state) => {
        state.imageDeleting = false
      })
      .addCase(deleteProductImage.rejected, (state, action) => {
        state.imageDeleting = false
        state.error = action.payload
      })
  },
})

export default deleteProductImageSlice.reducer
