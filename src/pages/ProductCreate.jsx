import { ArrowLeft, ImagePlus, PackagePlus, Save } from 'lucide-react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import InputBox from '../components/common/InputBox'
import {
  createProduct,
  selectProductCreating,
} from '../features/products/productsSlice'

function ProductCreate() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const creating = useSelector(selectProductCreating)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    material: '',
    color: '',
    weight: '',
    dimensions: '',
    supplier: '',
  })

  const handleChange = ({ target }) => {
    const { name, value } = target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch(createProduct(formData))
      .unwrap()
      .then(() => {
        toast.success(`${formData.name} created successfully`)
        navigate('/products')
      })
      .catch((error) => {
        toast.error(error || 'Unable to create product')
      })
  }

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
            Create Product
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Add a new catalog product. Images are uploaded later from the image
            edit page.
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-linear-to-br from-emerald-50 to-white p-4 shadow-sm">
          <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-white text-emerald-700 ring-1 ring-emerald-100">
            <PackagePlus size={28} />
          </div>
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
              placeholder="Premium School Bag"
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
              placeholder="999"
            />
            <InputBox
              label="Stock"
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="100"
            />
          </div>

          <TextAreaBox
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Water resistant school bag with multiple compartments"
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
                  Images are not added during product creation.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  Image upload comes later
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Create the product first, then use the image edit page to
                  upload gallery images.
                </p>
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
                placeholder="Black, Navy Blue, Red"
              />
              <InputBox
                label="Weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="620"
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
                placeholder="Qadri Bags Manufacturing"
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="submit"
                loading={creating}
                loadingText="Creating..."
                className="sm:w-auto sm:px-6"
              >
                <Save size={17} />
                <span className="ml-2">Create Product</span>
              </Button>
              <Link
                to="/products"
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

export default ProductCreate
