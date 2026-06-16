import { ArrowLeft } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import CheckoutSummaryCard from '../components/orders/CheckoutSummaryCard'
import ConfirmOrderModal from '../components/orders/ConfirmOrderModal'
import OrderDetailsCard from '../components/orders/OrderDetailsCard'
import OrderItemsSection from '../components/orders/OrderItemsSection'
import { fetchCustomers } from '../features/customers'
import { createOrder } from '../features/orders'
import { fetchProducts } from '../features/products/fetchProducts'

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
  const creatingOrder = useSelector((state) => state.orders.createOrder.creating)

  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentMode, setPaymentMode] = useState('')
  const [orderItems, setOrderItems] = useState([createEmptyItem()])
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [showValidation, setShowValidation] = useState(false)

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
        city: customer.city || '',
        label: `${customer.name || 'Unnamed Customer'} | ${
          customer.city || 'No city'
        }`,
      })),
    [customers],
  )

  const productOptions = useMemo(
    () =>
      products.map((product) => ({
        sku: product.sku || '',
        name: product.name || '',
        price: Number(product.price || 0),
        stock: Number(product.stock || 0),
        label: product.name || 'Unnamed Product',
      })),
    [products],
  )

  const selectedCustomer = customerOptions.find(
    (customer) => customer.id === selectedCustomerId,
  )

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
  const showPaymentMode = paymentStatus !== 'Credit'

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

  const itemErrors = orderItems.map((item) => {
    const quantity = Number(item.quantity || 0)

    return {
      productSku: !item.productSku,
      quantity: !item.quantity || Number.isNaN(quantity) || quantity <= 0,
    }
  })

  const isCustomerMissing = !selectedCustomerId
  const isPaymentTypeMissing = !paymentStatus
  const isPaymentAmountMissing = showPaymentAmount && !paymentAmount
  const isPaymentModeMissing = showPaymentMode && !paymentMode
  const hasInvalidItems = itemErrors.some(
    (itemError) => itemError.productSku || itemError.quantity,
  )
  const isFormValid =
    !isCustomerMissing &&
    !isPaymentTypeMissing &&
    !isPaymentAmountMissing &&
    !isPaymentModeMissing &&
    !hasInvalidItems &&
    selectedOrderItems.length > 0

  const handleItemChange = (index, field, value) => {
    setOrderItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    )
  }

  const handlePaymentTypeChange = (value) => {
    setPaymentStatus(value)

    if (value === 'Credit') {
      setPaymentAmount('')
      setPaymentMode('')
    }
  }

  const handleConfirmClick = () => {
    setShowValidation(true)

    if (!isFormValid) {
      return
    }

    setIsConfirmOpen(true)
  }

  const handleAddItem = () => {
    setOrderItems((current) => [...current, createEmptyItem()])
  }

  const handleRemoveItem = (index) => {
    setOrderItems((current) =>
      current.length === 1 ? current : current.filter((_, itemIndex) => itemIndex !== index),
    )
  }

  const handleCreateOrder = () => {
    const payload = {
      customer_id: selectedCustomerId,
      payment_type: paymentStatus.toLowerCase(),
      payment_mode: paymentStatus === 'Credit' ? '' : paymentMode,
      amount_paying:
        paymentStatus === 'Credit' ? '' : paymentAmount ? Number(paymentAmount) : '',
      order_items: selectedOrderItems.map((item) => ({
        sku: item.sku,
        quantity: item.quantity,
      })),
    }

    dispatch(createOrder(payload))
      .unwrap()
      .then((createdOrder) => {
        toast.success(createdOrder?.order_number || 'Order created successfully')
        setIsConfirmOpen(false)
        setSelectedCustomerId('')
        setPaymentStatus('')
        setPaymentAmount('')
        setPaymentMode('')
        setOrderItems([createEmptyItem()])
        setShowValidation(false)
      })
      .catch((error) => {
        toast.error(error || 'Unable to create order')
      })
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
            Select customer, choose payment details, and add items before confirming.
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <OrderDetailsCard
          customerOptions={customerOptions}
          selectedCustomerId={selectedCustomerId}
          onCustomerChange={setSelectedCustomerId}
          paymentStatus={paymentStatus}
          onPaymentTypeChange={handlePaymentTypeChange}
          paymentAmount={paymentAmount}
          onPaymentAmountChange={setPaymentAmount}
          paymentMode={paymentMode}
          onPaymentModeChange={setPaymentMode}
          showPaymentAmount={showPaymentAmount}
          showPaymentMode={showPaymentMode}
          showValidation={showValidation}
          isCustomerMissing={isCustomerMissing}
          isPaymentTypeMissing={isPaymentTypeMissing}
          isPaymentAmountMissing={isPaymentAmountMissing}
          isPaymentModeMissing={isPaymentModeMissing}
        />

        <CheckoutSummaryCard
          totalItems={totalItems}
          grandTotal={grandTotal}
          isFormValid={isFormValid}
          showValidation={showValidation}
          onConfirm={handleConfirmClick}
        />
      </section>

      <OrderItemsSection
        orderItems={orderItems}
        productOptions={productOptions}
        showValidation={showValidation}
        itemErrors={itemErrors}
        onAddItem={handleAddItem}
        onItemChange={handleItemChange}
        onRemoveItem={handleRemoveItem}
      />

      <ConfirmOrderModal
        open={isConfirmOpen}
        customer={selectedCustomer}
        items={selectedOrderItems}
        grandTotal={grandTotal}
        paymentType={paymentStatus}
        paymentAmount={paymentAmount}
        paymentMode={paymentMode}
        creating={creatingOrder}
        onCreateOrder={handleCreateOrder}
        onClose={() => setIsConfirmOpen(false)}
      />
    </div>
  )
}

export default OrderCreate
