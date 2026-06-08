import { ArrowLeft, Save } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ordersData } from './ordersData'

function OrderEdit() {
  const { orderId } = useParams()
  const order = ordersData.find((entry) => entry.id === orderId)

  if (!order) {
    return <Navigate to="/orders" replace />
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm xl:flex-row xl:items-center">
        <div>
          <Link
            to={`/orders/${order.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-700"
          >
            <ArrowLeft size={17} />
            Back to order details
          </Link>
          <h2 className="mt-3 text-2xl font-bold text-slate-950">Edit Order</h2>
          <p className="mt-2 text-sm text-slate-500">
            Static edit page with prefilled values. Save is UI-only for now.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          <Save size={18} />
          <span className="ml-2">Update Order</span>
        </button>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <FormCard title="Order Details">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Order ID" value={order.id} />
            <Input label="Customer Name" value={order.customer} />
            <Input label="Customer ID" value={order.customerId} />
            <Input label="Phone Number" value={order.phone} />
            <Input label="Sales Channel" value={order.salesChannel} />
            <Input label="Order Date" type="date" value={order.placedOn} />
            <Input label="Delivery Date" type="date" value={order.deliveryDate} />
            <Input label="Payment Status" value={order.paymentStatus} />
            <Input label="Order Status" value={order.status} />
          </div>
        </FormCard>

        <FormCard title="Shipping & Notes">
          <div className="space-y-4">
            <Textarea label="Shipping Address" value={order.shippingAddress} />
            <Textarea label="Internal Note" value={order.notes} />
          </div>
        </FormCard>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-950">Order Items</h3>
        <div className="mt-5 grid gap-4">
          {order.items.map((item, index) => (
            <div
              key={item.sku}
              className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-4"
            >
              <Input label={`SKU ${index + 1}`} value={item.sku} />
              <Input label="Product Name" value={item.name} />
              <Input label="Quantity" value={String(item.quantity)} />
              <Input label="Price" value={String(item.price)} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function FormCard({ title, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-950">{title}</h3>
      <div className="mt-5">{children}</div>
    </div>
  )
}

function Input({ label, type = 'text', value = '' }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type={type}
        defaultValue={value}
        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  )
}

function Textarea({ label, value = '' }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea
        rows={5}
        defaultValue={value}
        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  )
}

export default OrderEdit
