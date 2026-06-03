import {
  AlertTriangle,
  BadgeIndianRupee,
  Boxes,
  PackageCheck,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react'

const stats = [
  {
    label: 'Total Revenue',
    value: '₹2.84L',
    change: '+18.4%',
    icon: BadgeIndianRupee,
    tone: 'emerald',
  },
  {
    label: 'Orders Today',
    value: '126',
    change: '+12.8%',
    icon: ShoppingCart,
    tone: 'blue',
  },
  {
    label: 'Inventory Items',
    value: '1,842',
    change: '94% stocked',
    icon: Boxes,
    tone: 'violet',
  },
  {
    label: 'Low Stock SKUs',
    value: '8',
    change: 'Needs reorder',
    icon: AlertTriangle,
    tone: 'amber',
  },
]

const salesData = [
  { month: 'Jan', sales: 42 },
  { month: 'Feb', sales: 58 },
  { month: 'Mar', sales: 48 },
  { month: 'Apr', sales: 72 },
  { month: 'May', sales: 66 },
  { month: 'Jun', sales: 84 },
]

const categoryStock = [
  { label: 'School Bags', value: 78, color: 'bg-emerald-600' },
  { label: 'Travel Bags', value: 64, color: 'bg-blue-600' },
  { label: 'Hand Bags', value: 52, color: 'bg-violet-600' },
  { label: 'Laptop Bags', value: 43, color: 'bg-amber-500' },
]

const lowStockItems = [
  { name: 'Classic School Backpack', sku: 'QB-SB-104', stock: 9, reorder: 30 },
  { name: 'Executive Laptop Bag', sku: 'QB-LB-221', stock: 6, reorder: 20 },
  { name: 'Weekend Travel Duffel', sku: 'QB-TB-078', stock: 4, reorder: 18 },
  { name: 'Premium Hand Bag', sku: 'QB-HB-312', stock: 7, reorder: 24 },
]

const recentOrders = [
  { id: '#QB1024', customer: 'Ayesha Khan', item: 'School Backpack', amount: '₹1,299', status: 'Delivered' },
  { id: '#QB1023', customer: 'Rahil Shaikh', item: 'Travel Duffel', amount: '₹2,499', status: 'Packed' },
  { id: '#QB1022', customer: 'Neha Patel', item: 'Laptop Bag', amount: '₹1,899', status: 'Pending' },
  { id: '#QB1021', customer: 'Sameer Ali', item: 'Hand Bag', amount: '₹1,599', status: 'Shipped' },
]

const toneClasses = {
  emerald: 'bg-emerald-50 text-emerald-700',
  blue: 'bg-blue-50 text-blue-700',
  violet: 'bg-violet-50 text-violet-700',
  amber: 'bg-amber-50 text-amber-700',
}

function Dashboard() {
  return (
    <div className="space-y-6">
    

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-3xl font-bold text-slate-950">
                    {stat.value}
                  </p>
                </div>
                <div className={`rounded-lg p-3 ${toneClasses[stat.tone]}`}>
                  <Icon size={22} />
                </div>
              </div>
              <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">
                <TrendingUp size={15} />
                {stat.change}
              </p>
            </div>
          )
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-950">
                Monthly Sales
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Revenue trend for the current year
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              +16.2%
            </span>
          </div>

          <div className="mt-8 flex h-72 items-end gap-3 sm:gap-5">
            {salesData.map((item) => (
              <div key={item.month} className="flex flex-1 flex-col items-center gap-3">
                <div className="flex h-56 w-full items-end rounded-lg bg-slate-100 p-1">
                  <div
                    className="w-full rounded-md bg-emerald-600 transition hover:bg-emerald-700"
                    style={{ height: `${item.sales}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-950">
            Inventory by Category
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Available stock percentage
          </p>

          <div className="mt-7 space-y-5">
            {categoryStock.map((category) => (
              <div key={category.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700">
                    {category.label}
                  </span>
                  <span className="font-bold text-slate-950">
                    {category.value}%
                  </span>
                </div>
                <div className="h-3 rounded-full bg-slate-100">
                  <div
                    className={`h-3 rounded-full ${category.color}`}
                    style={{ width: `${category.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1.3fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-950">
                Low Stock Alerts
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Products below reorder level
              </p>
            </div>
            <AlertTriangle className="text-amber-500" size={22} />
          </div>

          <div className="space-y-3">
            {lowStockItems.map((item) => (
              <div
                key={item.sku}
                className="rounded-lg border border-slate-100 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      {item.sku}
                    </p>
                  </div>
                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                    {item.stock} left
                  </span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white">
                  <div
                    className="h-2 rounded-full bg-red-500"
                    style={{ width: `${(item.stock / item.reorder) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-950">
                Recent Orders
              </h3>
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
                {recentOrders.map((order) => (
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
      </section>
    </div>
  )
}

export default Dashboard
