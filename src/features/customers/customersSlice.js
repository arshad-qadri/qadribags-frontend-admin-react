export const selectCustomers = (state) => state.customers.fetchCustomers.items
export const selectCustomersLoading = (state) =>
  state.customers.fetchCustomers.loading
export const selectCustomersLoaded = (state) =>
  state.customers.fetchCustomers.loaded
export const selectCustomersError = (state) => state.customers.fetchCustomers.error
export const selectCustomerCreating = (state) =>
  state.customers.createCustomer.creating
export const selectCustomerUpdating = (state) =>
  state.customers.updateCustomer.updating
export const selectCustomerDeleting = (state) =>
  state.customers.deleteCustomer.deleting
export const selectCustomerById = (state, customerId) =>
  state.customers.fetchCustomers.items.find((customer) => customer.id === customerId)
export const selectCustomerByCustomerCode = (state, customerId) =>
  state.customers.fetchCustomers.items.find(
    (customer) => customer.customer_id === customerId,
  )
export const selectSelectedCustomer = (state) =>
  state.customers.fetchCustomerByCustomerId.item
export const selectSelectedCustomerLoading = (state) =>
  state.customers.fetchCustomerByCustomerId.loading
export const selectSelectedCustomerLoaded = (state) =>
  state.customers.fetchCustomerByCustomerId.loaded
export const selectSelectedCustomerError = (state) =>
  state.customers.fetchCustomerByCustomerId.error
