import { Edit, Eye, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../../utils/numberFormat'

const statusClasses = {
  ACTIVE: 'bg-emerald-50 text-emerald-700',
  INACTIVE: 'bg-slate-100 text-slate-600',
  DRAFT: 'bg-slate-100 text-slate-600',
  LOW_STOCK: 'bg-amber-50 text-amber-700',
}

function getProductImage(product) {
  return product?.images?.[0]?.url || ''
}

function ProductsTable({ products }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-4 font-bold">Product</th>
              <th className="px-5 py-4 font-bold">Category</th>
              <th className="px-5 py-4 font-bold">SKU</th>
              <th className="px-5 py-4 font-bold">Price</th>
              <th className="px-5 py-4 font-bold">Stock</th>
              <th className="px-5 py-4 font-bold">Status</th>
              <th className="px-5 py-4 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr key={product.id} className="bg-white hover:bg-slate-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-4">
                    {getProductImage(product) ? (
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-100 text-center text-[11px] font-semibold text-slate-500">
                        No image
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-slate-950">
                        {product.name}
                      </p>
                      <p className="mt-1 line-clamp-1 max-w-xs text-xs leading-5 text-slate-500">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-600">
                  {product.category}
                </td>
                <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-700">
                  {product.sku}
                </td>
                <td className="whitespace-nowrap px-5 py-4 font-bold text-slate-950">
                  {formatCurrency(product.price)}
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  <span className="font-bold text-slate-950">
                    {product.stock}
                  </span>
                  <span className="ml-1 text-slate-500">units</span>
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  <span
                    className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${
                      statusClasses[product.status]
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      to={`/products/${product.sku}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                      aria-label={`View ${product.name}`}
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      to={`/products/${product.sku}/edit`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-200"
                      aria-label={`Edit ${product.name}`}
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-100"
                      aria-label={`Delete ${product.name}`}
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

export default ProductsTable
