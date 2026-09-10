import { Navigate, useRoutes } from 'react-router-dom'
import adminRoutes from './adminRoutes'
import familyRoutes from './familyRoutes'
import finderRoutes from './finderRoutes'
import ngoRoutes from './ngoRoutes'
import policeRoutes from './policeRoutes'
import NotFoundPage from '../pages/NotFound/NotFoundPage'

function AppRoutes() {
  return useRoutes([
    { path: '/', element: <Navigate to="/family/dashboard" replace /> },
    ...familyRoutes,
    ...policeRoutes,
    ...ngoRoutes,
    ...finderRoutes,
    ...adminRoutes,
    { path: '/not-found', element: <NotFoundPage /> },
    { path: '*', element: <NotFoundPage /> },
  ])
}

export default AppRoutes