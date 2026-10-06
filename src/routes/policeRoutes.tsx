import { Navigate, type RouteObject } from 'react-router-dom'
import PoliceLayout from '../layouts/PoliceLayout'
import MyComplaintDetailPage from '../pages/public/MyComplaintDetailPage'
import RegisterComplaintPage from '../pages/public/RegisterComplaintPage'
import PoliceDashboard from '../pages/police/PoliceDashboard'
import PoliceEditPage from '../pages/police/PoliceEditPage'
import PoliceRegisterPage from '../pages/police/PoliceRegisterPage'
import PoliceStatusPage from '../pages/police/PoliceStatusPage'
import { RequireGuest, RequireRole } from './guards'

const policeRoutes: RouteObject[] = [
  // Sign-up form: guests open it directly, signed-in members get the
  // logout dialog first (RequireGuest).
  {
    path: 'police/register',
    element: <PoliceLayout />,
    children: [{ index: true, element: <RequireGuest><PoliceRegisterPage /></RequireGuest> }],
  },
  {
    path: 'police',
    element: <RequireRole role="police"><PoliceLayout /></RequireRole>,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <PoliceDashboard /> },
      { path: 'status', element: <PoliceStatusPage /> },
      { path: 'edit', element: <PoliceEditPage /> },
      {
        path: 'register-complaint',
        element: (
          <RegisterComplaintPage
            backTo="/police/dashboard"
            backLabel="Back to Police Portal"
            redirectTo="/police/dashboard"
            heading="Register a Complaint (Police Desk)"
            description="Record a missing person complaint filed at your station. Attach the police complaint (FIR) copy — it is mandatory before the case is accepted."
          />
        ),
      },
      {
        path: 'complaints/:id',
        element: <MyComplaintDetailPage backTo="/police/dashboard" backLabel="Back to Police Portal" newComplaintTo="/police/register-complaint" />,
      },
    ],
  },
]

export default policeRoutes
