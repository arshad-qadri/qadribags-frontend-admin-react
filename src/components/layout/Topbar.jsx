import { LogOut } from 'lucide-react'

function Topbar({ title, onLogout }) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Admin Panel</p>
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-200"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </header>
  )
}

export default Topbar
