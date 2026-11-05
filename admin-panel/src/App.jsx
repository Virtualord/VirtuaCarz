import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import AllCars from "./pages/AllCars";
import CarDetails from "./pages/auth/CarDetails";
import AddCar from "./pages/AddCar";
import EditCar from "./pages/EditCar";
import AllBookings from "./pages/AllBookings";
import BookingDetails from "./pages/auth/BookingDetails";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUserData, loadToken } from "./store/authSlice";

const MotionPage = ({ children }) => {
  const prefersReducedMotion = useReducedMotion();

  const pageVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.25 } },
        exit: { opacity: 0, transition: { duration: 0.15 } },
      }
    : {
        hidden: { opacity: 0, y: 14 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        },
        exit: {
          opacity: 0,
          y: -10,
          transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
        },
      };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {children}
    </motion.div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { token, user } = useSelector((state) => state.auth);

  if (!token || !user?.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadToken());
    dispatch(getUserData());
  }, [dispatch]);

  const isAdmin = Boolean(token && user?.isAdmin);

  return (
    <>
      <ToastContainer />
      <AnimatePresence mode="wait">
        <MotionPage key={location.pathname}>
          <Routes location={location}>
            <Route
              path="/login"
              element={isAdmin ? <Navigate to="/" replace /> : <Login />}
            />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/all-cars"
              element={
                <ProtectedRoute>
                  <AllCars />
                </ProtectedRoute>
              }
            />
            <Route
              path="/car-details/:id"
              element={
                <ProtectedRoute>
                  <CarDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-car"
              element={
                <ProtectedRoute>
                  <AddCar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-car/:id"
              element={
                <ProtectedRoute>
                  <EditCar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/all-bookings"
              element={
                <ProtectedRoute>
                  <AllBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking-details/:id"
              element={
                <ProtectedRoute>
                  <BookingDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="*"
              element={<Navigate to={isAdmin ? "/" : "/login"} replace />}
            />
          </Routes>
        </MotionPage>
      </AnimatePresence>
    </>
  );
};

export default App;
