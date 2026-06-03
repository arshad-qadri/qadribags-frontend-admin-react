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

const initialState = {
  token: localStorage.getItem(tokenKey),
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null
      state.error = null
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
  },
})

export const { clearAuthError, logout } = authSlice.actions
export default authSlice.reducer
