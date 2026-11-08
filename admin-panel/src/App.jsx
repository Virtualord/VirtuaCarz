import { Routes, Route, Navigate } from "react-router-dom";
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

const ProtectedRoute = ({ children }) => {
  const { token, user } = useSelector((state) => state.auth);

  if (!token || !user?.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadToken());
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(getUserData());
    }
  }, [dispatch, token]);

  const isAdmin = Boolean(token && user?.isAdmin);

  return (
    <>
      <ToastContainer />
      <Routes>
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
    </>
  );
};

export default App;
