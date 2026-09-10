import { Navigate, type RouteObject } from 'react-router-dom'
import NgoLayout from '../layouts/NgoLayout'
import NgoDashboard from '../pages/ngo/NgoDashboard'

const ngoRoutes: RouteObject[] = [{
  path: 'ngo',
  element: <NgoLayout />,
  children: [
    { index: true, element: <Navigate to="dashboard" replace /> },
    { path: 'dashboard', element: <NgoDashboard /> },
  ],
}]

export default ngoRoutes