import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import {
  createCustomerReducer,
  deleteCustomerReducer,
  fetchCustomerByCustomerIdReducer,
  fetchCustomersReducer,
  toggleCustomerStatusReducer,
  updateCustomerReducer,
} from "../features/customers";
import {
  createProductReducer,
  deleteProductImageReducer,
  fetchProductBySkuReducer,
  fetchProductsReducer,
  toggleProductStatusReducer,
  updateProductReducer,
  uploadProductImageReducer,
} from "../features/products";
import lowStockAlertsReducer from "../features/inventory/lowStockAlertsSlice";
import inventoryCategoryRedcer from "../features/inventory/inventoryCategory";
import productCountReducer from "../features/inventory/productCount";
import availableStockAndProductCountReducer from "../features/inventory/availableStockAndProductCount";
import lowStockProductCountReducer from "../features/inventory/lowStockProductCount";
import catalogValueReducer from "../features/inventory/catalogValue";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: combineReducers({
      fetchCustomers: fetchCustomersReducer,
      fetchCustomerByCustomerId: fetchCustomerByCustomerIdReducer,
      createCustomer: createCustomerReducer,
      updateCustomer: updateCustomerReducer,
      toggleCustomerStatus: toggleCustomerStatusReducer,
      deleteCustomer: deleteCustomerReducer,
    }),
    products: combineReducers({
      fetchProducts: fetchProductsReducer,
      fetchProductBySku: fetchProductBySkuReducer,
      createProduct: createProductReducer,
      updateProduct: updateProductReducer,
      toggleProductStatus: toggleProductStatusReducer,
      uploadProductImage: uploadProductImageReducer,
      deleteProductImage: deleteProductImageReducer,
    }),
    inventory: combineReducers({
      lowStockAlerts: lowStockAlertsReducer,
      inventoryCategory: inventoryCategoryRedcer,
      productCount: productCountReducer,
      availableStockAndProductCount: availableStockAndProductCountReducer,
      lowStockProductCount: lowStockProductCountReducer,
      catalogValue: catalogValueReducer,
    }),
  },
});
