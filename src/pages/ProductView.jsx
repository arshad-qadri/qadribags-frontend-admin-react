import {
  ArrowLeft,
  BadgeIndianRupee,
  Boxes,
  Edit,
  Images,
  PackageCheck,
  Tag,
} from 'lucide-react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useParams } from 'react-router-dom'
import ImageSlider from '../components/common/ImageSlider'
import StatCard from '../components/common/StatCard'
import {
  fetchProductBySku,
  selectProductLoading,
  selectProductBySku,
} from '../features/products/productsSlice'
import { formatCurrency } from '../utils/numberFormat'

const statusClasses = {
  ACTIVE: 'bg-emerald-50 text-emerald-700',
  INACTIVE: 'bg-slate-100 text-slate-600',
  DRAFT: 'bg-slate-100 text-slate-600',
  LOW_STOCK: 'bg-amber-50 text-amber-700',
}

function ProductView() {
  const { productSku } = useParams()
  const dispatch = useDispatch()
  const loading = useSelector(selectProductLoading)
  const product = useSelector((state) => selectProductBySku(state, productSku))

  useEffect(() => {
    if (productSku) {
      dispatch(fetchProductBySku(productSku))
    }
  }, [dispatch, productSku])

  if (loading && !product) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-500 shadow-sm">
        Loading product details...
      </div>
    )
  }

  if (!product) {
    return <Navigate to="/products" replace />
  }

  const productStats = [
    {
      label: 'Price',
      value: formatCurrency(product.price),
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
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to={`/products/${productSku}/images`}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
          >
            <Images size={17} />
            Edit Images
          </Link>
          <Link
            to={`/products/${productSku}/edit`}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-900/20 transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200"
          >
            <Edit size={17} />
            Edit Product
          </Link>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <ImageSlider
            images={product.images}
            altBase={product.name}
            emptyLabel="No product image"
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
          <section className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
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
              <DetailItem label="Color" value={product.colors} />
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
