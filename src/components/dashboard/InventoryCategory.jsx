function InventoryCategory({ categories }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-950">
        Inventory by Category
      </h3>
      <p className="mt-1 text-sm text-slate-500">Available stock percentage</p>

      <div className="mt-7 space-y-5">
        {categories.map((category) => (
          <div key={category.label}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-700">
                {category.label}
              </span>
              <span className="font-bold text-slate-950">
                {category.value}%
              </span>
            </div>
            <div className="h-3 rounded-full bg-slate-100">
              <div
                className={`h-3 rounded-full ${category.color}`}
                style={{ width: `${category.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InventoryCategory
