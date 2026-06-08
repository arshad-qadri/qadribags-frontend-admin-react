import { Edit, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'

function CustomersTable({ customers, customerStatuses, onEdit, onStatusToggle }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-4 font-bold">Customer ID</th>
              <th className="px-5 py-4 font-bold">Name</th>
              <th className="px-5 py-4 font-bold">Email</th>
              <th className="px-5 py-4 font-bold">Mobile</th>
              <th className="px-5 py-4 font-bold">Location</th>
              <th className="px-5 py-4 font-bold">Customer Type</th>
              <th className="px-5 py-4 font-bold">Status</th>
              <th className="px-5 py-4 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((customer) => {
              const isActive = customerStatuses[customer.customer_id] ?? true

              return (
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
                  <td className="whitespace-nowrap px-5 py-4">
                    <button
                      type="button"
                      onClick={() => onStatusToggle(customer)}
                      className={`relative inline-flex h-7 w-14 items-center rounded-full transition focus:outline-none focus:ring-4 ${
                        isActive
                          ? 'bg-emerald-600 focus:ring-emerald-100'
                          : 'bg-slate-300 focus:ring-slate-200'
                      }`}
                      aria-pressed={isActive}
                      aria-label={`${isActive ? 'Deactivate' : 'Activate'} ${customer.name}`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition ${
                          isActive ? 'translate-x-8' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span
                      className={`ml-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
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
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default CustomersTable
