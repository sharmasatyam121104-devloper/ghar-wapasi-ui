import { Navigate, type RouteObject } from 'react-router-dom'
import NgoLayout from '../layouts/NgoLayout'
import MyComplaintDetailPage from '../pages/public/MyComplaintDetailPage'
import NgoDashboard from '../pages/ngo/NgoDashboard'
import NgoRegisterPage from '../pages/ngo/NgoRegisterPage'
import NgoStatusPage from '../pages/ngo/NgoStatusPage'

const ngoRoutes: RouteObject[] = [{
  path: 'ngo',
  element: <NgoLayout />,
  children: [
    { index: true, element: <Navigate to="dashboard" replace /> },
    { path: 'dashboard', element: <NgoDashboard /> },
    { path: 'register', element: <NgoRegisterPage /> },
    { path: 'status', element: <NgoStatusPage /> },
    {
      path: 'complaints/:id',
      element: <MyComplaintDetailPage backTo="/ngo/dashboard" backLabel="Back to NGO Portal" showNewComplaint={false} />,
    },
  ],
}]

export default ngoRoutes