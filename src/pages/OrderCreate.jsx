import { ArrowLeft, PackagePlus, Plus, Save, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Button from '../components/common/Button'
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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

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
  const selectedOrderItems = orderItems
    .map((item) => {
      const selectedProduct = productOptions.find(
        (product) => product.sku === item.productSku,
      )

      if (!selectedProduct) {
        return null
      }

      const quantity = Number(item.quantity || 0)

      return {
        ...selectedProduct,
        quantity,
        lineTotal: selectedProduct.price * quantity,
      }
    })
    .filter(Boolean)

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
                onClick={() => setIsConfirmOpen(true)}
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

      <ConfirmOrderModal
        open={isConfirmOpen}
        customer={selectedCustomer}
        items={selectedOrderItems}
        grandTotal={grandTotal}
        paymentType={paymentStatus}
        paymentAmount={paymentAmount}
        paymentMode={paymentMode}
        onClose={() => setIsConfirmOpen(false)}
      />
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

function ConfirmOrderModal({
  open,
  customer,
  items,
  grandTotal,
  paymentType,
  paymentAmount,
  paymentMode,
  onClose,
}) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-6 backdrop-blur-[2px]">
      <div className="h-[88vh] w-full max-w-[1280px] rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-emerald-700">Order Preview</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-950">Confirm Order</h3>
            <p className="mt-2 text-sm text-slate-500">
              Review products and total before creating the order.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            aria-label="Close preview"
          >
            <X size={22} />
          </button>
        </div>

        <div className="mt-8 grid h-[calc(88vh-11rem)] gap-8 lg:grid-cols-[1.45fr_0.95fr]">
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-bold">Product</th>
                  <th className="px-4 py-3 font-bold">Qty</th>
                  <th className="px-4 py-3 font-bold">Price</th>
                  <th className="px-4 py-3 font-bold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.length > 0 ? (
                  items.map((item) => (
                    <tr key={`${item.sku}-${item.quantity}`} className="bg-white">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-slate-900">{item.name}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.sku}</p>
                      </td>
                      <td className="px-4 py-4 text-slate-600">{item.quantity}</td>
                      <td className="px-4 py-4 text-slate-600">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-4 py-4 font-semibold text-slate-900">
                        {formatCurrency(item.lineTotal)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white">
                    <td className="px-4 py-20 text-center text-sm text-slate-500" colSpan={4}>
                      No product selected yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-7">
            <p className="text-sm font-semibold text-emerald-800">Summary</p>
            <div className="mt-4 space-y-3 text-sm text-emerald-950">
              <div className="flex items-center justify-between gap-3">
                <span>Customer</span>
                <span className="text-right font-semibold">
                  {customer?.name || 'Not selected'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Payment Type</span>
                <span className="font-semibold">{paymentType || '-'}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Payment Mode</span>
                <span className="font-semibold">{paymentMode || '-'}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Amount Paying</span>
                <span className="font-semibold">
                  {paymentAmount ? formatCurrency(paymentAmount) : 'Later'}
                </span>
              </div>
              <div className="border-t border-emerald-200 pt-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-base font-semibold">Grand Total</span>
                  <span className="text-xl font-bold">{formatCurrency(grandTotal)}</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button className="w-full">Create Order</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderCreate
