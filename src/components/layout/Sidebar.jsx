import {
  BarChart3,
  Boxes,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Home,
  Package,
  Settings,
  ShoppingBag,
  Users,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const menuItems = [
  { label: 'Dashboard', icon: Home, path: '/' },
  { label: 'Orders', icon: ClipboardList, path: '/orders' },
  { label: 'Products', icon: ShoppingBag, path: '/products' },
  { label: 'Inventory', icon: Boxes, path: '/inventory' },
  { label: 'Customers', icon: Users, path: '/customers' },
  { label: 'Reports', icon: BarChart3, path: '/reports' },
  { label: 'Settings', icon: Settings, path: '/settings' },
]

function Sidebar({ collapsed, onToggle }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 hidden border-r border-slate-200 bg-white py-6 transition-all duration-300 lg:block ${
        collapsed ? 'w-24 px-4' : 'w-72 px-5'
      }`}
    >
      <div
        className={`flex items-center gap-3 px-2 ${
          collapsed ? 'justify-center' : 'justify-between'
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-lg shadow-emerald-900/15">
            <Package size={23} strokeWidth={2.4} />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate text-xl font-bold text-emerald-800">
                QadriBags
              </div>
              <p className="truncate text-xs font-medium text-slate-500">
                Admin Console
              </p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-slate-200 ${
            collapsed ? 'absolute left-1/2 top-24 -translate-x-1/2' : ''
          }`}
        >
          {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
        </button>
      </div>

      <nav className={`${collapsed ? 'mt-20' : 'mt-8'} space-y-1`}>
        {menuItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === '/'}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center rounded-lg py-3 text-sm font-semibold transition ${
                  collapsed ? 'justify-center px-3' : 'gap-3 px-4'
                } ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                }`
              }
            >
              <Icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>

      {!collapsed && (
        <div className="absolute bottom-6 left-5 right-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
          <p className="text-sm font-bold text-emerald-900">Stock Health</p>
          <p className="mt-1 text-xs leading-5 text-emerald-700">
            8 items need attention across school and travel bag categories.
          </p>
        </div>
      )}
    </aside>
  )
}

export default Sidebar
