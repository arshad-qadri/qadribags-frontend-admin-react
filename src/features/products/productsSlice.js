export { createProduct } from './createProduct'
export { deleteProductImage } from './deleteProductImage'
export { fetchProductBySku } from './fetchProductBySku'
export { fetchProducts } from './fetchProducts'
export { toggleProductStatus } from './toggleProductStatus'
export { updateProduct } from './updateProduct'
export { uploadProductImage } from './uploadProductImage'

export const selectProducts = (state) => state.products.fetchProducts.items
export const selectProductsLoading = (state) => state.products.fetchProducts.loading
export const selectProductsLoaded = (state) => state.products.fetchProducts.loaded
export const selectProductLoading = (state) =>
  state.products.fetchProductBySku.loading
export const selectProductsError = (state) =>
  state.products.fetchProducts.error ||
  state.products.fetchProductBySku.error ||
  state.products.createProduct.error ||
  state.products.updateProduct.error ||
  state.products.toggleProductStatus.error ||
  state.products.uploadProductImage.error ||
  state.products.deleteProductImage.error
export const selectProductStatusUpdating = (state) =>
  state.products.toggleProductStatus.statusUpdating
export const selectProductImageUploading = (state) =>
  state.products.uploadProductImage.imageUploading
export const selectProductImageDeleting = (state) =>
  state.products.deleteProductImage.imageDeleting
export const selectProductUpdating = (state) => state.products.updateProduct.updating
export const selectProductCreating = (state) => state.products.createProduct.creating
export const selectProductBySku = (state, productSku) => {
  const listProduct = state.products.fetchProducts.items.find(
    (product) => product.sku === productSku,
  )

  if (listProduct) {
    return listProduct
  }

  const currentProduct = state.products.fetchProductBySku.item
  return currentProduct?.sku === productSku ? currentProduct : null
}
