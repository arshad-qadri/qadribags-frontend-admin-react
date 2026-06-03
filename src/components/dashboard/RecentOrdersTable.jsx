import { PackageCheck } from 'lucide-react'

function RecentOrdersTable({ orders }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-950">Recent Orders</h3>
          <p className="mt-1 text-sm text-slate-500">
            Latest customer purchases
          </p>
        </div>
        <PackageCheck className="text-emerald-700" size={23} />
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 font-bold">Order</th>
              <th className="px-4 py-3 font-bold">Customer</th>
              <th className="hidden px-4 py-3 font-bold md:table-cell">
                Item
              </th>
              <th className="px-4 py-3 font-bold">Amount</th>
              <th className="px-4 py-3 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.id} className="bg-white">
                <td className="px-4 py-4 font-bold text-slate-900">
                  {order.id}
                </td>
                <td className="px-4 py-4 text-slate-600">
                  {order.customer}
                </td>
                <td className="hidden px-4 py-4 text-slate-600 md:table-cell">
                  {order.item}
                </td>
                <td className="px-4 py-4 font-semibold text-slate-900">
                  {order.amount}
                </td>
                <td className="px-4 py-4">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RecentOrdersTable
