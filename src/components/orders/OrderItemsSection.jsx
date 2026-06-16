import { PackagePlus, Plus, Trash2 } from 'lucide-react'
import { formatCurrency } from '../../utils/numberFormat'
import { Input, ReadOnlyField, SelectInput } from './OrderCreateFields'

function OrderItemsSection({
  orderItems,
  productOptions,
  showValidation,
  itemErrors,
  onAddItem,
  onItemChange,
  onRemoveItem,
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <PackagePlus size={18} className="text-emerald-700" />
          <h3 className="text-lg font-bold text-slate-950">Order Items</h3>
        </div>
        <button
          type="button"
          onClick={onAddItem}
          className="inline-flex items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
        >
          <Plus size={16} />
          <span className="ml-2"> Product</span>
        </button>
      </div>

      <div className="mt-5 max-h-[460px] overflow-y-auto pr-2">
        <div className="mb-3 hidden items-center gap-4 px-4 text-sm font-semibold text-slate-700 md:grid md:grid-cols-[1.8fr_0.7fr_0.8fr_0.9fr_0.9fr_auto]">
          <div>Product</div>
          <div>Quantity</div>
          <div>Stock</div>
          <div>Price</div>
          <div>Total</div>
          <div />
        </div>
        <div className="grid gap-4">
          {orderItems.map((item, index) => {
            const selectedProduct = productOptions.find(
              (product) => product.sku === item.productSku,
            )
            const selectedSkusInOtherRows = orderItems
              .filter((_, itemIndex) => itemIndex !== index)
              .map((orderItem) => orderItem.productSku)
              .filter(Boolean)
            const availableProductOptions = productOptions.filter(
              (product) =>
                product.sku === item.productSku ||
                !selectedSkusInOtherRows.includes(product.sku),
            )
            const quantity = Number(item.quantity || 0)
            const lineTotal = (selectedProduct?.price || 0) * quantity

            return (
              <div
                key={`order-item-${index}`}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="mb-3 text-sm font-semibold text-slate-700 md:hidden">
                  Product {index + 1}
                </div>
                <div className="grid gap-4 md:grid-cols-[1.8fr_0.7fr_0.8fr_0.9fr_0.9fr_auto]">
                  <SelectInput
                    label={`Product ${index + 1}`}
                    hideLabel
                    value={item.productSku}
                    onChange={(value) => onItemChange(index, 'productSku', value)}
                    options={availableProductOptions.map((product) => ({
                      value: product.sku,
                      label: product.label,
                    }))}
                    placeholder="Select product"
                    error={
                      showValidation && itemErrors[index]?.productSku
                        ? 'Product is required.'
                        : ''
                    }
                  />
                  <Input
                    label="Quantity"
                    hideLabel
                    placeholder="1"
                    value={item.quantity}
                    onChange={(value) => onItemChange(index, 'quantity', value)}
                    error={
                      showValidation && itemErrors[index]?.quantity
                        ? 'Enter a valid quantity.'
                        : ''
                    }
                  />
                  <ReadOnlyField
                    label="Stock"
                    hideLabel
                    value={selectedProduct ? String(selectedProduct.stock) : 'Select product'}
                  />
                  <ReadOnlyField
                    label="Price"
                    hideLabel
                    value={
                      selectedProduct ? formatCurrency(selectedProduct.price) : 'Select product'
                    }
                  />
                  <ReadOnlyField
                    label="Total"
                    hideLabel
                    value={selectedProduct ? formatCurrency(lineTotal) : 'Select product'}
                  />
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => onRemoveItem(index)}
                      disabled={orderItems.length === 1}
                      className="inline-flex h-[46px] w-full items-center justify-center rounded-lg border border-red-200 bg-red-50 px-4 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default OrderItemsSection
