import { Outlet } from 'react-router-dom'

function ProtectedLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white px-6 py-6 lg:block">
        <div className="text-xl font-bold text-emerald-800">QadriBags</div>
        <nav className="mt-8 space-y-2">
          <a
            href="/"
            className="block rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800"
          >
            Dashboard
          </a>
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Admin Panel</p>
              <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
              Admin
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default ProtectedLayout
