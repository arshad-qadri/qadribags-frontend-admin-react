import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosClient from '../../api/axiosClient'

export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/customers/list')
      return response.data?.data || []
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Unable to fetch customers.',
      )
    }
  },
)

const fetchCustomersSlice = createSlice({
  name: 'fetchCustomers',
  initialState: {
    items: [],
    loading: false,
    loaded: false,
    error: null,
  },
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
  },
})

export default fetchCustomersSlice.reducer
