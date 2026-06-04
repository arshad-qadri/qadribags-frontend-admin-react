import { ArrowLeft, ImagePlus, Save } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import Button from '../components/common/Button'
import InputBox from '../components/common/InputBox'
import { getProductById, updateProduct } from '../data/products'

const statusOptions = ['Active', 'Draft', 'Low Stock']

function ProductEdit() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const product = getProductById(productId)

  const [formData, setFormData] = useState(() =>
    product
      ? {
          name: product.name,
          category: product.category,
          sku: product.sku,
          price: product.price,
          stock: String(product.stock),
          status: product.status,
          description: product.description,
          material: product.material,
          color: product.color,
          weight: product.weight,
          dimensions: product.dimensions,
          supplier: product.supplier,
        }
      : null
  )

  if (!product || !formData) {
    return <Navigate to="/products" replace />
  }

  const handleChange = ({ target }) => {
    const { name, value } = target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextProduct = updateProduct(productId, {
      ...formData,
      stock: Number(formData.stock) || 0,
    })

    toast.success(`${nextProduct.name} updated successfully`)
    navigate(`/products/${productId}`)
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm xl:flex-row xl:items-center">
        <div>
          <Link
            to={`/products/${productId}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-700"
          >
            <ArrowLeft size={17} />
            Back to product
          </Link>
          <h2 className="mt-3 text-2xl font-bold text-slate-950">
            Edit Product
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Update catalog details, stock information, and how this product
            appears in the storefront.
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-linear-to-br from-emerald-50 to-white p-3 shadow-sm">
          {product.image ? (
            <img
              src={product.image}
              alt={formData.name}
              className="h-24 w-24 rounded-xl object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-slate-100 text-center text-xs font-semibold text-slate-500">
              No image
            </div>
          )}
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]"
      >
        <section className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-semibold text-emerald-700">
              Core Details
            </p>
            <h3 className="mt-2 text-xl font-bold text-slate-950">
              Product Information
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <InputBox
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
            />
            <InputBox
              label="SKU"
              name="sku"
              value={formData.sku}
              readOnly
              placeholder="QB-SB-104"
            />
            <InputBox
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="School Bags"
            />
            <InputBox
              label="Price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Rs 1,299"
            />
            <InputBox
              label="Stock"
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="42"
            />
            <SelectBox
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={statusOptions}
            />
          </div>

          <TextAreaBox
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write a clear product summary"
          />
        </section>

        <section className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
                <ImagePlus size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-950">Media and Specs</h3>
                <p className="text-sm text-slate-500">
                  Product images are managed on a separate image edit page.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  Image upload is separate
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Use the dedicated product image page to update gallery and
                  thumbnail assets.
                </p>
                <Link
                  to={`/products/${productId}/images`}
                  className="mt-4 inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-emerald-700 ring-1 ring-slate-200 transition hover:bg-emerald-50"
                >
                  Open Image Manager
                </Link>
              </div>
              <InputBox
                label="Material"
                name="material"
                value={formData.material}
                onChange={handleChange}
                placeholder="Polyester"
              />
              <InputBox
                label="Color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="Navy Blue"
              />
              <InputBox
                label="Weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="620 g"
              />
              <InputBox
                label="Dimensions"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleChange}
                placeholder="18 x 12 x 7 in"
              />
              <InputBox
                label="Supplier"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                placeholder="QadriBags Warehouse"
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit" className="sm:w-auto sm:px-6">
                <Save size={17} />
                <span className="ml-2">Save Changes</span>
              </Button>
              <Link
                to={`/products/${productId}`}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
              >
                Cancel
              </Link>
            </div>
          </div>
        </section>
      </form>
    </div>
  )
}

function SelectBox({ label, name, value, onChange, options }) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

function TextAreaBox({ label, name, value, onChange, placeholder }) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={5}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
      />
    </div>
  )
}

export default ProductEdit
