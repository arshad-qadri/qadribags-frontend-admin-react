import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosClient from '../../api/axiosClient'
import { fetchProductBySku } from './fetchProductBySku'

export const uploadProductImage = createAsyncThunk(
  'products/uploadProductImage',
  async ({ sku, imageFile }, { dispatch, rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append('sku', sku)
      formData.append('image', imageFile)

      await axiosClient.post(`/products/upload-image/${sku}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const refreshedProduct = await dispatch(fetchProductBySku(sku)).unwrap()
      return refreshedProduct
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Unable to upload product image.',
      )
    }
  },
)

const uploadProductImageSlice = createSlice({
  name: 'uploadProductImage',
  initialState: {
    imageUploading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadProductImage.pending, (state) => {
        state.imageUploading = true
        state.error = null
      })
      .addCase(uploadProductImage.fulfilled, (state) => {
        state.imageUploading = false
      })
      .addCase(uploadProductImage.rejected, (state, action) => {
        state.imageUploading = false
        state.error = action.payload
      })
  },
})

export default uploadProductImageSlice.reducer
