function SalesChart({ data }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-950">Monthly Sales</h3>
          <p className="mt-1 text-sm text-slate-500">
            Revenue trend for the current year
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
          +16.2%
        </span>
      </div>

      <div className="mt-8 flex h-72 items-end gap-3 sm:gap-5">
        {data.map((item) => (
          <div
            key={item.month}
            className="flex flex-1 flex-col items-center gap-3"
          >
            <div className="flex h-56 w-full items-end rounded-lg bg-slate-100 p-1">
              <div
                className="w-full rounded-md bg-emerald-600 transition hover:bg-emerald-700"
                style={{ height: `${item.sales}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {item.month}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SalesChart
