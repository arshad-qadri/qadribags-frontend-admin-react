import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosClient from '../../api/axiosClient'

const tokenKey = 'access_token'

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/users/login', {
        username,
        password,
      })

      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Unable to login. Please try again.',
      )
    }
  },
)

export const fetchLoggedInUser = createAsyncThunk(
  'auth/fetchLoggedInUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/users/user')

      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Unable to fetch user details.',
      )
    }
  },
)

const initialState = {
  token: localStorage.getItem(tokenKey),
  user: null,
  loading: false,
  userLoading: false,
  error: null,
  userError: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null
      state.user = null
      state.error = null
      state.userError = null
      localStorage.removeItem(tokenKey)
    },
    clearAuthError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const token = action.payload?.data?.access_token

        state.loading = false
        state.token = token

        if (token) {
          localStorage.setItem(tokenKey, token)
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchLoggedInUser.pending, (state) => {
        state.userLoading = true
        state.userError = null
      })
      .addCase(fetchLoggedInUser.fulfilled, (state, action) => {
        state.userLoading = false
        state.user = action.payload?.data || null
      })
      .addCase(fetchLoggedInUser.rejected, (state, action) => {
        state.userLoading = false
        state.userError = action.payload
      })
  },
})

export const { clearAuthError, logout } = authSlice.actions
export default authSlice.reducer
