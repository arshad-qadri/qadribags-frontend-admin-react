import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import customersReducer from "../features/customers/customersSlice";
import productsReducer from "../features/products/productsSlice";
import lowStockAlertsReducer from "../features/inventory/lowStockAlertsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: customersReducer,
    products: productsReducer,
    inventory: combineReducers({
      lowStockAlerts: lowStockAlertsReducer,
    }),
  },
});
