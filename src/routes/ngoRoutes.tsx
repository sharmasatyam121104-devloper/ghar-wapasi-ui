import { Navigate, type RouteObject } from 'react-router-dom'
import NgoLayout from '../layouts/NgoLayout'
import MyComplaintDetailPage from '../pages/public/MyComplaintDetailPage'
import NgoDashboard from '../pages/ngo/NgoDashboard'
import NgoEditPage from '../pages/ngo/NgoEditPage'
import NgoRegisterPage from '../pages/ngo/NgoRegisterPage'
import NgoStatusPage from '../pages/ngo/NgoStatusPage'
import { RequireRole } from './guards'

const ngoRoutes: RouteObject[] = [
  // Open: this is the sign-up form for organisations without an account yet.
  {
    path: 'ngo/register',
    element: <NgoLayout />,
    children: [{ index: true, element: <NgoRegisterPage /> }],
  },
  {
    path: 'ngo',
    element: <RequireRole role="ngo"><NgoLayout /></RequireRole>,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <NgoDashboard /> },
      { path: 'status', element: <NgoStatusPage /> },
      { path: 'edit', element: <NgoEditPage /> },
      {
        path: 'complaints/:id',
        element: <MyComplaintDetailPage backTo="/ngo/dashboard" backLabel="Back to NGO Portal" showNewComplaint={false} />,
      },
    ],
  },
]

export default ngoRoutes
