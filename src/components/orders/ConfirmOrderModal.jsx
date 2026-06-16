import { X } from 'lucide-react'
import Button from '../common/Button'
import { formatCurrency } from '../../utils/numberFormat'

function ConfirmOrderModal({
  open,
  customer,
  items,
  grandTotal,
  paymentType,
  paymentAmount,
  paymentMode,
  creating,
  onCreateOrder,
  onClose,
}) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-6 backdrop-blur-[2px]">
      <div className="h-[88vh] w-full max-w-[1280px] rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-emerald-700">Order Preview</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-950">Confirm Order</h3>
            <p className="mt-2 text-sm text-slate-500">
              Review products and total before creating the order.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            aria-label="Close preview"
          >
            <X size={22} />
          </button>
        </div>

        <div className="mt-8 grid h-[calc(88vh-11rem)] gap-8 lg:grid-cols-[1.45fr_0.95fr]">
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="max-h-[calc(88vh-14rem)] overflow-y-auto">
              <table className="w-full table-fixed text-left text-sm">
                <colgroup>
                  <col className="w-[52%]" />
                  <col className="w-[10%]" />
                  <col className="w-[18%]" />
                  <col className="w-[20%]" />
                </colgroup>
                <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-bold">Product</th>
                    <th className="px-4 py-4 font-bold">Qty</th>
                    <th className="px-4 py-4 font-bold">Price</th>
                    <th className="px-4 py-4 font-bold">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.length > 0 ? (
                    items.map((item) => (
                      <tr key={`${item.sku}-${item.quantity}`} className="bg-white">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-900">{item.name}</p>
                          <p className="mt-1 text-xs text-slate-500">{item.sku}</p>
                        </td>
                        <td className="px-4 py-4 text-slate-600">{item.quantity}</td>
                        <td className="px-4 py-4 text-slate-600">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="px-4 py-4 font-semibold text-slate-900">
                          {formatCurrency(item.lineTotal)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white">
                      <td
                        className="px-4 py-20 text-center text-sm text-slate-500"
                        colSpan={4}
                      >
                        No product selected yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-7">
            <p className="text-sm font-semibold text-emerald-800">Summary</p>
            <div className="mt-4 space-y-3 text-sm text-emerald-950">
              <div className="flex items-center justify-between gap-3">
                <span>Customer</span>
                <span className="text-right font-semibold">
                  {customer?.name || 'Not selected'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Payment Type</span>
                <span className="font-semibold">{paymentType || '-'}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Payment Mode</span>
                <span className="font-semibold">
                  {paymentType === 'Credit' ? '-' : paymentMode || '-'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Amount Paying</span>
                <span className="font-semibold">
                  {paymentAmount ? formatCurrency(paymentAmount) : 'Later'}
                </span>
              </div>
              <div className="border-t border-emerald-200 pt-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-base font-semibold">Grand Total</span>
                  <span className="text-xl font-bold">{formatCurrency(grandTotal)}</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button className="w-full" onClick={onCreateOrder} disabled={creating}>
                {creating ? 'Creating Order...' : 'Create Order'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmOrderModal
