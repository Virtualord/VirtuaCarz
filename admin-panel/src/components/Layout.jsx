import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Menus from "./Menus";
import { logout, reset } from "../store/authSlice";

const Layout = ({ children, title = "Admin Portal" }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const accountRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Close overlays whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [location.pathname]);

  // Close the account menu on an outside click.
  useEffect(() => {
    const handlePointerDown = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    setAccountOpen(false);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-cream text-ink">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] border-r border-line bg-cream-dark lg:block">
        <Menus />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <div className="lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-[2px]"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] border-r border-line bg-cream-dark shadow-2xl"
            >
              <Menus onNavigate={() => setMenuOpen(false)} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <div className="lg:pl-[264px]">
        {/* Top header */}
        <header className="sticky top-0 z-30 border-b border-line bg-cream/85 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="rounded-md border border-line bg-white p-2 text-ink transition-colors duration-200 hover:border-ink lg:hidden"
                aria-label="Open navigation"
              >
                <i className="fa-solid fa-bars text-xs" />
              </button>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft">
                  Admin Studio
                </p>
                <h1 className="truncate text-sm font-semibold tracking-tight text-ink">
                  {title}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Right-side account menu */}
              <div className="relative" ref={accountRef}>
                <button
                  type="button"
                  onClick={() => setAccountOpen((value) => !value)}
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  className={`flex items-center gap-2.5 rounded-md border bg-white px-2 py-1.5 transition-colors duration-200 ${
                    accountOpen ? "border-ink" : "border-line hover:border-ink"
                  }`}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-accent/10 text-[11px] font-bold text-accent">
                    {user?.uname ? user.uname[0].toUpperCase() : "A"}
                  </span>
                  <span className="hidden max-w-[120px] truncate text-xs font-semibold text-ink sm:block">
                    {user?.uname || "Admin"}
                  </span>
                  <i
                    className={`fa-solid fa-chevron-down text-[8px] text-ink-soft transition-transform duration-200 ${
                      accountOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      role="menu"
                      className="absolute right-0 top-[calc(100%+8px)] w-60 overflow-hidden rounded-md border border-line bg-white p-1.5 shadow-[0_24px_60px_-24px_rgba(24,24,27,0.35)]"
                    >
                      <div className="px-3 py-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-soft">
                          Signed in as
                        </p>
                        <p className="mt-1.5 truncate text-sm font-semibold text-ink">
                          {user?.uname || "Admin User"}
                        </p>
                        <p className="truncate text-xs text-ink-soft">
                          {user?.email || "admin@virtuacarz.com"}
                        </p>
                      </div>

                      <div className="my-1 h-px bg-line" />

                      <Link
                        to="/"
                        role="menuitem"
                        className="flex items-center gap-3 rounded-sm px-3 py-2 text-xs font-medium text-ink-soft transition-colors duration-150 hover:bg-cream hover:text-ink"
                      >
                        <i className="fa-solid fa-gauge-high w-4 text-center text-[11px]" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/all-cars"
                        role="menuitem"
                        className="flex items-center gap-3 rounded-sm px-3 py-2 text-xs font-medium text-ink-soft transition-colors duration-150 hover:bg-cream hover:text-ink"
                      >
                        <i className="fa-solid fa-car-side w-4 text-center text-[11px]" />
                        <span>Fleet inventory</span>
                      </Link>
                      <Link
                        to="/all-bookings"
                        role="menuitem"
                        className="flex items-center gap-3 rounded-sm px-3 py-2 text-xs font-medium text-ink-soft transition-colors duration-150 hover:bg-cream hover:text-ink"
                      >
                        <i className="fa-solid fa-calendar-check w-4 text-center text-[11px]" />
                        <span>Bookings</span>
                      </Link>

                      <div className="my-1 h-px bg-line" />

                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-sm px-3 py-2 text-xs font-medium text-red-600 transition-colors duration-150 hover:bg-red-50"
                      >
                        <i className="fa-solid fa-arrow-right-from-bracket w-4 text-center text-[11px]" />
                        <span>Log out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
