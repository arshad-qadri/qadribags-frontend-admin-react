import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'
import { logout } from '../features/auth/authSlice'

const pageTitles = {
  '/': 'Dashboard',
  '/orders': 'Orders',
  '/products': 'Products',
  '/inventory': 'Inventory',
  '/customers': 'Customers',
  '/reports': 'Reports',
  '/settings': 'Settings',
}

function ProtectedLayout() {
  const dispatch = useDispatch()
  const location = useLocation()
  const { token } = useSelector((state) => state.auth)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const pageTitle =
    pageTitles[location.pathname] ||
    (location.pathname === '/orders/create'
      ? 'Create Order'
      : location.pathname.endsWith('/edit') && location.pathname.startsWith('/orders/')
        ? 'Edit Order'
        : location.pathname.startsWith('/orders/')
          ? 'Order Details'
      : location.pathname.startsWith('/products/')
        ? 'Product Details'
        : location.pathname.startsWith('/customers/')
          ? 'Customer Details'
          : 'Dashboard')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((current) => !current)}
      />

      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'lg:pl-24' : 'lg:pl-68'
        }`}
      >
        <Topbar title={pageTitle} onLogout={() => dispatch(logout())} />

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default ProtectedLayout
