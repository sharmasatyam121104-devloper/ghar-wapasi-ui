import { Navigate, type RouteObject } from 'react-router-dom'
import PoliceLayout from '../layouts/PoliceLayout'
import PoliceDashboard from '../pages/police/PoliceDashboard'

const policeRoutes: RouteObject[] = [{
  path: 'police',
  element: <PoliceLayout />,
  children: [
    { index: true, element: <Navigate to="dashboard" replace /> },
    { path: 'dashboard', element: <PoliceDashboard /> },
  ],
}]

export default policeRoutes