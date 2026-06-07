export function buildCustomerPayload(customerData) {
  return {
    name: customerData.name.trim(),
    email: customerData.email.trim(),
    mobile_number: customerData.mobile_number.trim(),
    address: customerData.address.trim(),
    city: customerData.city.trim(),
    state: customerData.state.trim(),
    pincode: customerData.pincode.trim(),
    gst_number: customerData.gst_number.trim(),
    customer_type: customerData.customer_type.trim().toUpperCase(),
  }
}
