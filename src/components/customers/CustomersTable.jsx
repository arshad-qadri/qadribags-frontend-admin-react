import { Edit, Trash2 } from 'lucide-react'

const statusClasses = {
  Active: 'bg-emerald-50 text-emerald-700',
  Inactive: 'bg-slate-100 text-slate-600',
  Blocked: 'bg-red-50 text-red-700',
}

function CustomersTable({ customers, onEdit, onDelete }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-4 font-bold">Customer</th>
              <th className="px-5 py-4 font-bold">Phone</th>
              <th className="px-5 py-4 font-bold">Location</th>
              <th className="px-5 py-4 font-bold">Orders</th>
              <th className="px-5 py-4 font-bold">Total Spent</th>
              <th className="px-5 py-4 font-bold">Joined</th>
              <th className="px-5 py-4 font-bold">Status</th>
              <th className="px-5 py-4 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((customer) => (
              <tr key={customer.id} className="bg-white hover:bg-slate-50">
                <td className="px-5 py-4">
                  <div>
                    <p className="font-bold text-slate-950">{customer.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{customer.email}</p>
                  </div>
                </td>
                <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-600">
                  {customer.phone || '-'}
                </td>
                <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-600">
                  {[customer.city, customer.state].filter(Boolean).join(', ') || '-'}
                </td>
                <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-700">
                  {customer.ordersCount}
                </td>
                <td className="whitespace-nowrap px-5 py-4 font-bold text-slate-950">
                  {customer.totalSpent}
                </td>
                <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-600">
                  {customer.joinedOn}
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                      statusClasses[customer.status] || 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {customer.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(customer)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-200"
                      aria-label={`Edit ${customer.name}`}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(customer)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-100"
                      aria-label={`Delete ${customer.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default CustomersTable
