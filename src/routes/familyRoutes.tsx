import { Navigate, type RouteObject } from 'react-router-dom'
import FamilyLayout from '../layouts/FamilyLayout'
import FamilyDashboard from '../pages/family/FamilyDashboard'

const familyRoutes: RouteObject[] = [{
  path: 'family',
  element: <FamilyLayout />,
  children: [
    { index: true, element: <Navigate to="dashboard" replace /> },
    { path: 'dashboard', element: <FamilyDashboard /> },
  ],
}]

export default familyRoutes