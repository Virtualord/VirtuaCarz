import React from "react";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, reset } from "../store/authSlice";

const Menus = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navLinks = [
    { to: "/", label: "Dashboard", icon: "fa-solid fa-chart-pie" },
    { to: "/all-cars", label: "Fleet / All Cars", icon: "fa-solid fa-car-side" },
    { to: "/add-car", label: "Add New Car", icon: "fa-solid fa-square-plus" },
    { to: "/all-bookings", label: "Bookings", icon: "fa-solid fa-calendar-check" },
  ];

  return (
    <div className="flex h-full flex-col justify-between p-4">
      {/* Brand & Navigation */}
      <div className="flex flex-col gap-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-3 border-b border-[#2a2a2a]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-black shadow-lg shadow-amber-500/20 font-bold">
            <i className="fa-solid fa-car text-lg"></i>
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-[#f5f5f5]">VirtuaCarz</h2>
            <p className="text-xs text-[#8c8c8c] font-medium">Control Center</p>
          </div>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-1.5">
          <p className="px-3 text-[11px] font-semibold tracking-wider text-[#666666] uppercase">
            Navigation
          </p>
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#2c2c2c] text-amber-400 shadow-sm border border-[#3d3d3d]"
                    : "text-[#a3a3a3] hover:bg-[#252525] hover:text-[#f5f5f5]"
                }`
              }
            >
              <i className={`${item.icon} text-base w-5 text-center`}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User Card & Logout */}
      <div className="flex flex-col gap-3 border-t border-[#2a2a2a] pt-4">
        <div className="flex items-center gap-3 rounded-xl bg-[#222222] p-3 border border-[#2d2d2d]">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-semibold text-sm">
            {user?.uname ? user.uname[0].toUpperCase() : "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[#f5f5f5]">
              {user?.uname || "Admin User"}
            </p>
            <p className="truncate text-xs text-[#777777]">
              {user?.email || "admin@system"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3.5 py-2.5 text-sm font-medium transition cursor-pointer"
        >
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Menus;
