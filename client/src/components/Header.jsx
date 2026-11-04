import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "../store/features/authSlice";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { token, user } = useSelector((state) => state.auth);
  const isLoggedIn = Boolean(token || user);

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "All Cars", path: "/cars" },
    { name: "Contact", path: "/contact" },
    { name: "My Account", path: "/profile" },
  ];

  const linkClass = ({ isActive }) =>
    `relative rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ${
      isActive
        ? "text-[#18181b]"
        : "text-[#737373] hover:text-[#18181b]"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block rounded-md px-4 py-3 text-sm font-medium transition-colors duration-200 ${
      isActive
        ? "bg-[#f5f4ef] text-[#18181b]"
        : "text-[#737373] hover:bg-[#f5f4ef] hover:text-[#18181b]"
    }`;

  return (
    <motion.header
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 w-full border-b border-[#e5e5e5] bg-[#fbfbf8]/90 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          to="/"
          className="group flex items-center gap-2.5 text-lg font-bold tracking-tight text-[#18181b] transition-opacity duration-200 hover:opacity-80"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#fa520f] text-white shadow-[0_4px_12px_-4px_rgba(250,82,15,0.55)] transition-transform duration-300 group-hover:scale-95">
            <i className="fa-solid fa-car text-xs" />
          </span>
          <span>
            Virtua<span className="text-[#fa520f]">Carz</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={linkClass({
                isActive:
                  link.path === "/"
                  ? undefined
                  : location.pathname === link.path,
              })}
            >
              {link.name}
            </Link>
          ))}

          <div className="mx-3 h-5 w-px bg-[#e5e5e5]" />

          {isLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md px-4 py-2 text-sm font-semibold text-[#18181b] transition-colors duration-200 hover:bg-[#f5f4ef]"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md px-4 py-2 text-sm font-medium text-[#737373] transition-colors duration-200 hover:bg-[#f5f4ef] hover:text-[#18181b]"
              >
                Log in
              </Link>

              <Link
                to="/register"
                className="ml-2 rounded-md bg-[#18181b] px-4 py-2 text-sm font-semibold text-[#fbfbf8] transition-all duration-300 hover:bg-[#000000] hover:shadow-[0_8px_20px_-8px_rgba(24,24,27,0.5)]"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-md p-2 text-[#18181b] transition-colors duration-200 hover:bg-[#f5f4ef] md:hidden"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-[#e5e5e5] bg-[#fbfbf8] md:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={mobileLinkClass({
                    isActive:
                      link.path === "/"
                      ? undefined
                      : location.pathname === link.path,
                  })}
                >
                  {link.name}
                </Link>
              ))}

              <div className="my-2 h-px bg-[#e5e5e5]" />

              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-md px-4 py-3 text-sm font-semibold text-[#18181b] transition-colors duration-200 hover:bg-[#f5f4ef]"
                >
                  Logout
                </button>
              ) : (
                <div className="flex items-center gap-3 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 rounded-md border border-[#d5d2c8] px-4 py-2.5 text-center text-sm font-medium text-[#18181b] transition-colors duration-200 hover:border-[#18181b]"
                  >
                    Log in
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 rounded-md bg-[#18181b] px-4 py-2.5 text-center text-sm font-semibold text-[#fbfbf8] transition-colors duration-200 hover:bg-[#000000]"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
