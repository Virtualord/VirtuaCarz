import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import { getBookingDetails, updateBookingStatus } from "../../store/bookingSlice";

const formatDate = (value, includeTime = false) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", includeTime
    ? { dateStyle: "medium", timeStyle: "short" }
    : { dateStyle: "medium" }
  );
};

const BookingDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookingDetail, loading, updating, error } = useSelector((state) => state.bookings);
  const booking = bookingDetail?.id === id || bookingDetail?._id === id
    ? bookingDetail
    : null;
  const [status, setStatus] = useState("");

  useEffect(() => {
    dispatch(getBookingDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (booking) setStatus(booking.status || "pending");
  }, [booking]);

  const handleStatusUpdate = async (event) => {
    event.preventDefault();
    try {
      await dispatch(updateBookingStatus({ id, status })).unwrap();
      toast.success("Booking status updated");
      navigate("/all-bookings");
    } catch (updateError) {
      toast.error(typeof updateError === "string" ? updateError : "Unable to update booking status");
    }
  };

  return (
    <Layout title="Booking Details">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Booking Details</h2>
            <p className="mt-1 text-sm text-[#8c8c8c]">Review the reservation and update its status.</p>
          </div>
          <Link
            to="/all-bookings"
            className="inline-flex items-center gap-2 rounded-lg border border-[#3a3a3a] bg-[#282828] px-3 py-2 text-xs font-medium text-[#eee] hover:bg-[#333]"
          >
            <i className="fa-solid fa-arrow-left text-amber-400" />
            All bookings
          </Link>
        </div>

        {error && (
          <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {loading && !booking ? (
          <div className="flex h-56 items-center justify-center rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] text-sm text-[#999]">
            <i className="fa-solid fa-circle-notch mr-2 animate-spin text-amber-400" />
            Loading booking details...
          </div>
        ) : booking ? (
          <>
            <section className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 shadow-xl sm:p-8">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#2a2a2a] pb-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#888]">Booking ID</p>
                  <p className="mt-1 break-all font-mono text-sm text-[#ddd]">{booking.id || booking._id || id}</p>
                </div>
                <span className="rounded-full border border-[#444] bg-[#252525] px-3 py-1 text-xs capitalize text-[#ddd]">
                  {booking.status || "pending"}
                </span>
              </div>

              <dl className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-[#888]">Customer</dt>
                  <dd className="mt-1 font-medium text-[#f5f5f5]">{booking.customerName || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#888]">Phone</dt>
                  <dd className="mt-1 font-medium text-[#f5f5f5]">{booking.phone || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#888]">Start date</dt>
                  <dd className="mt-1 font-medium text-[#f5f5f5]">{formatDate(booking.startDate)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#888]">Return date</dt>
                  <dd className="mt-1 font-medium text-[#f5f5f5]">{formatDate(booking.returnDate)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#888]">Daily price</dt>
                  <dd className="mt-1 font-medium text-amber-400">₹{Number(booking.price || 0).toLocaleString("en-IN")}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#888]">Total price</dt>
                  <dd className="mt-1 font-semibold text-amber-400">₹{Number(booking.totalPrice || 0).toLocaleString("en-IN")}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs text-[#888]">Booked on</dt>
                  <dd className="mt-1 font-medium text-[#f5f5f5]">{formatDate(booking.bookingTime, true)}</dd>
                </div>
              </dl>
            </section>

            <form onSubmit={handleStatusUpdate} className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 shadow-xl sm:p-8">
              <h3 className="text-sm font-semibold text-[#f5f5f5]">Update booking status</h3>
              <p className="mt-1 text-xs text-[#888]">Choose whether to leave the booking pending, confirm it, or cancel it.</p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="flex-1 rounded-xl border border-[#383838] bg-[#222] px-3.5 py-2.5 text-sm text-[#f5f5f5] outline-none focus:border-amber-500/60"
                >
                  <option value="pending">Pending</option>
                  <option value="confirm">Confirmed</option>
                  <option value="cancel">Cancelled</option>
                </select>
                <button
                  type="submit"
                  disabled={updating || !status || status === booking.status}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:from-amber-400 hover:to-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updating && <i className="fa-solid fa-circle-notch animate-spin" />}
                  {updating ? "Saving..." : "Save status"}
                </button>
              </div>
            </form>
          </>
        ) : !loading && !error ? (
          <div className="rounded-2xl border border-dashed border-[#333] bg-[#1a1a1a] p-12 text-center">
            <h3 className="font-semibold">Booking not found</h3>
            <p className="mt-1 text-sm text-[#888]">This booking may have been removed or the link may be invalid.</p>
          </div>
        ) : null}
      </div>
    </Layout>
  );
};

export default BookingDetails;
