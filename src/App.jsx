import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";

/* ================= PUBLIC COMPONENTS ================= */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import BackToTop from "./components/BackToTop"; // New component

/* ================= PUBLIC PAGES ================= */
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import Contact from "./pages/Contact";

/* ================= ADMIN PAGES ================= */
import Login from "./admin/Login";
import AdminDashboard from "./admin/Dashboard";
import ManageImages from "./admin/ManageImages";
import ManageContacts from "./admin/ManageContacts";
import AdminLayout from "./admin/AdminLayout";

/* ================= NEW AUTH PAGES ================= */
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

import { useNavigate, Outlet, useLocation, Navigate } from "react-router-dom";

/* ================= PUBLIC LAYOUT ================= */
const PublicLayout = () => {
  const location = useLocation();
  const hideNavAndFooter = ["/login", "/signup"].includes(location.pathname);

  return (
    <>
      {!hideNavAndFooter && <Navbar />}
      <Outlet />
      <BackToTop />
      <ScrollToTop />
      {!hideNavAndFooter && <Footer />}
    </>
  );
};

/* ================= APP ROUTER ================= */
function App() {
  return (
    <Router>
      <Routes>
        {/* ========== PUBLIC ROUTES (ONLY LOGIN/SIGNUP) ========== */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* ========== PROTECTED ROUTES ========== */}
        <Route element={<ProtectedRoute allowedRoles={['customer', 'farmer', 'distributor', 'admin']} />}>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Route>

        {/* ========== ADMIN ONLY ROUTES ========== */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/manage-images" element={<ManageImages />} />
            <Route path="/admin/manage-contacts" element={<ManageContacts />} />
          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;