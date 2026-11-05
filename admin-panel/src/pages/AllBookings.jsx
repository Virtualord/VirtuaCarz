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

const statusClasses = {
  pending: "border-amber-500/20 bg-amber-500/10 text-amber-600",
  confirm: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
  cancel: "border-red-500/20 bg-red-500/10 text-red-600",
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
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-ink">All Bookings</h2>
              <span className="rounded-md bg-cream-dark px-2.5 py-0.5 text-xs font-semibold text-accent border border-line">
                {bookings.length} total
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-soft">
              Review rental dates, amounts, and booking status.
            </p>
          </div>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-ink">
            Filter by status
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="min-w-44 rounded-md border border-line bg-cream px-3 py-2.5 text-sm text-ink outline-none focus:border-accent focus:ring-1 focus:ring-accent/50"
            >
              <option value="all">All bookings</option>
              <option value="pending">Pending</option>
              <option value="confirm">Confirmed</option>
              <option value="cancel">Cancelled</option>
            </select>
          </label>
        </div>

        {error && (
          <div role="alert" className="rounded-md border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading && bookings.length === 0 ? (
          <div className="flex h-56 items-center justify-center rounded-md border border-line bg-white text-sm text-ink-soft">
            <i className="fa-solid fa-circle-notch mr-2 animate-spin text-accent" />
            Loading bookings...
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="overflow-hidden rounded-md border border-line bg-white shadow-[0_16px_40px_-24px_rgba(24,24,27,0.25)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-ink">
                <thead>
                  <tr className="border-b border-line bg-cream text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
                    <th scope="col" className="px-4 py-3.5">Booking ID</th>
                    <th scope="col" className="px-4 py-3.5">Start date</th>
                    <th scope="col" className="px-4 py-3.5">Return date</th>
                    <th scope="col" className="px-4 py-3.5">Total</th>
                    <th scope="col" className="px-4 py-3.5">Status</th>
                    <th scope="col" className="px-4 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-ink-soft">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id} className="border-b border-line last:border-b-0 transition-colors hover:bg-cream/60">
                      <td className="px-4 py-3.5 font-mono text-xs text-ink-soft">
                        {booking._id || "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5">{formatDate(booking.startDate)}</td>
                      <td className="whitespace-nowrap px-4 py-3.5">{formatDate(booking.returnDate)}</td>
                      <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-accent">
                        ₹{Number(booking.totalPrice || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize ${statusClasses[booking.status] || "border-line bg-cream text-ink"}`}>
                          {booking.status || "unknown"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <Link
                          to={`/booking-details/${booking._id}`}
                          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-cream border border-line px-3 py-1.5 text-xs font-medium text-ink hover:border-ink hover:bg-cream-dark transition-colors duration-200"
                        >
                          <i className="fa-solid fa-eye text-[10px] text-accent" />
                          View details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-line bg-white p-12 text-center">
            <i className="fa-solid fa-calendar-check mb-3 text-3xl text-accent" />
            <h3 className="font-semibold text-ink">{bookings.length ? "No matching bookings" : "No bookings yet"}</h3>
            <p className="mt-1 text-sm text-ink-soft">
              {bookings.length ? "Choose another status filter." : "Bookings will appear here when customers make reservations."}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AllBookings;
