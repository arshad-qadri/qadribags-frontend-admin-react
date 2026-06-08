import {
  ArrowLeft,
  BadgeIndianRupee,
  CalendarDays,
  CreditCard,
  MapPin,
  Package,
  Phone,
  Store,
  UserRound,
} from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import StatCard from '../components/common/StatCard'
import { formatCurrency } from '../utils/numberFormat'
import { ordersData, orderStatusStyles, paymentStatusStyles } from './ordersData'

function OrderView() {
  const { orderId } = useParams()
  const order = ordersData.find((entry) => entry.id === orderId)

  if (!order) {
    return <Navigate to="/orders" replace />
  }

  const stats = [
    {
      label: 'Order Amount',
      value: formatCurrency(order.amount),
      change: `${order.itemCount} items in this order`,
      icon: BadgeIndianRupee,
      tone: 'emerald',
    },
    {
      label: 'Order Status',
      value: order.status,
      change: 'Static tracking status',
      icon: Package,
      tone: 'blue',
    },
    {
      label: 'Payment Status',
      value: order.paymentStatus,
      change: 'Static settlement preview',
      icon: CreditCard,
      tone: 'violet',
    },
    {
      label: 'Delivery Date',
      value: formatDate(order.deliveryDate),
      change: 'Expected delivery timeline',
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
          <h2 className="mt-3 text-2xl font-bold text-slate-950">{order.id}</h2>
          <p className="mt-2 text-sm text-slate-500">
            Static order detail page for layout and flow preview.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge
            label={order.status}
            className={orderStatusStyles[order.status]}
          />
          <Badge
            label={order.paymentStatus}
            className={paymentStatusStyles[order.paymentStatus]}
          />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
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
                {order.items.map((item) => (
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
        </div>

        <div className="space-y-6">
          <InfoCard
            title="Customer Details"
            lines={[
              { icon: UserRound, text: order.customer },
              { icon: Phone, text: order.phone },
              { icon: Store, text: order.salesChannel },
            ]}
          />
          <InfoCard
            title="Shipping Address"
            lines={[
              { icon: MapPin, text: order.shippingAddress },
              {
                icon: CalendarDays,
                text: `Placed on ${formatDate(order.placedOn)} | Delivery ${formatDate(order.deliveryDate)}`,
              },
            ]}
          />
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-950">Internal Note</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{order.notes}</p>
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

function Badge({ label, className }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
      {label}
    </span>
  )
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export default OrderView
