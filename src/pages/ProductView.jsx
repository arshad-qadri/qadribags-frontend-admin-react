import {
  ArrowLeft,
  BadgeIndianRupee,
  Boxes,
  Edit,
  PackageCheck,
  Tag,
} from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import StatCard from '../components/common/StatCard'
import { products } from '../data/products'

const statusClasses = {
  Active: 'bg-emerald-50 text-emerald-700',
  Draft: 'bg-slate-100 text-slate-600',
  'Low Stock': 'bg-amber-50 text-amber-700',
}

function ProductView() {
  const { productId } = useParams()
  const product = products.find((item) => item.id === Number(productId))

  if (!product) {
    return <Navigate to="/products" replace />
  }

  const productStats = [
    {
      label: 'Price',
      value: product.price,
      change: 'Current selling price',
      icon: BadgeIndianRupee,
      tone: 'emerald',
    },
    {
      label: 'Available Stock',
      value: String(product.stock),
      change: `${product.stock} units available`,
      icon: Boxes,
      tone: product.stock <= 10 ? 'amber' : 'blue',
    },
    {
      label: 'Category',
      value: product.category,
      change: product.sku,
      icon: Tag,
      tone: 'violet',
    },
  ]

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm xl:flex-row xl:items-center">
        <div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-700"
          >
            <ArrowLeft size={17} />
            Back to products
          </Link>
          <h2 className="mt-3 text-2xl font-bold text-slate-950">
            {product.name}
          </h2>
          <p className="mt-2 text-sm text-slate-500">{product.description}</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-900/20 transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200"
        >
          <Edit size={17} />
          Edit Product
        </button>
      </section>

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <img
            src={product.image}
            alt={product.name}
            className="aspect-[4/3] w-full object-cover"
          />
          <div className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">
                  Product Status
                </p>
                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-bold ${
                    statusClasses[product.status]
                  }`}
                >
                  {product.status}
                </span>
              </div>
              <div className="rounded-lg bg-emerald-50 p-3 text-emerald-700">
                <PackageCheck size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-3">
            {productStats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-950">
              Product Details
            </h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <DetailItem label="SKU" value={product.sku} />
              <DetailItem label="Category" value={product.category} />
              <DetailItem label="Material" value={product.material} />
              <DetailItem label="Color" value={product.color} />
              <DetailItem label="Weight" value={product.weight} />
              <DetailItem label="Dimensions" value={product.dimensions} />
              <DetailItem label="Supplier" value={product.supplier} wide />
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}

function DetailItem({ label, value, wide = false }) {
  return (
    <div
      className={`rounded-lg border border-slate-100 bg-slate-50 p-4 ${
        wide ? 'sm:col-span-2' : ''
      }`}
    >
      <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
      <p className="mt-2 font-semibold text-slate-950">{value}</p>
    </div>
  )
}

export default ProductView
