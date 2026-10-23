import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import ProtectedRoute, { AdminRoute } from './routes/ProtectedRoute'
import LoginPage from './features/auth/LoginPage'
import RegisterPage from './features/auth/RegisterPage'
import DashboardPage from './features/dashboard/DashboardPage'
import VoituresPage from './features/voitures/VoituresPage'
import ClientsPage from './features/clients/ClientsPage'
import LocationsPage from './features/locations/LocationsPage'
import PaiementsPage from './features/paiements/PaiementsPage'
import AboutPage from './features/about/AboutPage'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/inscription" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="voitures" element={<VoituresPage />} />
        <Route path="locations" element={<LocationsPage />} />
        <Route path="paiements" element={<PaiementsPage />} />
        <Route path="a-propos" element={<AboutPage />} />
        <Route
          path="clients"
          element={
            <AdminRoute>
              <ClientsPage />
            </AdminRoute>
          }
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
