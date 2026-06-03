import { Filter, PackagePlus, Search } from 'lucide-react'
import StatCard from '../components/common/StatCard'
import { AlertTriangle, Boxes, IndianRupee, ShoppingBag } from 'lucide-react'
import ProductsTable from '../components/products/ProductsTable'
import { products } from '../data/products'

const productStats = [
  {
    label: 'Total Products',
    value: '248',
    change: '+14 added',
    icon: ShoppingBag,
    tone: 'emerald',
  },
  {
    label: 'Available Stock',
    value: '1,842',
    change: '94% stocked',
    icon: Boxes,
    tone: 'blue',
  },
  {
    label: 'Low Stock',
    value: '8',
    change: 'Needs reorder',
    icon: AlertTriangle,
    tone: 'amber',
  },
  {
    label: 'Catalog Value',
    value: 'Rs 12.6L',
    change: '+9.3%',
    icon: IndianRupee,
    tone: 'violet',
  },
]

function Products() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm xl:flex-row xl:items-center">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Products</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">
            Product Catalog
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Manage bag listings, pricing, stock levels, and product status.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-900/20 transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200"
        >
          <PackagePlus size={18} />
          Add Product
        </button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {productStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              placeholder="Search products, SKU, category"
              className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
            />
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
          >
            <Filter size={17} />
            Filter
          </button>
        </div>
      </section>

      <ProductsTable products={products} />
    </div>
  )
}

export default Products
