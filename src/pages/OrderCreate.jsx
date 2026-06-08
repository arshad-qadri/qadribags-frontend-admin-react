import { ArrowLeft, PackagePlus, Plus, Save, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchCustomers } from '../features/customers'
import { fetchProducts } from '../features/products/fetchProducts'
import { formatCurrency } from '../utils/numberFormat'

function createEmptyItem() {
  return {
    productSku: '',
    quantity: '1',
  }
}

function OrderCreate() {
  const dispatch = useDispatch()
  const customers = useSelector((state) => state.customers.fetchCustomers.items)
  const customersLoaded = useSelector((state) => state.customers.fetchCustomers.loaded)
  const products = useSelector((state) => state.products.fetchProducts.items)
  const productsLoaded = useSelector((state) => state.products.fetchProducts.loaded)

  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentMode, setPaymentMode] = useState('')
  const [orderItems, setOrderItems] = useState([createEmptyItem()])

  useEffect(() => {
    if (!customersLoaded) {
      dispatch(fetchCustomers())
    }
  }, [customersLoaded, dispatch])

  useEffect(() => {
    if (!productsLoaded) {
      dispatch(fetchProducts())
    }
  }, [dispatch, productsLoaded])

  const customerOptions = useMemo(
    () =>
      customers.map((customer) => ({
        id: customer.customer_id || '',
        name: customer.name || '',
        phone: customer.mobile_number || '',
        city: customer.city || '',
        address: customer.address || '',
        state: customer.state || '',
        pincode: customer.pincode || '',
      })),
    [customers],
  )

  const productOptions = useMemo(
    () =>
      products.map((product) => ({
        sku: product.sku || '',
        name: product.name || '',
        price: Number(product.price || 0),
        label: product.name || 'Unnamed Product',
      })),
    [products],
  )

  const selectedCustomer = customerOptions.find(
    (customer) => customer.id === selectedCustomerId,
  )

  const shippingAddress = selectedCustomer
    ? [
        selectedCustomer.address,
        selectedCustomer.city,
        selectedCustomer.state,
        selectedCustomer.pincode,
      ]
        .filter(Boolean)
        .join(', ')
    : ''

  const grandTotal = orderItems.reduce((sum, item) => {
    const selectedProduct = productOptions.find(
      (product) => product.sku === item.productSku,
    )
    return sum + (selectedProduct?.price || 0) * Number(item.quantity || 0)
  }, 0)

  const totalItems = orderItems.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0,
  )
  const showPaymentAmount = paymentStatus === 'Partial' || paymentStatus === 'Paid'

  const handleItemChange = (index, field, value) => {
    setOrderItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    )
  }

  const handleAddItem = () => {
    setOrderItems((current) => [...current, createEmptyItem()])
  }

  const handleRemoveItem = (index) => {
    setOrderItems((current) =>
      current.length === 1 ? current : current.filter((_, itemIndex) => itemIndex !== index),
    )
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm xl:flex-row xl:items-center">
        <div>
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-700"
          >
            <ArrowLeft size={17} />
            Back to orders
          </Link>
          <h2 className="mt-3 text-2xl font-bold text-slate-950">Create Order</h2>
          <p className="mt-2 text-sm text-slate-500">
            Select customer from dropdown, then customer details auto-populate.
          </p>
        </div>
        {/* <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          <Save size={18} />
          <span className="ml-2">Save Order</span>
        </button> */}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <FormCard title="Order Details">
          <div className="grid gap-4 md:grid-cols-2">
            <SelectInput
              label="Customer"
              value={selectedCustomerId}
              onChange={setSelectedCustomerId}
              options={customerOptions.map((customer) => ({
                value: customer.id,
                label: `${customer.name} | ${customer.city || 'No city'} | ${customer.id}`,
              }))}
              placeholder="Select customer"
            />
            <ReadOnlyField
              label="Customer ID"
              value={selectedCustomer?.id || 'Select customer'}
            />
            <ReadOnlyField
              label="Phone Number"
              value={selectedCustomer?.phone || 'Select customer'}
            />
            <ReadOnlyField
              label="City"
              value={selectedCustomer?.city || 'Select customer'}
            />
            <ReadOnlyField
              label="State"
              value={selectedCustomer?.state || 'Select customer'}
            />
            <SelectInput
              label="Payment Type"
              value={paymentStatus}
              onChange={setPaymentStatus}
              options={[
                { value: 'Credit', label: 'Credit' },
                { value: 'Partial', label: 'Partial' },
                { value: 'Paid', label: 'Paid' },
              ]}
              placeholder="Select payment type"
            />
            {showPaymentAmount ? (
              <Input
                label="Payment Amount"
                placeholder="Enter paid amount"
                value={paymentAmount}
                onChange={setPaymentAmount}
              />
            ) : (
              <ReadOnlyField label="Payment Amount" value="Will be paid later" />
            )}
            <SelectInput
              label="Payment Mode"
              value={paymentMode}
              onChange={setPaymentMode}
              options={[
                { value: 'Cash', label: 'Cash' },
                { value: 'UPI', label: 'UPI' },
                { value: 'Bank Transfer', label: 'Bank Transfer' },
                { value: 'Cheque', label: 'Cheque' },
              ]}
              placeholder="Select payment mode"
            />
          </div>
        </FormCard>

        <FormCard title="Checkout Summary">
          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5">
              <div className="space-y-3 text-sm text-emerald-900">
                <div className="flex items-center justify-between">
                  <span>Total Items</span>
                  <span className="font-semibold">{totalItems}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Grand Total</span>
                  <span className="text-lg font-bold">{formatCurrency(grandTotal)}</span>
                </div>
              </div>
              <button
                type="button"
                className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Confirm
              </button>
            </div>
          </div>
        </FormCard>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <PackagePlus size={18} className="text-emerald-700" />
            <h3 className="text-lg font-bold text-slate-950">Order Items</h3>
          </div>
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
          >
            <Plus size={16} />
            <span className="ml-2"> Product</span>
          </button>
        </div>

        <div className="mt-5 grid gap-4">
          {orderItems.map((item, index) => {
            const selectedProduct = productOptions.find(
              (product) => product.sku === item.productSku,
            )
            const quantity = Number(item.quantity || 0)
            const lineTotal = (selectedProduct?.price || 0) * quantity

            return (
              <div
                key={`order-item-${index}`}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="grid gap-4 md:grid-cols-[1.8fr_0.7fr_0.9fr_0.9fr_auto]">
                  <SelectInput
                    label={`Product ${index + 1}`}
                    value={item.productSku}
                    onChange={(value) => handleItemChange(index, 'productSku', value)}
                    options={productOptions.map((product) => ({
                      value: product.sku,
                      label: product.label,
                    }))}
                    placeholder="Select product"
                  />
                  <Input
                    label="Quantity"
                    placeholder="1"
                    value={item.quantity}
                    onChange={(value) => handleItemChange(index, 'quantity', value)}
                  />
                  <ReadOnlyField
                    label="Price"
                    value={
                      selectedProduct ? formatCurrency(selectedProduct.price) : 'Select product'
                    }
                  />
                  <ReadOnlyField
                    label="Total"
                    value={selectedProduct ? formatCurrency(lineTotal) : 'Select product'}
                  />
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      disabled={orderItems.length === 1}
                      className="inline-flex h-[46px] w-full items-center justify-center rounded-lg border border-red-200 bg-red-50 px-4 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function FormCard({ title, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-950">{title}</h3>
      <div className="mt-5">{children}</div>
    </div>
  )
}

function Input({
  label,
  type = 'text',
  placeholder,
  value = '',
  onChange = () => {},
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  )
}

function SelectInput({ label, value, onChange, options, placeholder }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function ReadOnlyField({ label, value }) {
  return (
    <div className="space-y-2">
      <span className="block text-sm font-medium text-slate-700">{label}</span>
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
        {value}
      </div>
    </div>
  )
}

function ReadOnlyTextarea({ label, placeholder, value = '' }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea
        rows={5}
        value={value}
        readOnly
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
      />
    </label>
  )
}

export default OrderCreate
