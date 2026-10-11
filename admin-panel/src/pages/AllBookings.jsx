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
  pending: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  confirm: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  cancel: "border-red-500/20 bg-red-500/10 text-red-300",
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
              <h2 className="text-xl font-bold tracking-tight">All Bookings</h2>
              <span className="rounded-full border border-[#383838] bg-[#2a2a2a] px-2.5 py-0.5 text-xs font-semibold text-amber-400">
                {bookings.length} total
              </span>
            </div>
            <p className="mt-1 text-xs text-[#8c8c8c]">
              Review rental dates, amounts, and booking status.
            </p>
          </div>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-[#aaa]">
            Filter by status
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="min-w-44 rounded-xl border border-[#383838] bg-[#222] px-3 py-2.5 text-sm text-[#f5f5f5] outline-none focus:border-amber-500/60"
            >
              <option value="all">All bookings</option>
              <option value="pending">Pending</option>
              <option value="confirm">Confirmed</option>
              <option value="cancel">Cancelled</option>
            </select>
          </label>
        </div>

        {error && (
          <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {loading && bookings.length === 0 ? (
          <div className="flex h-56 items-center justify-center rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] text-sm text-[#999]">
            <i className="fa-solid fa-circle-notch mr-2 animate-spin text-amber-400" />
            Loading bookings...
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#d4d4d4]">
                <thead className="border-b border-[#2a2a2a] bg-[#202020] text-[11px] font-semibold uppercase tracking-wider text-[#888]">
                  <tr>
                    <th scope="col" className="px-4 py-3.5">Booking ID</th>
                    <th scope="col" className="px-4 py-3.5">Start date</th>
                    <th scope="col" className="px-4 py-3.5">Return date</th>
                    <th scope="col" className="px-4 py-3.5">Total</th>
                    <th scope="col" className="px-4 py-3.5">Status</th>
                    <th scope="col" className="px-4 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626]">
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id} className="transition-colors hover:bg-[#222]/70">
                      <td className="px-4 py-3.5 font-mono text-xs text-[#aaa]">
                        {booking._id || "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5">{formatDate(booking.startDate)}</td>
                      <td className="whitespace-nowrap px-4 py-3.5">{formatDate(booking.returnDate)}</td>
                      <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-amber-400">
                        ₹{Number(booking.totalPrice || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize ${statusClasses[booking.status] || "border-[#444] bg-[#2a2a2a] text-[#ccc]"}`}>
                          {booking.status || "unknown"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <Link
                          to={`/booking-details/${booking._id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#3a3a3a] bg-[#282828] px-3 py-1.5 text-xs font-medium text-[#f5f5f5] transition hover:bg-[#333]"
                        >
                          <i className="fa-solid fa-eye text-[10px] text-amber-400" />
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
          <div className="rounded-2xl border border-dashed border-[#333] bg-[#1a1a1a] p-12 text-center">
            <i className="fa-solid fa-calendar-check mb-3 text-3xl text-amber-400" />
            <h3 className="text-base font-semibold">{bookings.length ? "No matching bookings" : "No bookings yet"}</h3>
            <p className="mt-1 text-sm text-[#888]">
              {bookings.length ? "Choose another status filter." : "Bookings will appear here when customers make reservations."}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AllBookings;
