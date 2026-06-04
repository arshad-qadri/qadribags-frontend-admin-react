import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedLayout from '../layouts/ProtectedLayout'
import PublicLayout from '../layouts/PublicLayout'
import Dashboard from '../pages/Dashboard'
import Login from '../pages/Login'
import ProductEdit from '../pages/ProductEdit'
import ProductImages from '../pages/ProductImages'
import Products from '../pages/Products'
import ProductView from '../pages/ProductView'
import Settings from '../pages/Settings'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:productId" element={<ProductView />} />
          <Route path="/products/:productId/edit" element={<ProductEdit />} />
          <Route path="/products/:productId/images" element={<ProductImages />} />
          <Route path="/inventory" element={<Dashboard />} />
          <Route path="/customers" element={<Dashboard />} />
          <Route path="/reports" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
