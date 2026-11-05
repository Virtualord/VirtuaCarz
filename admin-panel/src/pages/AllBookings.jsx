import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/Layout";
import { getAllBookings } from "../store/bookingSlice";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const statusStyles = {
  pending: { dot: "bg-amber-500", text: "text-amber-700" },
  confirm: { dot: "bg-emerald-500", text: "text-emerald-700" },
  cancel: { dot: "bg-red-500", text: "text-red-700" },
};

const AllBookings = () => {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.bookings);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    dispatch(getAllBookings());
  }, [dispatch]);

  const filteredBookings = useMemo(
    () => statusFilter === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === statusFilter),
    [bookings, statusFilter]
  );

  return (
    <Layout title="Bookings">
      <div className="mx-auto max-w-7xl">
        {/* Editorial header */}
        <div className="border-b border-line pb-8">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-accent" />
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">
                  Reservations
                </p>
              </div>

              <h2 className="mt-5 font-display text-4xl font-bold tracking-[-0.045em] text-ink sm:text-5xl lg:text-6xl">
                Every booking<span className="text-accent">.</span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">
                Review rental dates, amounts, and the status of every
                reservation.
              </p>
            </div>

            <div className="flex flex-row items-end justify-between gap-8 sm:flex-col sm:items-end sm:gap-4">
              <div className="sm:text-right">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-soft">
                  Total
                </p>
                <p className="mt-1 font-display text-4xl font-bold leading-none tracking-[-0.04em] text-ink">
                  {bookings.length}
                </p>
              </div>

              <label className="flex flex-col gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-soft">
                Filter
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="min-w-40 cursor-pointer rounded-md border border-line bg-transparent px-3 py-2.5 text-xs font-medium normal-case tracking-normal text-ink outline-none transition-colors duration-200 focus:border-ink"
                >
                  <option value="all">All bookings</option>
                  <option value="pending">Pending</option>
                  <option value="confirm">Confirmed</option>
                  <option value="cancel">Cancelled</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        {error && (
          <div role="alert" className="mt-6 border-l-2 border-red-500 bg-red-500/5 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && bookings.length === 0 ? (
          <div className="flex h-56 items-center justify-center border-b border-line text-sm text-ink-soft">
            <i className="fa-solid fa-circle-notch mr-2 animate-spin text-accent" />
            Loading bookings…
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="border-b border-line">
            {/* Mobile / tablet list */}
            <div className="divide-y divide-line lg:hidden">
              {filteredBookings.map((booking) => {
                const styles = statusStyles[booking.status] || {
                  dot: "bg-zinc-400",
                  text: "text-ink-soft",
                };
                return (
                  <Link
                    key={booking._id}
                    to={`/booking-details/${booking._id}`}
                    className="group block py-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate font-mono text-[11px] text-ink-soft">
                          {booking._id}
                        </p>
                        <p className="mt-2 font-display text-lg font-semibold tracking-tight text-ink">
                          {formatDate(booking.startDate)}
                          <span className="mx-1.5 text-ink-soft">→</span>
                          {formatDate(booking.returnDate)}
                        </p>
                      </div>
                      <span
                        className={`inline-flex shrink-0 items-center gap-2 pt-1 text-[11px] font-medium capitalize ${styles.text}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
                        {booking.status || "unknown"}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
                      <p className="text-sm font-semibold text-accent">
                        ₹{Number(booking.totalPrice || 0).toLocaleString("en-IN")}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink transition-colors group-hover:text-accent">
                        View
                        <i className="fa-solid fa-arrow-right text-[9px] text-ink-soft transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[760px] text-left text-sm text-ink">
                <thead>
                  <tr className="border-b border-line">
                    <th scope="col" className="px-3 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft first:pl-0 last:pr-0">
                      Booking ID
                    </th>
                    <th scope="col" className="px-3 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft first:pl-0 last:pr-0">
                      Start date
                    </th>
                    <th scope="col" className="px-3 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft first:pl-0 last:pr-0">
                      Return date
                    </th>
                    <th scope="col" className="px-3 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft first:pl-0 last:pr-0">
                      Total
                    </th>
                    <th scope="col" className="px-3 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft first:pl-0 last:pr-0">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-4 text-right text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft first:pl-0 last:pr-0">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="border-b border-line transition-colors duration-200 last:border-b-0 hover:bg-cream-dark/40"
                    >
                      <td className="px-3 py-4 font-mono text-[11px] text-ink-soft first:pl-0 last:pr-0">
                        {booking._id || "—"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-xs text-ink first:pl-0 last:pr-0">
                        {formatDate(booking.startDate)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-xs text-ink first:pl-0 last:pr-0">
                        {formatDate(booking.returnDate)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 first:pl-0 last:pr-0">
                        <span className="text-sm font-semibold text-accent">
                          ₹{Number(booking.totalPrice || 0).toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td className="px-3 py-4 first:pl-0 last:pr-0">
                        <span
                          className={`inline-flex items-center gap-2 text-[11px] font-medium capitalize ${
                            statusStyles[booking.status]?.text || "text-ink-soft"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              statusStyles[booking.status]?.dot || "bg-zinc-400"
                            }`}
                          />
                          {booking.status || "unknown"}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-right first:pl-0 last:pr-0">
                        <Link
                          to={`/booking-details/${booking._id}`}
                          className="group inline-flex items-center gap-2 text-xs font-semibold text-ink transition-colors duration-200 hover:text-accent"
                        >
                          <span>View</span>
                          <i className="fa-solid fa-arrow-right text-[9px] text-ink-soft transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="border-b border-line py-20 text-center">
            <i className="fa-solid fa-calendar-check mb-5 text-3xl text-accent" />
            <h3 className="font-display text-2xl font-bold tracking-tight text-ink">
              {bookings.length ? "No matching bookings" : "No bookings yet"}
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
              {bookings.length
                ? "Choose another status filter."
                : "Bookings will appear here when customers make reservations."}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AllBookings;
