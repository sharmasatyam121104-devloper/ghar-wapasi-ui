import { Navigate, type RouteObject } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import PublicDashboard from '../pages/public/PublicDashboard'

const publicRoutes: RouteObject[] = [{
  path: 'public',
  element: <PublicLayout />,
  children: [
    { index: true, element: <Navigate to="dashboard" replace /> },
    { path: 'dashboard', element: <PublicDashboard /> },
  ],
}]

export default publicRoutes