function OrderCreateCard({ title, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-950">{title}</h3>
      <div className="mt-5">{children}</div>
    </div>
  )
}

export default OrderCreateCard
