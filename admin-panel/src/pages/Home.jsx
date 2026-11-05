import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import { getAllCars } from "../store/carSlice";
import { getAllBookings } from "../store/bookingSlice";
import { Link } from "react-router-dom";

const AdminHome = () => {
  const dispatch = useDispatch();

  const { cars, loading: carsLoading } = useSelector((state) => state.cars);
  const { bookings } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(getAllCars());
    dispatch(getAllBookings());
  }, [dispatch]);

  const fleetCount = Array.isArray(cars) ? cars.length : 0;
  const bookingCount = Array.isArray(bookings) ? bookings.length : 0;
  const grossValue = Array.isArray(bookings)
    ? bookings.reduce((sum, b) => sum + Number(b?.totalPrice || 0), 0)
    : 0;

  const stats = [
    {
      label: "Fleet Vehicles",
      value: String(fleetCount),
      hint: "Live from the rental catalog",
      icon: "fa-solid fa-car",
    },
    {
      label: "Total Bookings",
      value: String(bookingCount),
      hint: "All time reservations",
      icon: "fa-solid fa-calendar-check",
    },
    {
      label: "Gross Booking Value",
      value: `₹${Math.round(grossValue).toLocaleString("en-IN")}`,
      hint: "Lifetime rental GMV",
      icon: "fa-solid fa-indian-rupee",
    },
  ];

  return (
    <Layout title="Dashboard">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Page Banner */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
              Overview
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Control Center
            </h2>
            <p className="mt-3 text-sm text-ink-soft max-w-xl">
              Fleet health, reservation volume, and revenue at a glance — all
              sourced live from your rental operations.
            </p>
          </div>

          <Link
            to="/add-car"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-accent px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-accent/30 transition-all duration-300 hover:bg-accent-deep sm:hidden"
          >
            <i className="fa-solid fa-plus font-bold"></i>
            <span>Add New Car</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 * idx, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-md border border-line bg-white p-6 shadow-[0_16px_40px_-24px_rgba(24,24,27,0.25)]"
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-soft">
                  {stat.label}
                </p>
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-cream-dark text-accent">
                  <i className={`fa-solid ${stat.icon} text-base`}></i>
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold tracking-tight text-ink">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-ink-soft">{stat.hint}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="rounded-md border border-line bg-white p-6 shadow-[0_16px_40px_-24px_rgba(24,24,27,0.25)]">
          <h3 className="text-sm font-bold text-ink">Quick Actions</h3>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link
              to="/add-car"
              className="group flex items-center gap-4 rounded-md border border-line bg-cream p-4 transition-colors duration-200 hover:border-accent"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-white text-accent border border-line transition-colors duration-200 group-hover:border-accent">
                <i className="fa-solid fa-square-plus"></i>
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">Add a new vehicle</p>
                <p className="text-xs text-ink-soft">Publish a car to the rental fleet</p>
              </div>
            </Link>

            <Link
              to="/all-bookings"
              className="group flex items-center gap-4 rounded-md border border-line bg-cream p-4 transition-colors duration-200 hover:border-accent"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-white text-accent border border-line transition-colors duration-200 group-hover:border-accent">
                <i className="fa-solid fa-calendar-check"></i>
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">Review bookings</p>
                <p className="text-xs text-ink-soft">Update reservation statuses</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Fleet snapshot */}
        <div className="rounded-md border border-line bg-white p-6 shadow-[0_16px_40px_-24px_rgba(24,24,27,0.25)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-ink">Fleet Snapshot</h3>
              <p className="mt-1 text-xs text-ink-soft">
                {carsLoading
                  ? "Loading fleet…"
                  : `${fleetCount} vehicle${fleetCount === 1 ? "" : "s"} currently in catalog`}
              </p>
            </div>
            <Link
              to="/all-cars"
              className="text-xs font-bold text-accent hover:text-accent-deep transition-colors"
            >
              Manage fleet →
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminHome;
