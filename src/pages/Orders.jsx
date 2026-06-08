import {
  BadgeIndianRupee,
  ClipboardList,
  Edit,
  PackageCheck,
  Plus,
  Search,
  TimerReset,
  Eye,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import StatCard from '../components/common/StatCard'
import { formatCurrency } from '../utils/numberFormat'
import { ordersData, orderStatusStyles, paymentStatusStyles } from './ordersData'

function Orders() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredOrders = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return ordersData.filter((order) => {
      if (!query) {
        return true
      }

      return [
        order.id,
        order.customer,
        order.customerId,
        order.city,
        order.status,
        order.paymentStatus,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    })
  }, [searchTerm])

  const deliveredOrders = ordersData.filter((order) => order.status === 'Delivered').length
  const pendingOrders = ordersData.filter((order) => order.paymentStatus !== 'Paid').length
  const totalRevenue = ordersData.reduce((sum, order) => sum + order.amount, 0)

  const stats = [
    {
      label: 'Total Orders',
      value: String(ordersData.length),
      change: `${filteredOrders.length} orders visible`,
      icon: ClipboardList,
      tone: 'emerald',
    },
    {
      label: 'Order Value',
      value: formatCurrency(totalRevenue),
      change: 'Static preview for UI build',
      icon: BadgeIndianRupee,
      tone: 'blue',
    },
    {
      label: 'Delivered',
      value: String(deliveredOrders),
      change: 'Completed shipments in static data',
      icon: PackageCheck,
      tone: 'violet',
    },
    {
      label: 'Pending Payments',
      value: String(pendingOrders),
      change: 'Orders awaiting full settlement',
      icon: TimerReset,
      tone: 'amber',
    },
  ]

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
          <div>
            <p className="text-sm font-semibold text-emerald-700">Orders</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">Order Management</h2>
            <p className="mt-2 text-sm text-slate-500">
              Static order pages for now. We can wire live APIs later without changing
              the overall layout.
            </p>
          </div>
          <Link
            to="/orders/create"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            <Plus size={18} />
            <span className="ml-2">Create Order</span>
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative w-full lg:max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            placeholder="Search order id, customer, city, status"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4 font-bold">Order ID</th>
                <th className="px-5 py-4 font-bold">Customer</th>
                <th className="px-5 py-4 font-bold">Date</th>
                <th className="px-5 py-4 font-bold">Location</th>
                <th className="px-5 py-4 font-bold">Items</th>
                <th className="px-5 py-4 font-bold">Amount</th>
                <th className="px-5 py-4 font-bold">Payment</th>
                <th className="px-5 py-4 font-bold">Status</th>
                <th className="px-5 py-4 text-right font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="bg-white hover:bg-slate-50">
                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">
                    {order.id}
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-900">{order.customer}</p>
                    <p className="mt-1 text-xs text-slate-500">{order.customerId}</p>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                    {formatDate(order.placedOn)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                    {order.city}, {order.state}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                    {order.itemCount}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                    {formatCurrency(order.amount)}
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      label={order.paymentStatus}
                      className={paymentStatusStyles[order.paymentStatus]}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      label={order.status}
                      className={orderStatusStyles[order.status]}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/orders/${order.id}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                        aria-label={`View ${order.id}`}
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        to={`/orders/${order.id}/edit`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-200"
                        aria-label={`Edit ${order.id}`}
                      >
                        <Edit size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
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

export default Orders
