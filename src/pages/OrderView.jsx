import {
  ArrowLeft,
  BadgeIndianRupee,
  CalendarDays,
  CreditCard,
  Landmark,
  MapPin,
  Package,
  Phone,
  Store,
  UserRound,
} from 'lucide-react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useParams } from 'react-router-dom'
import Badge from '../components/common/Badge'
import StatCard from '../components/common/StatCard'
import { fetchOrderByOrderNumber } from '../features/orders'
import { formatCurrency } from '../utils/numberFormat'
import {
  formatDate,
  formatOrderStatus,
  formatPaymentStatus,
  formatPaymentType,
} from '../utils/orderFormat'
import { orderStatusStyles, paymentStatusStyles } from './ordersData'

function OrderView() {
  const dispatch = useDispatch()
  const { orderId } = useParams()
  const order = useSelector((state) => state.orders.fetchOrderByOrderNumber.item)
  const loading = useSelector((state) => state.orders.fetchOrderByOrderNumber.loading)
  const loaded = useSelector((state) => state.orders.fetchOrderByOrderNumber.loaded)
  const error = useSelector((state) => state.orders.fetchOrderByOrderNumber.error)

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderByOrderNumber(orderId))
    }
  }, [dispatch, orderId])

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

  const itemCount = (order.items || []).reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0,
  )
  const paymentLabel = formatPaymentStatus(order.payment_status)
  const paymentTone =
    paymentStatusStyles[paymentLabel] || 'bg-slate-100 text-slate-700'
  const orderLabel = formatOrderStatus(order.status)
  const orderTone = orderStatusStyles[orderLabel] || 'bg-slate-100 text-slate-700'

  const stats = [
    {
      label: 'Order Amount',
      value: formatCurrency(order.grand_total),
      change: `${itemCount} items in this order`,
      icon: BadgeIndianRupee,
      tone: 'emerald',
    },
    {
      label: 'Due Amount',
      value: formatCurrency(order.due_amount),
      change: order.due_amount > 0 ? 'Pending collection amount' : 'No outstanding balance',
      icon: Landmark,
      tone: 'blue',
    },
    {
      label: 'Payment Status',
      value: paymentLabel,
      change: 'Live settlement status',
      icon: CreditCard,
      tone: 'violet',
    },
    {
      label: 'Created On',
      value: formatDate(order.created_at),
      change: 'Order creation timestamp',
      icon: CalendarDays,
      tone: 'amber',
    },
  ]

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
          <h2 className="mt-3 text-2xl font-bold text-slate-950">
            {order.order_number}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Live order details fetched from the orders API.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge label={orderLabel} className={orderTone} />
          <Badge label={paymentLabel} className={paymentTone} />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-950">Order Items</h3>
        <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-bold">SKU</th>
                <th className="px-4 py-3 font-bold">Product</th>
                <th className="px-4 py-3 font-bold">Qty</th>
                <th className="px-4 py-3 font-bold">Price</th>
                <th className="px-4 py-3 font-bold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(order.items || []).map((item) => (
                <tr key={item.sku} className="bg-white">
                  <td className="px-4 py-4 font-medium text-slate-700">{item.sku}</td>
                  <td className="px-4 py-4 text-slate-700">{item.name}</td>
                  <td className="px-4 py-4 text-slate-600">{item.quantity}</td>
                  <td className="px-4 py-4 text-slate-600">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="px-4 py-4 font-semibold text-slate-900">
                    {formatCurrency(item.quantity * item.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="xl:col-span-1">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-950">Payment Details</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <PaymentRow label="Payment Type" value={formatPaymentType(order.payment_type)} />
              <PaymentRow label="Payment Mode" value={order.payment_mode || '-'} />
              <PaymentRow label="Paid Amount" value={formatCurrency(order.paid_amount)} />
              <PaymentRow
                label="Due Amount"
                value={formatCurrency(order.due_amount)}
                valueClassName="text-red-600"
              />
            </div>
          </div>
        </div>
        <div className="xl:col-span-1">
          <InfoCard
            title="Customer Details"
            lines={[
              { icon: UserRound, text: order.customer_details?.name || '-' },
              { icon: Phone, text: order.customer_details?.mobile_number || '-' },
              { icon: Store, text: order.customer_id || '-' },
            ]}
          />
        <div className="mt-4">
          <InfoCard
            title="Order Summary"
            lines={[
              { icon: MapPin, text: order.customer_details?.city || '-' },
              {
                icon: CalendarDays,
                text: `Placed on ${formatDate(order.created_at)}`,
              },
            ]}
          />
        </div>
        </div>
      </section>
    </div>
  )
}

function InfoCard({ title, lines }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-950">{title}</h3>
      <div className="mt-4 space-y-3">
        {lines.map((line) => {
          const Icon = line.icon

          return (
            <div key={line.text} className="flex items-start gap-3 text-sm text-slate-600">
              <Icon size={16} className="mt-0.5 text-slate-400" />
              <p>{line.text}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PaymentRow({ label, value, valueClassName = 'text-slate-900' }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-4 py-3">
      <span className="font-medium text-slate-500">{label}</span>
      <span className={`font-semibold ${valueClassName}`}>{value}</span>
    </div>
  )
}

export default OrderView
