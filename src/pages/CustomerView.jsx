import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CreditCard,
  IndianRupee,
  Mail,
  MapPin,
  Package,
  Phone,
  ReceiptText,
  Tag,
  UserRound,
} from 'lucide-react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useParams } from 'react-router-dom'
import StatCard from '../components/common/StatCard'
import {
  fetchCustomerByCustomerId,
  selectSelectedCustomer,
  selectSelectedCustomerError,
  selectSelectedCustomerLoaded,
  selectSelectedCustomerLoading,
} from '../features/customers'
import { formatCurrency } from '../utils/numberFormat'

const dummyOrders = [
  {
    orderId: 'QB-ORD-2401',
    date: '2026-05-28',
    itemCount: 18,
    totalAmount: 48200,
    status: 'Delivered',
    paymentStatus: 'Paid',
  },
  {
    orderId: 'QB-ORD-2367',
    date: '2026-05-14',
    itemCount: 9,
    totalAmount: 21950,
    status: 'Shipped',
    paymentStatus: 'Pending',
  },
  {
    orderId: 'QB-ORD-2294',
    date: '2026-04-30',
    itemCount: 24,
    totalAmount: 65400,
    status: 'Delivered',
    paymentStatus: 'Paid',
  },
]

function CustomerView() {
  const { customerId } = useParams()
  const dispatch = useDispatch()
  const loading = useSelector(selectSelectedCustomerLoading)
  const loaded = useSelector(selectSelectedCustomerLoaded)
  const error = useSelector(selectSelectedCustomerError)
  const customer = useSelector(selectSelectedCustomer)

  useEffect(() => {
    dispatch(fetchCustomerByCustomerId(customerId))
  }, [customerId, dispatch])

  if (loading && !customer) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-500 shadow-sm">
        Loading customer details...
      </div>
    )
  }

  if (loaded && !customer && !error) {
    return <Navigate to="/customers" replace />
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-sm font-medium text-red-700 shadow-sm">
        {error}
      </div>
    )
  }

  if (!customer) {
    return null
  }

  const totalOrderValue = dummyOrders.reduce(
    (sum, order) => sum + order.totalAmount,
    0,
  )
  const totalOrderItems = dummyOrders.reduce(
    (sum, order) => sum + order.itemCount,
    0,
  )

  const customerStats = [
    {
      label: 'Customer Type',
      value: customer.customer_type || '-',
      change: 'Current customer category',
      icon: Tag,
      tone: 'emerald',
    },
    {
      label: 'City',
      value: customer.city || '-',
      change: customer.state || 'Location not available',
      icon: MapPin,
      tone: 'blue',
    },
    {
      label: 'GST Number',
      value: customer.gst_number || '-',
      change: 'Tax registration detail',
      icon: ReceiptText,
      tone: 'violet',
    },
    {
      label: 'Dummy Orders',
      value: String(dummyOrders.length),
      change: `${totalOrderItems} items across placeholder orders`,
      icon: Package,
      tone: 'amber',
    },
  ]

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm xl:flex-row xl:items-center">
        <div>
          <Link
            to="/customers"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-700"
          >
            <ArrowLeft size={17} />
            Back to customers
          </Link>
          <h2 className="mt-3 text-2xl font-bold text-slate-950">
            {customer.name}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {customer.customer_id} | Customer profile and account details.
          </p>
        </div>
        <div className="rounded-xl bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
          <p className="font-semibold">Order module placeholder</p>
          <p className="mt-1 text-emerald-700">
            Showing hardcoded order data until orders API is connected.
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {customerStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-950">Customer Details</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <DetailItem label="Name" value={customer.name} icon={UserRound} />
            <DetailItem label="Email" value={customer.email} icon={Mail} />
            <DetailItem
              label="Mobile"
              value={customer.mobile_number}
              icon={Phone}
            />
            <DetailItem
              label="Customer Type"
              value={customer.customer_type}
              icon={Tag}
            />
            <DetailItem label="City" value={customer.city} icon={MapPin} />
            <DetailItem label="State" value={customer.state} icon={MapPin} />
            <DetailItem label="Pincode" value={customer.pincode} icon={MapPin} />
            <DetailItem
              label="GST Number"
              value={customer.gst_number}
              icon={Building2}
            />
            <DetailItem
              label="Address"
              value={customer.address}
              wide
              icon={Building2}
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-950">Orders</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <OrderSummaryCard
              label="Total Order Value"
              value={formatCurrency(totalOrderValue)}
              icon={IndianRupee}
            />
            <OrderSummaryCard
              label="Outstanding Payments"
              value="Rs 21,950"
              icon={CreditCard}
            />
          </div>
          <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-bold">Order ID</th>
                  <th className="px-4 py-3 font-bold">Date</th>
                  <th className="px-4 py-3 font-bold">Items</th>
                  <th className="px-4 py-3 font-bold">Amount</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dummyOrders.map((order) => (
                  <tr key={order.orderId} className="bg-white">
                    <td className="px-4 py-4 font-semibold text-slate-900">
                      {order.orderId}
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-4 py-4 text-slate-600">{order.itemCount}</td>
                    <td className="px-4 py-4 text-slate-600">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge
                          label={order.status}
                          tone={order.status === 'Delivered' ? 'emerald' : 'blue'}
                        />
                        <StatusBadge
                          label={order.paymentStatus}
                          tone={
                            order.paymentStatus === 'Paid' ? 'emerald' : 'amber'
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            These orders are hardcoded placeholders for UI work. We can replace
            them with live data once the orders endpoint is ready.
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <OrderInfoPanel
          title="Billing Contact"
          icon={Phone}
          lines={[customer.mobile_number || '-', customer.email || '-']}
        />
        <OrderInfoPanel
          title="Shipping Address"
          icon={MapPin}
          lines={[
            customer.address || '-',
            [customer.city, customer.state, customer.pincode]
              .filter(Boolean)
              .join(', ') || '-',
          ]}
        />
        <OrderInfoPanel
          title="Last Order Snapshot"
          icon={CalendarDays}
          lines={[
            `Last order: ${dummyOrders[0]?.orderId || '-'}`,
            `Date: ${dummyOrders[0] ? formatDate(dummyOrders[0].date) : '-'}`,
          ]}
        />
      </section>
    </div>
  )
}

function OrderSummaryCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon size={15} />
        <p className="text-xs font-bold uppercase">{label}</p>
      </div>
      <p className="mt-2 text-lg font-bold text-slate-950">{value}</p>
    </div>
  )
}

function OrderInfoPanel({ title, icon: Icon, lines }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon size={16} />
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">
          {title}
        </h3>
      </div>
      <div className="mt-3 space-y-2 text-sm text-slate-600">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  )
}

function StatusBadge({ label, tone }) {
  const toneClasses = {
    emerald: 'bg-emerald-50 text-emerald-700',
    blue: 'bg-blue-50 text-blue-700',
    amber: 'bg-amber-50 text-amber-700',
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        toneClasses[tone] || toneClasses.blue
      }`}
    >
      {label}
    </span>
  )
}

function formatDate(value) {
  if (!value) {
    return '-'
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function DetailItem({ label, value, icon: Icon, wide = false }) {
  return (
    <div
      className={`rounded-lg border border-slate-100 bg-slate-50 p-4 ${
        wide ? 'sm:col-span-2' : ''
      }`}
    >
      <div className="flex items-center gap-2 text-slate-400">
        <Icon size={14} />
        <p className="text-xs font-bold uppercase">{label}</p>
      </div>
      <p className="mt-2 text-sm font-medium text-slate-900">{value || '-'}</p>
    </div>
  )
}

export default CustomerView
