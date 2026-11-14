import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/features/authSlice";
import { ADMIN_APP_URL } from "../utils/admin";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Fleet", path: "/cars" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const accountRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { token, user } = useSelector((state) => state.auth);
  const isLoggedIn = Boolean(token || user);

  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleLogout = () => {
    dispatch(logout());
    setMenuOpen(false);
    setAccountOpen(false);
    navigate("/login");
  };

  const desktopLinkClass = ({ isActive }) =>
    `relative inline-flex items-center gap-2 py-2 text-[13px] font-semibold tracking-tight transition-colors duration-200 after:absolute after:-bottom-[9px] after:left-0 after:h-px after:bg-accent after:transition-all after:duration-300 ${
      isActive
        ? "text-ink after:w-full"
        : "text-ink-soft after:w-0 hover:text-ink hover:after:w-full"
    }`;

  const drawerLinkClass = ({ isActive }) =>
    `flex items-center justify-between border-b border-line py-4 text-base font-semibold tracking-tight transition-colors duration-200 ${
      isActive ? "text-accent" : "text-ink hover:text-accent"
    }`;

  const initial = user?.uname ? user.uname[0].toUpperCase() : "A";

  return (
    <>
      <motion.header
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-40 w-full border-b border-line bg-cream"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="rounded-md border border-line bg-white p-2 text-ink transition-colors duration-200 hover:border-ink lg:hidden"
              aria-label="Open navigation"
            >
              <i className="fa-solid fa-bars text-xs" aria-hidden="true" />
            </button>

            <Link
              to="/"
              className="group flex items-center gap-2.5 text-lg font-bold tracking-tight text-ink transition-opacity duration-200 hover:opacity-80"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-white transition-transform duration-300 group-hover:scale-95">
                <i className="fa-solid fa-car text-xs" aria-hidden="true" />
              </span>
              <span>
                Virtua<span className="text-accent">Carz</span>
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                className={desktopLinkClass}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {isLoggedIn ? (
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
                    {initial}
                  </span>
                  <span className="hidden max-w-[120px] truncate text-xs font-semibold text-ink sm:block">
                    {user?.uname || "Account"}
                  </span>
                  <i
                    className={`fa-solid fa-chevron-down text-[8px] text-ink-soft transition-transform duration-200 ${
                      accountOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
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
                          {user?.uname || "VirtuaCarz member"}
                        </p>
                        <p className="truncate text-xs text-ink-soft">
                          {user?.email || "member@virtuacarz.com"}
                        </p>
                      </div>

                      <div className="my-1 h-px bg-line" />

                      <Link
                        to="/profile"
                        role="menuitem"
                        className="flex items-center gap-3 rounded-sm px-3 py-2 text-xs font-medium text-ink-soft transition-colors duration-150 hover:bg-cream hover:text-ink"
                      >
                        <i className="fa-solid fa-user w-4 text-center text-[11px]" aria-hidden="true" />
                        <span>My profile</span>
                      </Link>
                      <Link
                        to="/profile"
                        role="menuitem"
                        className="flex items-center gap-3 rounded-sm px-3 py-2 text-xs font-medium text-ink-soft transition-colors duration-150 hover:bg-cream hover:text-ink"
                      >
                        <i className="fa-solid fa-calendar-check w-4 text-center text-[11px]" aria-hidden="true" />
                        <span>My bookings</span>
                      </Link>
                      <Link
                        to="/cars"
                        role="menuitem"
                        className="flex items-center gap-3 rounded-sm px-3 py-2 text-xs font-medium text-ink-soft transition-colors duration-150 hover:bg-cream hover:text-ink"
                      >
                        <i className="fa-solid fa-car-side w-4 text-center text-[11px]" aria-hidden="true" />
                        <span>Explore the fleet</span>
                      </Link>

                      {user?.isAdmin && (
                        <a
                          href={ADMIN_APP_URL}
                          role="menuitem"
                          className="flex items-center gap-3 rounded-sm px-3 py-2 text-xs font-medium text-ink-soft transition-colors duration-150 hover:bg-cream hover:text-ink"
                        >
                          <i className="fa-solid fa-shield-halved w-4 text-center text-[11px]" aria-hidden="true" />
                          <span>Admin studio</span>
                        </a>
                      )}

                      <div className="my-1 h-px bg-line" />

                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-sm px-3 py-2 text-xs font-medium text-red-600 transition-colors duration-150 hover:bg-red-50"
                      >
                        <i className="fa-solid fa-arrow-right-from-bracket w-4 text-center text-[11px]" aria-hidden="true" />
                        <span>Log out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden px-3 py-2 text-xs font-semibold text-ink-soft transition-colors duration-200 hover:text-ink sm:inline-flex"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-md bg-ink px-4 py-2.5 text-xs font-bold text-cream transition-colors duration-200 hover:bg-accent"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <div className="lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-ink/30"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 z-50 flex w-[300px] flex-col border-r border-line bg-cream-dark"
              aria-label="Mobile navigation"
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <Link to="/" className="flex items-center gap-2.5 text-base font-bold tracking-tight text-ink">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-white">
                    <i className="fa-solid fa-car text-xs" aria-hidden="true" />
                  </span>
                  <span>
                    Virtua<span className="text-accent">Carz</span>
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md p-2 text-ink-soft transition-colors duration-200 hover:bg-white hover:text-ink"
                  aria-label="Close navigation"
                >
                  <i className="fa-solid fa-xmark text-sm" aria-hidden="true" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="Mobile navigation links">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-soft/70">
                  Explore
                </p>
                <div className="mt-2">
                  {NAV_LINKS.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      end={link.path === "/"}
                      onClick={() => setMenuOpen(false)}
                      className={drawerLinkClass}
                    >
                      {link.name}
                      <i className="fa-solid fa-arrow-right text-[9px] text-ink-soft" aria-hidden="true" />
                    </NavLink>
                  ))}
                </div>

                <div className="mt-8">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-soft/70">
                    Your account
                  </p>

                  {isLoggedIn ? (
                    <div className="mt-3">
                      <div className="flex items-center gap-3 border border-line bg-white px-3 py-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-accent/10 text-xs font-bold text-accent">
                          {initial}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-ink">
                            {user?.uname || "VirtuaCarz member"}
                          </p>
                          <p className="truncate text-[11px] text-ink-soft">
                            {user?.email || "member@virtuacarz.com"}
                          </p>
                        </div>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="mt-3 flex items-center justify-between border-b border-line py-3 text-sm font-semibold text-ink"
                      >
                        My profile
                        <i className="fa-solid fa-arrow-right text-[9px] text-ink-soft" aria-hidden="true" />
                      </Link>

                      {user?.isAdmin && (
                        <a
                          href={ADMIN_APP_URL}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center justify-between border-b border-line py-3 text-sm font-semibold text-ink"
                        >
                          Admin studio
                          <i className="fa-solid fa-shield-halved text-[9px] text-ink-soft" aria-hidden="true" />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-red-600"
                      >
                        <i className="fa-solid fa-arrow-right-from-bracket text-[10px]" aria-hidden="true" />
                        Log out
                      </button>
                    </div>
                  ) : (
                    <div className="mt-3 space-y-2.5">
                      <Link
                        to="/login"
                        onClick={() => setMenuOpen(false)}
                        className="flex w-full items-center justify-center rounded-md border border-line bg-white px-4 py-2.5 text-xs font-semibold text-ink transition-colors duration-200 hover:border-ink"
                      >
                        Log in
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setMenuOpen(false)}
                        className="flex w-full items-center justify-center rounded-md bg-accent px-4 py-2.5 text-xs font-bold text-white transition-colors duration-200 hover:bg-accent-deep"
                      >
                        Create an account
                      </Link>
                    </div>
                  )}
                </div>
              </nav>

              <div className="border-t border-line px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-soft">
                  Drive fearless.
                </p>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
