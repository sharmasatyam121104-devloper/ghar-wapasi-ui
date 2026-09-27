import { Navigate, type RouteObject } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import AdminDashboard from '../pages/admin/AdminDashboard'
import MyUsersPage from '../pages/admin/MyUsersPage'
import ReportsPage from '../pages/admin/ReportsPage'
import SuspensionsPage from '../pages/admin/SuspensionsPage'
import VerificationRequestsPage from '../pages/admin/VerificationRequestsPage'

const adminRoutes: RouteObject[] = [{
  path: 'admin',
  element: <AdminLayout />,
  children: [
    { index: true, element: <Navigate to="dashboard" replace /> },
    { path: 'dashboard', element: <AdminDashboard /> },
    { path: 'requests', element: <VerificationRequestsPage /> },
    { path: 'my-users', element: <MyUsersPage /> },
    { path: 'reports', element: <ReportsPage /> },
    { path: 'suspensions', element: <SuspensionsPage /> },
  ],
}]

export default adminRoutes
