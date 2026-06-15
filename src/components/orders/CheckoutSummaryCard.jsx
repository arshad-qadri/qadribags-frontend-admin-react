import { formatCurrency } from '../../utils/numberFormat'
import OrderCreateCard from './OrderCreateCard'

function CheckoutSummaryCard({
  totalItems,
  grandTotal,
  isFormValid,
  showValidation,
  onConfirm,
}) {
  return (
    <OrderCreateCard title="Checkout Summary">
      <div className="space-y-4">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5">
          <div className="space-y-3 text-sm text-emerald-900">
            <div className="flex items-center justify-between">
              <span>Total Items</span>
              <span className="font-semibold">{totalItems}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Grand Total</span>
              <span className="text-lg font-bold">{formatCurrency(grandTotal)}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onConfirm}
            className={`mt-5 inline-flex w-full items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold text-white transition ${
              isFormValid ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-emerald-400'
            }`}
          >
            Confirm
          </button>
          {showValidation && !isFormValid ? (
            <p className="mt-3 text-sm font-medium text-red-600">
              Fill all required fields before opening checkout summary.
            </p>
          ) : null}
        </div>
      </div>
    </OrderCreateCard>
  )
}

export default CheckoutSummaryCard
