import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Calendar from "./pages/Calendar";
import Blank from "./pages/Blank";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import AppLayout from "./layout/AppLayout";
import LowAvailibleProducts from "./pages/LowAvailibleProducts";
import AllProducts from "./pages/AllProducts";
import AllUsers from "./pages/AllUsers";
import ProtectedRoute from "./context/ProtectRoute";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <AuthProvider>
          <Routes>
            {/* Dashboard Layout */}
            <Route element={<AppLayout />}>
              <Route index path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />

              <Route path="/all-products" element={
                <ProtectedRoute>
                  <AllProducts />
                </ProtectedRoute>
              } />
              <Route path="/low-availibility-products" element={
                <ProtectedRoute>
                  <LowAvailibleProducts />
                </ProtectedRoute>
              } />

              <Route path="/all-users" element={
                <ProtectedRoute>
                  <AllUsers />
                </ProtectedRoute>
              } />

              {/* Others Page */}
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/blank" element={<Blank />} />
            </Route>

            {/* Auth Layout */}
            <Route path="/login" element={<SignIn />} />

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}
