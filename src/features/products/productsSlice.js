import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosClient from '../../api/axiosClient'

function parseNumber(value) {
  if (typeof value === 'number') {
    return value
  }

  const normalizedValue = String(value ?? '').replace(/[^\d.]/g, '')
  return Number(normalizedValue) || 0
}

function parseColors(value) {
  if (Array.isArray(value)) {
    return value
  }

  return String(value ?? '')
    .split(',')
    .map((color) => color.trim())
    .filter(Boolean)
}

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/products/list')

      return response.data?.data || []
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Unable to fetch products.',
      )
    }
  },
)

export const fetchProductBySku = createAsyncThunk(
  'products/fetchProductBySku',
  async (sku, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/products/get-product-by-sku/${sku}`)

      return response.data?.data || null
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Unable to fetch product details.',
      )
    }
  },
)

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

const initialState = {
  items: [],
  loading: false,
  loaded: false,
  productLoading: true,
  error: null,
  statusUpdating: false,
  imageUploading: false,
  imageDeleting: false,
  updating: false,
  creating: false,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.loaded = true
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.loaded = true
        state.error = action.payload
      })
      .addCase(fetchProductBySku.pending, (state) => {
        state.productLoading = true
        state.error = null
      })
      .addCase(fetchProductBySku.fulfilled, (state, action) => {
        state.productLoading = false

        const nextProduct = action.payload
        if (!nextProduct) {
          return
        }

        const existingIndex = state.items.findIndex(
          (product) => product.id === nextProduct.id,
        )

        if (existingIndex >= 0) {
          state.items[existingIndex] = nextProduct
          return
        }

        state.items.push(nextProduct)
      })
      .addCase(fetchProductBySku.rejected, (state, action) => {
        state.productLoading = false
        state.error = action.payload
      })
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

export const selectProducts = (state) => state.products.items
export const selectProductsLoading = (state) => state.products.loading
export const selectProductsLoaded = (state) => state.products.loaded
export const selectProductLoading = (state) => state.products.productLoading
export const selectProductsError = (state) => state.products.error
export const selectProductStatusUpdating = (state) =>
  state.products.statusUpdating
export const selectProductImageUploading = (state) =>
  state.products.imageUploading
export const selectProductImageDeleting = (state) =>
  state.products.imageDeleting
export const selectProductUpdating = (state) => state.products.updating
export const selectProductCreating = (state) => state.products.creating
export const selectProductBySku = (state, productSku) =>
  state.products.items.find((product) => product.sku === productSku)

export default productsSlice.reducer
