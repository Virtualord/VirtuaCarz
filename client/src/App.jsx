import './App.css'
import { Routes, Route } from "react-router";
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Cars from './pages/Car/Cars'
import Footer from './components/Footer';
import Header from './components/Header';
import { Toaster } from "react-hot-toast"; 
import CarDetails from './pages/Car/CarDetails';
import Profile from './pages/user/Profile';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { loadToken } from './store/features/authSlice';
function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadToken());
  }, [dispatch]);

  return (
    <div className="flex min-h-screen flex-col bg-[#212121] text-[#ececec]">
      <Toaster />
      <Header />
      <main className="flex-1 bg-[#212121]">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          {/* Auth */}
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          {/* cars */}
          <Route path='/cars' element={<Cars />} />
          <Route path='/cars/:id' element={<CarDetails />} />
          {/* user */}
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
