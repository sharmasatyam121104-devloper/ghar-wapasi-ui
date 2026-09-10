import { Navigate, type RouteObject } from 'react-router-dom'
import FinderLayout from '../layouts/FinderLayout'
import FinderDashboard from '../pages/finder/FinderDashboard'

const finderRoutes: RouteObject[] = [{
  path: 'finder',
  element: <FinderLayout />,
  children: [
    { index: true, element: <Navigate to="dashboard" replace /> },
    { path: 'dashboard', element: <FinderDashboard /> },
  ],
}]

export default finderRoutes