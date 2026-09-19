import { Navigate, type RouteObject } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import PublicDashboard from '../pages/public/PublicDashboard'
import MyComplaintsPage from '../pages/public/MyComplaintsPage'
import MyComplaintDetailPage from '../pages/public/MyComplaintDetailPage'
import RegisterComplaintPage from '../pages/public/RegisterComplaintPage'

const publicRoutes: RouteObject[] = [{
  path: 'public',
  element: <PublicLayout />,
  children: [
    { index: true, element: <Navigate to="dashboard" replace /> },
    { path: 'dashboard', element: <PublicDashboard /> },
    { path: 'my-complaints', element: <MyComplaintsPage /> },
    { path: 'my-complaints/:id', element: <MyComplaintDetailPage /> },
    { path: 'register-complaint', element: <RegisterComplaintPage /> },
  ],
}]

export default publicRoutes