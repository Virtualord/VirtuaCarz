import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { getAllCars } from "../store/carSlice";
import { getAllBookings } from "../store/bookingSlice";

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

  const categoryCounts = (Array.isArray(cars) ? cars : []).reduce(
    (counts, car) => {
      const category = car?.category || "Other";
      counts[category] = (counts[category] || 0) + 1;
      return counts;
    },
    {}
  );

  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

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
      <div className="mx-auto max-w-7xl">
        {/* Editorial hero */}
        <section className="border-b border-line pb-10 sm:pb-14">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-accent" />
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">
                  Overview
                </p>
              </div>

              <h2 className="mt-6 font-display text-[3.5rem] font-bold leading-[0.9] tracking-[-0.05em] text-ink sm:text-7xl lg:text-[5.25rem]">
                Control
                <br />
                center<span className="text-accent">.</span>
              </h2>

              <p className="mt-7 max-w-lg text-sm leading-relaxed text-ink-soft">
                Fleet health, reservation volume, and revenue at a glance — all
                sourced live from your rental operations.
              </p>
            </div>

            <div className="flex flex-col gap-4 border-t border-line pt-5 lg:items-end lg:border-t-0 lg:pt-0">
              <div className="lg:text-right">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-soft">
                  Operations
                </p>
                <p className="mt-1.5 text-xs text-ink-soft">{today}</p>
              </div>

              <Link
                to="/add-car"
                className="inline-flex items-center justify-center gap-2.5 self-start whitespace-nowrap rounded-md bg-accent px-5 py-3 text-xs font-bold text-white shadow-[0_16px_32px_-18px_rgba(250,82,15,0.8)] transition-all duration-300 ease-editorial hover:bg-accent-deep active:scale-[0.99] lg:self-end"
              >
                <i className="fa-solid fa-plus text-[10px]" />
                <span>Add a vehicle</span>
                <i className="fa-solid fa-arrow-right text-[9px]" />
              </Link>
            </div>
          </div>
        </section>

        {/* Stats ledger */}
        <section className="grid grid-cols-1 divide-y divide-line border-b border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className={`py-8 sm:py-10 ${
                idx === 0
                  ? "sm:pr-8"
                  : idx === 1
                  ? "sm:px-8"
                  : "sm:pl-8"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <i className={`${stat.icon} text-[11px] text-accent`} />
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-soft">
                  {stat.label}
                </p>
              </div>
              <p className="mt-5 font-display text-5xl font-bold tracking-[-0.045em] text-ink sm:text-6xl">
                {stat.value}
              </p>
              <p className="mt-2.5 text-xs text-ink-soft">{stat.hint}</p>
            </div>
          ))}
        </section>

        {/* Asymmetric lower section */}
        <section className="grid grid-cols-1 gap-12 pt-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16 lg:pt-12">
          <div>
            <div className="flex items-baseline justify-between border-b border-line pb-4">
              <h3 className="font-display text-2xl font-bold tracking-tight text-ink">
                Quick actions
              </h3>
              <span className="font-mono text-[10px] tracking-[0.16em] text-ink-soft">
                01 — 02
              </span>
            </div>

            <div>
              <Link
                to="/add-car"
                className="group flex items-center justify-between gap-6 border-b border-line py-6 transition-all duration-300 ease-editorial hover:pl-2"
              >
                <div className="flex items-baseline gap-5">
                  <span className="font-mono text-[10px] text-accent">01</span>
                  <div>
                    <p className="font-display text-lg font-semibold tracking-tight text-ink transition-colors duration-200 group-hover:text-accent">
                      Add a new vehicle
                    </p>
                    <p className="mt-1 text-xs text-ink-soft">
                      Publish a car to the rental fleet
                    </p>
                  </div>
                </div>
                <i className="fa-solid fa-arrow-right text-xs text-ink-soft transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent" />
              </Link>

              <Link
                to="/all-bookings"
                className="group flex items-center justify-between gap-6 border-b border-line py-6 transition-all duration-300 ease-editorial hover:pl-2"
              >
                <div className="flex items-baseline gap-5">
                  <span className="font-mono text-[10px] text-accent">02</span>
                  <div>
                    <p className="font-display text-lg font-semibold tracking-tight text-ink transition-colors duration-200 group-hover:text-accent">
                      Review bookings
                    </p>
                    <p className="mt-1 text-xs text-ink-soft">
                      Update reservation statuses
                    </p>
                  </div>
                </div>
                <i className="fa-solid fa-arrow-right text-xs text-ink-soft transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent" />
              </Link>
            </div>
          </div>

          <aside className="border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-soft">
              Fleet snapshot
            </p>
            <p className="mt-5 font-display text-7xl font-bold leading-none tracking-[-0.06em] text-ink">
              {fleetCount}
            </p>
            <p className="mt-3 text-xs text-ink-soft">
              {carsLoading
                ? "Loading fleet…"
                : `vehicle${fleetCount === 1 ? "" : "s"} currently in catalog`}
            </p>

            <div className="mt-8 h-px w-full bg-line" />

            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-ink-soft">
              Fleet composition
            </p>
            {topCategories.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {topCategories.map(([category, count]) => (
                  <li
                    key={category}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-ink-soft">{category}</span>
                    <span className="font-semibold text-ink">{count}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-xs text-ink-soft">No categories yet.</p>
            )}

            <Link
              to="/all-cars"
              className="mt-7 inline-flex items-center gap-2 border-b border-ink pb-1 text-xs font-semibold text-ink transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              Manage fleet
              <i className="fa-solid fa-arrow-right text-[9px]" />
            </Link>
          </aside>
        </section>
      </div>
    </Layout>
  );
};

export default AdminHome;
