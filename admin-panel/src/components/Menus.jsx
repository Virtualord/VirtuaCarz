import { toast } from "react-toastify";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, reset } from "../store/authSlice";

const navGroups = [
  {
    label: "Overview",
    items: [
      { to: "/", label: "Dashboard", icon: "fa-solid fa-gauge-high" },
    ],
  },
  {
    label: "Fleet",
    items: [
      { to: "/all-cars", label: "All vehicles", icon: "fa-solid fa-car-side" },
      { to: "/add-car", label: "Add vehicle", icon: "fa-solid fa-plus" },
    ],
  },
  {
    label: "Reservations",
    items: [
      {
        to: "/all-bookings",
        label: "Bookings",
        icon: "fa-solid fa-calendar-check",
      },
    ],
  },
];

const Menus = ({ onNavigate }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    if (onNavigate) onNavigate();
    dispatch(logout());
    dispatch(reset());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="border-b border-line px-4 pb-5 pt-5">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-3 px-1 transition-opacity duration-200 hover:opacity-80"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-white shadow-[0_8px_20px_-8px_rgba(250,82,15,0.6)]">
            <i className="fa-solid fa-car text-xs" />
          </span>
          <div>
            <p className="text-[15px] font-bold tracking-tight text-ink">
              Virtua<span className="text-accent">Carz</span>
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-ink-soft">
              Admin Studio
            </p>
          </div>
        </Link>

        {/* Workspace */}
        <div className="mt-5 flex items-center gap-2.5 rounded-md border border-line bg-white px-3 py-2.5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-accent/10 text-[10px] font-bold text-accent">
            V
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-semibold text-ink">
              Operations
            </p>
            <p className="truncate text-[10px] text-ink-soft">
              Production workspace
            </p>
          </div>
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"
            title="Live"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navGroups.map((group, groupIndex) => (
          <div key={group.label} className={groupIndex > 0 ? "mt-5" : ""}>
            <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-ink-soft/70">
              {group.label}
            </p>

            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-md border px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                      isActive
                        ? "border-line bg-white text-ink shadow-[0_1px_2px_rgba(24,24,27,0.05)]"
                        : "border-transparent text-ink-soft hover:bg-white/60 hover:text-ink"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-sm transition-colors duration-200 ${
                          isActive
                            ? "bg-accent/10 text-accent"
                            : "text-ink-soft group-hover:text-ink"
                        }`}
                      >
                        <i className={`${item.icon} text-[11px]`} />
                      </span>
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-line p-3">
        <Link
          to="/add-car"
          onClick={onNavigate}
          className="group block rounded-md border border-line bg-white p-3 transition-colors duration-200 hover:border-ink"
        >
          <p className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.16em] text-ink">
            Quick publish
            <i className="fa-solid fa-arrow-right text-[9px] text-accent transition-transform duration-200 group-hover:translate-x-0.5" />
          </p>
          <p className="mt-1 text-[11px] leading-snug text-ink-soft">
            Add a vehicle to the storefront.
          </p>
        </Link>

        <div className="mt-3 flex items-center gap-2.5 px-2 py-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[11px] font-bold text-accent">
            {user?.uname ? user.uname[0].toUpperCase() : "A"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-ink">
              {user?.uname || "Admin User"}
            </p>
            <p className="truncate text-[11px] text-ink-soft">
              {user?.email || "admin@virtuacarz.com"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Log out"
            aria-label="Log out"
            className="rounded-sm p-2 text-ink-soft transition-colors duration-200 hover:bg-white hover:text-red-600"
          >
            <i className="fa-solid fa-arrow-right-from-bracket text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Menus;
