import { ArrowLeft, Save } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import OrderItemsSection from '../components/orders/OrderItemsSection'
import OrderCreateCard from '../components/orders/OrderCreateCard'
import { SearchableSelectInput } from '../components/orders/OrderCreateFields'
import { fetchCustomers } from '../features/customers'
import { fetchOrderByOrderNumber, updateOrder } from '../features/orders'
import { fetchProducts } from '../features/products/fetchProducts'

function OrderEdit() {
  const dispatch = useDispatch()
  const { orderId } = useParams()

  const customers = useSelector((state) => state.customers.fetchCustomers.items)
  const customersLoaded = useSelector((state) => state.customers.fetchCustomers.loaded)
  const products = useSelector((state) => state.products.fetchProducts.items)
  const productsLoaded = useSelector((state) => state.products.fetchProducts.loaded)
  const order = useSelector((state) => state.orders.fetchOrderByOrderNumber.item)
  const loading = useSelector((state) => state.orders.fetchOrderByOrderNumber.loading)
  const loaded = useSelector((state) => state.orders.fetchOrderByOrderNumber.loaded)
  const error = useSelector((state) => state.orders.fetchOrderByOrderNumber.error)
  const updating = useSelector((state) => state.orders.updateOrder.updating)

  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [orderItems, setOrderItems] = useState([{ productSku: '', quantity: '1' }])
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

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderByOrderNumber(orderId))
    }
  }, [dispatch, orderId])

  useEffect(() => {
    if (!order) {
      return
    }

    setSelectedCustomerId(order.customer_id || '')
    setOrderItems(
      (order.items || []).length > 0
        ? order.items.map((item) => ({
            productSku: item.sku || '',
            quantity: String(item.quantity || 1),
          }))
        : [{ productSku: '', quantity: '1' }],
    )
  }, [order])

  const customerOptions = useMemo(
    () =>
      customers.map((customer) => ({
        id: customer.customer_id || '',
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

  const itemErrors = orderItems.map((item) => {
    const quantity = Number(item.quantity || 0)

    return {
      productSku: !item.productSku,
      quantity: !item.quantity || Number.isNaN(quantity) || quantity <= 0,
    }
  })

  const selectedOrderItems = orderItems
    .map((item) => {
      const selectedProduct = productOptions.find(
        (product) => product.sku === item.productSku,
      )

      if (!selectedProduct) {
        return null
      }

      return {
        sku: selectedProduct.sku,
        quantity: Number(item.quantity || 0),
      }
    })
    .filter(Boolean)

  const isCustomerMissing = !selectedCustomerId
  const hasInvalidItems = itemErrors.some(
    (itemError) => itemError.productSku || itemError.quantity,
  )
  const isFormValid = !isCustomerMissing && !hasInvalidItems && selectedOrderItems.length > 0

  const handleItemChange = (index, field, value) => {
    setOrderItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    )
  }

  const handleAddItem = () => {
    setOrderItems((current) => [...current, { productSku: '', quantity: '1' }])
  }

  const handleRemoveItem = (index) => {
    setOrderItems((current) =>
      current.length === 1 ? current : current.filter((_, itemIndex) => itemIndex !== index),
    )
  }

  const handleUpdateOrder = () => {
    setShowValidation(true)

    if (!isFormValid) {
      return
    }

    const payload = {
      customer_id: selectedCustomerId,
      order_items: selectedOrderItems,
    }

    dispatch(updateOrder({ orderNumber: orderId, orderData: payload }))
      .unwrap()
      .then(() => {
        toast.success('Order updated successfully')
        dispatch(fetchOrderByOrderNumber(orderId))
      })
      .catch((submitError) => {
        toast.error(submitError || 'Unable to update order')
      })
  }

  if (loading && !order) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-500 shadow-sm">
        Loading order details...
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-sm font-medium text-red-700 shadow-sm">
        {error}
      </div>
    )
  }

  if (loaded && !order) {
    return <Navigate to="/orders" replace />
  }

  if (!order) {
    return null
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm xl:flex-row xl:items-center">
        <div>
          <Link
            to={`/orders/${order.order_number}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-700"
          >
            <ArrowLeft size={17} />
            Back to order details
          </Link>
          <h2 className="mt-3 text-2xl font-bold text-slate-950">Edit Order</h2>
          <p className="mt-2 text-sm text-slate-500">
            Update customer and order items, then save the changes.
          </p>
        </div>
        <button
          type="button"
          onClick={handleUpdateOrder}
          disabled={updating}
          className="inline-flex items-center justify-center rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={18} />
          <span className="ml-2">{updating ? 'Updating...' : 'Update Order'}</span>
        </button>
      </section>

      <OrderCreateCard title="Order Details">
        <div className="grid gap-4 md:grid-cols-2">
          <SearchableSelectInput
            label="Customer"
            value={selectedCustomerId}
            onChange={setSelectedCustomerId}
            options={customerOptions.map((customer) => ({
              value: customer.id,
              label: customer.label,
            }))}
            placeholder="Select customer"
            error={showValidation && isCustomerMissing ? 'Customer is required.' : ''}
          />
        </div>
      </OrderCreateCard>

      <OrderItemsSection
        orderItems={orderItems}
        productOptions={productOptions}
        showValidation={showValidation}
        itemErrors={itemErrors}
        onAddItem={handleAddItem}
        onItemChange={handleItemChange}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  )
}

export default OrderEdit
