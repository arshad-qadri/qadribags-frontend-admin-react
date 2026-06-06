import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import customersReducer from "../features/customers/customersSlice";
import productsReducer from "../features/products/productsSlice";
import lowStockAlertsReducer from "../features/inventory/lowStockAlertsSlice";
import inventoryCategoryRedcer from "../features/inventory/inventoryCategory";
import productCountReducer from "../features/inventory/productCount";
import availableStockAndProductCountReducer from "../features/inventory/availableStockAndProductCount";
import lowStockProductCountReducer from "../features/inventory/lowStockProductCount";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: customersReducer,
    products: productsReducer,
    inventory: combineReducers({
      lowStockAlerts: lowStockAlertsReducer,
      inventoryCategory: inventoryCategoryRedcer,
      productCount: productCountReducer,
      availableStockAndProductCount: availableStockAndProductCountReducer,
      lowStockProductCount: lowStockProductCountReducer,
    }),
  },
});
