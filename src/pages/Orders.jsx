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
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Badge from '../components/common/Badge'
import StatCard from '../components/common/StatCard'
import { fetchOrders } from '../features/orders'
import { formatCurrency } from '../utils/numberFormat'
import {
  formatDate,
  formatOrderStatus,
  formatPaymentStatus,
} from '../utils/orderFormat'
import { orderStatusStyles, paymentStatusStyles } from './ordersData'

function Orders() {
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState('')
  const orders = useSelector((state) => state.orders.fetchOrders.items)
  const loading = useSelector((state) => state.orders.fetchOrders.loading)
  const loaded = useSelector((state) => state.orders.fetchOrders.loaded)
  const error = useSelector((state) => state.orders.fetchOrders.error)

  useEffect(() => {
    if (!loaded) {
      dispatch(fetchOrders())
    }
  }, [dispatch, loaded])

  const filteredOrders = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return orders.filter((order) => {
      const customer = order.customer_details?.name || ''
      const customerId = order.customer_id || ''
      const city = order.customer_details?.city || ''

      if (!query) {
        return true
      }

      return [
        order.order_number,
        customer,
        customerId,
        city,
        order.status,
        order.paymentStatus,
        order.payment_status,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    })
  }, [orders, searchTerm])

  const confirmedOrders = orders.filter((order) => order.status === 'CONFIRMED').length
  const pendingPayments = orders.filter((order) => order.payment_status !== 'PAID').length
  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.grand_total || 0),
    0,
  )

  const stats = [
    {
      label: 'Total Orders',
      value: String(orders.length),
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
      label: 'Confirmed',
      value: String(confirmedOrders),
      change: 'Orders confirmed in live data',
      icon: PackageCheck,
      tone: 'violet',
    },
    {
      label: 'Pending Payments',
      value: String(pendingPayments),
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
              Manage live orders, track payment state, and review customer purchases.
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
        {loading ? (
          <div className="p-8 text-center text-sm font-medium text-slate-500">
            Loading orders...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-sm font-medium text-red-700">{error}</div>
        ) : (
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
                {filteredOrders.map((order) => {
                  const paymentLabel = formatPaymentStatus(order.payment_status)
                  const paymentTone =
                    paymentStatusStyles[paymentLabel] || 'bg-slate-100 text-slate-700'
                  const orderLabel = formatOrderStatus(order.status)
                  const orderTone =
                    orderStatusStyles[orderLabel] || 'bg-slate-100 text-slate-700'

                  return (
                    <tr key={order.id} className="bg-white hover:bg-slate-50">
                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">
                        {order.order_number}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-900">
                          {order.customer_details?.name || '-'}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">{order.customer_id}</p>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                        {order.customer_details?.city || '-'}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                        {(order.items || []).reduce(
                          (sum, item) => sum + Number(item.quantity || 0),
                          0,
                        )}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                        {formatCurrency(order.grand_total)}
                      </td>
                      <td className="px-5 py-4">
                        <Badge label={paymentLabel} className={paymentTone} />
                      </td>
                      <td className="px-5 py-4">
                        <Badge label={orderLabel} className={orderTone} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/orders/${order.order_number}`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                            aria-label={`View ${order.order_number}`}
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            to={`/orders/${order.order_number}/edit`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-200"
                            aria-label={`Edit ${order.order_number}`}
                          >
                            <Edit size={16} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default Orders
