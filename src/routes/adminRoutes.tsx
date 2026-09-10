import { Navigate, type RouteObject } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import AdminDashboard from '../pages/admin/AdminDashboard'

const adminRoutes: RouteObject[] = [{
  path: 'admin',
  element: <AdminLayout />,
  children: [
    { index: true, element: <Navigate to="dashboard" replace /> },
    { path: 'dashboard', element: <AdminDashboard /> },
  ],
}]

export default adminRoutes