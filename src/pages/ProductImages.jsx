import { ArrowLeft, ImagePlus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { Link, Navigate, useParams } from 'react-router-dom'
import {
  addProductImage,
  deleteProductImage,
  getProductById,
} from '../data/products'

function ProductImages() {
  const { productId } = useParams()
  const [product, setProduct] = useState(() => getProductById(productId))
  const [isUploading, setIsUploading] = useState(false)

  if (!product) {
    return <Navigate to="/products" replace />
  }

  const handleUpload = async ({ target }) => {
    const file = target.files?.[0]

    if (!file) {
      return
    }

    setIsUploading(true)

    try {
      const imageSource = await readFileAsDataUrl(file)
      const nextProduct = addProductImage(productId, imageSource)

      if (!nextProduct) {
        toast.error('Unable to upload image')
        return
      }

      setProduct(nextProduct)
      toast.success('Product image uploaded')
    } catch {
      toast.error('Image upload failed')
    } finally {
      target.value = ''
      setIsUploading(false)
    }
  }

  const handleDelete = (imageIndex) => {
    const nextProduct = deleteProductImage(productId, imageIndex)

    if (!nextProduct) {
      toast.error('Unable to delete image')
      return
    }

    setProduct(nextProduct)
    toast.success('Product image deleted')
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
            Edit Product Images
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Manage uploaded images for {product.name}. The first image is used
            as the cover image across the catalog.
          </p>
        </div>
        <Link
          to={`/products/${productId}/edit`}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
        >
          Product Details
        </Link>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-700">
              Image Library
            </p>
            <h3 className="mt-2 text-xl font-bold text-slate-950">
              Uploaded Images
            </h3>
          </div>

          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-900/20 transition hover:bg-emerald-800 focus-within:ring-4 focus-within:ring-emerald-200">
            <ImagePlus size={18} />
            {isUploading ? 'Uploading...' : 'Upload New Image'}
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={isUploading}
              className="sr-only"
            />
          </label>
        </div>

        {product.images.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
            <p className="text-base font-semibold text-slate-900">
              No product images uploaded yet
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Upload the first image to create the gallery and cover image.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {product.images.map((imageSource, index) => (
              <article
                key={`${product.id}-${index}`}
                className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
              >
                <div className="relative">
                  <img
                    src={imageSource}
                    alt={`${product.name} ${index + 1}`}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  {index === 0 && (
                    <span className="absolute left-3 top-3 rounded-full bg-emerald-700 px-3 py-1 text-xs font-bold text-white">
                      Cover Image
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-semibold text-slate-950">
                      Image {index + 1}
                    </p>
                    <p className="text-sm text-slate-500">
                      Uploaded product media
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(index)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-100"
                    aria-label={`Delete image ${index + 1}`}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

export default ProductImages
