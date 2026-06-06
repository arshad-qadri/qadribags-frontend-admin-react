import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosClient from '../../api/axiosClient'
import { fetchProducts } from './fetchProducts'
import { parseColors, parseNumber } from './productHelpers'

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { dispatch, rejectWithValue }) => {
    try {
      await axiosClient.post('/products/create', {
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

      const refreshedProducts = await dispatch(fetchProducts()).unwrap()
      return refreshedProducts
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Unable to create product.',
      )
    }
  },
)

const createProductSlice = createSlice({
  name: 'createProduct',
  initialState: {
    creating: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.creating = true
        state.error = null
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.creating = false
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.creating = false
        state.error = action.payload
      })
  },
})

export default createProductSlice.reducer
