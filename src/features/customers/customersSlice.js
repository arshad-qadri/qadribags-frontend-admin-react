import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosClient from '../../api/axiosClient'

function formatDate(value) {
  if (!value) {
    return '-'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function normalizeCustomer(customer) {
  return {
    id: customer.id ?? customer._id ?? customer.customer_id,
    name: customer.name ?? customer.full_name ?? '',
    email: customer.email ?? '',
    phone: customer.phone ?? customer.mobile ?? '',
    city: customer.city ?? customer.address?.city ?? '',
    state: customer.state ?? customer.address?.state ?? '',
    ordersCount: Number(customer.orders_count ?? customer.orderCount ?? customer.ordersCount ?? 0),
    totalSpentValue: Number(customer.total_spent ?? customer.totalSpent ?? 0),
    totalSpent: `Rs ${Number(customer.total_spent ?? customer.totalSpent ?? 0).toLocaleString('en-IN')}`,
    status: customer.status
      ? String(customer.status)
          .toLowerCase()
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (char) => char.toUpperCase())
      : 'Active',
    createdAt: customer.created_at ?? customer.createdAt,
    joinedOn: formatDate(customer.created_at ?? customer.createdAt),
  }
}

function buildCustomerPayload(customerData) {
  return {
    name: customerData.name.trim(),
    email: customerData.email.trim(),
    phone: customerData.phone.trim(),
    city: customerData.city.trim(),
    state: customerData.state.trim(),
    status: customerData.status.trim().toUpperCase(),
  }
}

export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/customers/list')

      return (response.data?.data || []).map(normalizeCustomer)
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Unable to fetch customers.',
      )
    }
  },
)

export const createCustomer = createAsyncThunk(
  'customers/createCustomer',
  async (customerData, { dispatch, rejectWithValue }) => {
    try {
      await axiosClient.post('/customers/create', buildCustomerPayload(customerData))
      return await dispatch(fetchCustomers()).unwrap()
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Unable to create customer.',
      )
    }
  },
)

export const updateCustomer = createAsyncThunk(
  'customers/updateCustomer',
  async ({ id, customerData }, { dispatch, rejectWithValue }) => {
    try {
      await axiosClient.patch(`/customers/update/${id}`, buildCustomerPayload(customerData))
      return await dispatch(fetchCustomers()).unwrap()
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Unable to update customer.',
      )
    }
  },
)

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

const initialState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
  creating: false,
  updating: false,
  deleting: false,
}

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false
        state.loaded = true
        state.items = action.payload
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false
        state.loaded = true
        state.error = action.payload
      })
      .addCase(createCustomer.pending, (state) => {
        state.creating = true
        state.error = null
      })
      .addCase(createCustomer.fulfilled, (state) => {
        state.creating = false
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.creating = false
        state.error = action.payload
      })
      .addCase(updateCustomer.pending, (state) => {
        state.updating = true
        state.error = null
      })
      .addCase(updateCustomer.fulfilled, (state) => {
        state.updating = false
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.updating = false
        state.error = action.payload
      })
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

export const selectCustomers = (state) => state.customers.items
export const selectCustomersLoading = (state) => state.customers.loading
export const selectCustomersLoaded = (state) => state.customers.loaded
export const selectCustomersError = (state) => state.customers.error
export const selectCustomerCreating = (state) => state.customers.creating
export const selectCustomerUpdating = (state) => state.customers.updating
export const selectCustomerDeleting = (state) => state.customers.deleting

export default customersSlice.reducer
