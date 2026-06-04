const defaultProducts = [
  {
    id: 1,
    name: 'Classic School Backpack',
    category: 'School Bags',
    sku: 'QB-SB-104',
    price: 'Rs 1,299',
    stock: 42,
    status: 'Active',
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
    ],
    description:
      'Durable daily backpack with padded straps, bottle pocket, and roomy compartments.',
    material: 'Polyester',
    color: 'Navy Blue',
    weight: '620 g',
    dimensions: '18 x 12 x 7 in',
    supplier: 'QadriBags Warehouse',
  },
  {
    id: 2,
    name: 'Executive Laptop Bag',
    category: 'Laptop Bags',
    sku: 'QB-LB-221',
    price: 'Rs 1,899',
    stock: 6,
    status: 'Low Stock',
    image:
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=900&q=80',
    ],
    description:
      'Professional laptop carrier with premium finish and organized document storage.',
    material: 'Vegan Leather',
    color: 'Charcoal Black',
    weight: '780 g',
    dimensions: '16 x 11 x 4 in',
    supplier: 'QadriBags Warehouse',
  },
  {
    id: 3,
    name: 'Weekend Travel Duffel',
    category: 'Travel Bags',
    sku: 'QB-TB-078',
    price: 'Rs 2,499',
    stock: 18,
    status: 'Active',
    image:
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=80',
    ],
    description:
      'Compact travel duffel for short trips with reinforced handles and side pocket.',
    material: 'Canvas',
    color: 'Teal',
    weight: '940 g',
    dimensions: '22 x 10 x 11 in',
    supplier: 'QadriBags Warehouse',
  },
  {
    id: 4,
    name: 'Premium Hand Bag',
    category: 'Hand Bags',
    sku: 'QB-HB-312',
    price: 'Rs 1,599',
    stock: 27,
    status: 'Active',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
    ],
    description:
      'Elegant handbag with soft texture, zip closure, and polished everyday styling.',
    material: 'Faux Leather',
    color: 'Red',
    weight: '520 g',
    dimensions: '12 x 9 x 5 in',
    supplier: 'QadriBags Warehouse',
  },
  {
    id: 5,
    name: 'Urban Sling Bag',
    category: 'Sling Bags',
    sku: 'QB-SL-058',
    price: 'Rs 899',
    stock: 35,
    status: 'Draft',
    image:
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80',
    ],
    description:
      'Lightweight sling bag for essentials with adjustable strap and compact pockets.',
    material: 'Nylon',
    color: 'Tan',
    weight: '360 g',
    dimensions: '9 x 7 x 3 in',
    supplier: 'QadriBags Warehouse',
  },
  {
    id: 6,
    name: 'Hard Shell Trolley',
    category: 'Travel Bags',
    sku: 'QB-TR-410',
    price: 'Rs 4,999',
    stock: 12,
    status: 'Active',
    image:
      'https://images.unsplash.com/photo-1589979481223-deb893043163?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1589979481223-deb893043163?auto=format&fit=crop&w=900&q=80',
    ],
    description:
      'Spacious trolley luggage with spinner wheels and scratch-resistant shell.',
    material: 'ABS Shell',
    color: 'Silver',
    weight: '3.2 kg',
    dimensions: '24 x 16 x 10 in',
    supplier: 'QadriBags Warehouse',
  },
]

const PRODUCTS_STORAGE_KEY = 'qadribags-products'

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function normalizeProduct(product) {
  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : []

  return {
    ...product,
    image: images[0] ?? '',
    images,
  }
}

function saveProducts(products) {
  if (canUseStorage()) {
    window.localStorage.setItem(
      PRODUCTS_STORAGE_KEY,
      JSON.stringify(products.map(normalizeProduct))
    )
  }
}

export function getProducts() {
  if (!canUseStorage()) {
    return defaultProducts.map(normalizeProduct)
  }

  const storedProducts = window.localStorage.getItem(PRODUCTS_STORAGE_KEY)

  if (!storedProducts) {
    window.localStorage.setItem(
      PRODUCTS_STORAGE_KEY,
      JSON.stringify(defaultProducts)
    )
    return defaultProducts.map(normalizeProduct)
  }

  try {
    return JSON.parse(storedProducts).map(normalizeProduct)
  } catch {
    window.localStorage.setItem(
      PRODUCTS_STORAGE_KEY,
      JSON.stringify(defaultProducts)
    )
    return defaultProducts.map(normalizeProduct)
  }
}

export function getProductById(productId) {
  return getProducts().find((product) => product.id === Number(productId))
}

export function updateProduct(productId, updatedFields) {
  const products = getProducts()
  const nextProducts = products.map((product) =>
    product.id === Number(productId)
      ? normalizeProduct({ ...product, ...updatedFields })
      : product
  )

  saveProducts(nextProducts)

  return nextProducts.find((product) => product.id === Number(productId))
}

export function addProductImage(productId, imageSource) {
  const product = getProductById(productId)

  if (!product) {
    return null
  }

  return updateProduct(productId, {
    images: [...product.images, imageSource],
    image: product.images[0] ?? imageSource,
  })
}

export function deleteProductImage(productId, imageIndex) {
  const product = getProductById(productId)

  if (!product) {
    return null
  }

  const nextImages = product.images.filter((_, index) => index !== imageIndex)

  return updateProduct(productId, {
    images: nextImages,
    image: nextImages[0] ?? '',
  })
}

export { defaultProducts as products }
