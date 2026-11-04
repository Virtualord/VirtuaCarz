import './App.css'
import { Routes, Route, useLocation } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { loadToken } from './store/features/authSlice';
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
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
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

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadToken());
  }, [dispatch]);

  return (
    <div className="flex min-h-screen flex-col bg-cream text-ink selection:bg-ink selection:text-cream">
      <Toaster />
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <MotionPage key={location.pathname}>
            <Routes location={location}>
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
          </MotionPage>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;
