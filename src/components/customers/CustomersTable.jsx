import { Edit, Eye, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

function CustomersTable({ customers, onEdit, onDelete }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-4 font-bold">Customer ID</th>
              <th className="px-5 py-4 font-bold">Name</th>
              <th className="px-5 py-4 font-bold">Email</th>
              <th className="px-5 py-4 font-bold">Mobile</th>
              <th className="px-5 py-4 font-bold">Location</th>
              <th className="px-5 py-4 font-bold">Customer Type</th>
              <th className="px-5 py-4 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((customer) => (
              <tr key={customer.id} className="bg-white hover:bg-slate-50">
                <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-600">
                  {customer.customer_id || '-'}
                </td>
                <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-600">
                  {customer.name || '-'}
                </td>
                <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-600">
                  {customer.email || '-'}
                </td>
                <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-600">
                  {customer.mobile_number || '-'}
                </td>
                <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-600">
                  {[customer.city, customer.state].filter(Boolean).join(', ') || '-'}
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  {customer.customer_type || '-'}
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      to={`/customers/${customer.customer_id}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                      aria-label={`View ${customer.name}`}
                    >
                      <Eye size={16} />
                    </Link>
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
