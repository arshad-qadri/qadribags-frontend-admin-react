import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosClient from '../../api/axiosClient'

function formatCurrency(value) {
  const amount = Number(value ?? 0)

  return `Rs ${amount.toLocaleString('en-IN')}`
}

function formatStatus(status) {
  switch (status) {
    case 'ACTIVE':
      return 'Active'
    case 'INACTIVE':
      return 'Inactive'
    case 'DRAFT':
      return 'Draft'
    case 'LOW_STOCK':
      return 'Low Stock'
    default:
      return status
        ?.toLowerCase()
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase()) || 'Unknown'
  }
}

function formatWeight(weight) {
  if (weight === null || weight === undefined || weight === '') {
    return '-'
  }

  return `${weight} g`
}

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

function normalizeImage(image) {
  if (typeof image === 'string') {
    return { publicId: image, url: image }
  }

  return {
    publicId: image.public_id,
    url: image.url,
  }
}

export function normalizeProduct(product) {
  const images = Array.isArray(product.images)
    ? product.images.map(normalizeImage)
    : []

  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    description: product.description,
    category: product.category,
    material: product.material,
    color: Array.isArray(product.colors) ? product.colors.join(', ') : '-',
    colors: Array.isArray(product.colors) ? product.colors : [],
    weight: formatWeight(product.weight),
    dimensions: product.dimensions || '-',
    supplier: product.supplier || '-',
    status: formatStatus(product.status),
    rawStatus: product.status,
    price: formatCurrency(product.price),
    priceValue: Number(product.price ?? 0),
    stock: Number(product.stock ?? 0),
    images,
    image: images[0]?.url || '',
    createdAt: product.created_at,
    updatedAt: product.updated_at,
  }
}

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/products/list')

      return response.data?.data?.map(normalizeProduct) || []
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

      return normalizeProduct(response.data?.data)
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

const initialState = {
  items: [],
  loading: false,
  loaded: false,
  productLoading: true,
  error: null,
  statusUpdating: false,
  imageUploading: false,
  updating: false,
  creating: false,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    updateProductLocally: (state, action) => {
      const { productId, updatedFields } = action.payload
      state.items = state.items.map((product) =>
        product.id === productId ? { ...product, ...updatedFields } : product,
      )
    },
    addProductImageLocally: (state, action) => {
      const { productId, image } = action.payload
      state.items = state.items.map((product) => {
        if (product.id !== productId) {
          return product
        }

        const nextImages = [...product.images, image]

        return {
          ...product,
          images: nextImages,
          image: nextImages[0]?.url || '',
        }
      })
    },
    deleteProductImageLocally: (state, action) => {
      const { productId, imageIndex } = action.payload
      state.items = state.items.map((product) => {
        if (product.id !== productId) {
          return product
        }

        const nextImages = product.images.filter(
          (_, index) => index !== imageIndex,
        )

        return {
          ...product,
          images: nextImages,
          image: nextImages[0]?.url || '',
        }
      })
    },
  },
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

export const {
  updateProductLocally,
  addProductImageLocally,
  deleteProductImageLocally,
} = productsSlice.actions

export const selectProducts = (state) => state.products.items
export const selectProductsLoading = (state) => state.products.loading
export const selectProductsLoaded = (state) => state.products.loaded
export const selectProductLoading = (state) => state.products.productLoading
export const selectProductsError = (state) => state.products.error
export const selectProductStatusUpdating = (state) =>
  state.products.statusUpdating
export const selectProductImageUploading = (state) =>
  state.products.imageUploading
export const selectProductUpdating = (state) => state.products.updating
export const selectProductCreating = (state) => state.products.creating
export const selectProductById = (state, productId) =>
  state.products.items.find((product) => product.id === productId)
export const selectProductBySku = (state, productSku) =>
  state.products.items.find((product) => product.sku === productSku)

export default productsSlice.reducer
