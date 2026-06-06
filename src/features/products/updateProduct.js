import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosClient from '../../api/axiosClient'
import { fetchProductBySku } from './fetchProductBySku'
import { parseColors, parseNumber } from './productHelpers'

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ sku, productData }, { dispatch, rejectWithValue }) => {
    try {
      await axiosClient.patch(`/products/update/${sku}`, {
        name: productData.name,
        description: productData.description,
        category: productData.category,
        material: productData.material,
        colors: parseColors(productData.color),
        weight: parseNumber(productData.weight),
        dimensions: productData.dimensions,
        supplier: productData.supplier,
        price: parseNumber(productData.price),
        stock: parseNumber(productData.stock),
      })

      const refreshedProduct = await dispatch(fetchProductBySku(sku)).unwrap()
      return refreshedProduct
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Unable to update product.',
      )
    }
  },
)

const updateProductSlice = createSlice({
  name: 'updateProduct',
  initialState: {
    updating: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateProduct.pending, (state) => {
        state.updating = true
        state.error = null
      })
      .addCase(updateProduct.fulfilled, (state) => {
        state.updating = false
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.updating = false
        state.error = action.payload
      })
  },
})

export default updateProductSlice.reducer
