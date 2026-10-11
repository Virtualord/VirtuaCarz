import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import { ToastContainer, toast } from 'react-toastify';
import Login from "./pages/auth/Login";
import AllCars from "./pages/AllCars";
import CarDetails from "./pages/auth/CarDetails";
import AddCar from "./pages/AddCar";
import EditCar from "./pages/EditCar";
import AllBookings from "./pages/AllBookings";
import BookingDetails from "./pages/auth/BookingDetails";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUserData ,loadToken } from "./store/authSlice";

const App = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadToken());
    dispatch(getUserData())
  }, [dispatch]);

  return (
    <>
    <ToastContainer />
    <Routes>
      (!token && !user?.isAdmin ? (
      <Route path="/login" element={<Login />} />        
      ): (
        <>
      <Route path="/" element={<Home />} />
      <Route path="/all-cars" element={<AllCars />} />
      <Route path="/car-details/:id" element={<CarDetails />} />
      <Route path="/add-car" element={<AddCar />} />
      <Route path="/edit-car/:id" element={<EditCar />} />
      <Route path="/all-bookings" element={<AllBookings />} />
      <Route path="/booking-details/:id" element={<BookingDetails />} />
        </>
      ))
    </Routes>
    </>
  )
}

export default App
