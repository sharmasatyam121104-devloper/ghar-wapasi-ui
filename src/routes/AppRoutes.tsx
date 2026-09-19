import { useRoutes } from 'react-router-dom'
import adminRoutes from './adminRoutes'
import publicRoutes from './publicRoutes'
import ngoRoutes from './ngoRoutes'
import policeRoutes from './policeRoutes'
import AboutPage from '../pages/public/AboutPage'
import GuidelinesPage from '../pages/public/GuidelinesPage'
import ContactPage from '../pages/public/ContactPage'
import PrivacyPage from '../pages/public/PrivacyPage'
import LandingPage from '../pages/landing/LandingPage'
import SignupPage from '../pages/auth/SignupPage'
import LoginPage from '../pages/auth/LoginPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import NotFoundPage from '../pages/NotFound/NotFoundPage'

function AppRoutes() {
  return useRoutes([
    { path: '/', element: <LandingPage /> },
    { path: '/signup', element: <SignupPage /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/forgot-password', element: <ForgotPasswordPage /> },
    ...policeRoutes,
    ...ngoRoutes,
    ...publicRoutes,
    ...adminRoutes,
    { path: '/about', element: <AboutPage /> },
    { path: '/guidelines', element: <GuidelinesPage /> },
    { path: '/contact', element: <ContactPage /> },
    { path: '/privacy-policy', element: <PrivacyPage /> },
    { path: '/not-found', element: <NotFoundPage /> },
    { path: '*', element: <NotFoundPage /> },
  ])
}

export default AppRoutes