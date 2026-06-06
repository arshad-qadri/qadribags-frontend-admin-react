import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import customersReducer from '../features/customers/customersSlice'
import productsReducer from '../features/products/productsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: customersReducer,
    products: productsReducer,
  },
})
