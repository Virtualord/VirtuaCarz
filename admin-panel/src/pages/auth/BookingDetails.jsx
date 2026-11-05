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
  return date.toLocaleString(
    "en-IN",
    includeTime
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
            <h2 className="text-2xl font-bold tracking-tight text-ink">Booking Details</h2>
            <p className="mt-1 text-sm text-ink-soft">Review the reservation and update its status.</p>
          </div>
          <Link
            to="/all-bookings"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-cream px-3 py-2 text-xs font-medium text-ink hover:border-ink hover:bg-cream-dark transition-colors duration-200"
          >
            <i className="fa-solid fa-arrow-left text-accent" />
            All bookings
          </Link>
        </div>

        {error && (
          <div role="alert" className="rounded-md border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading && !booking ? (
          <div className="flex h-56 items-center justify-center rounded-md border border-line bg-white text-sm text-ink-soft">
            <i className="fa-solid fa-circle-notch mr-2 animate-spin text-accent" />
            Loading booking details...
          </div>
        ) : booking ? (
          <>
            <section className="rounded-md border border-line bg-white p-6 shadow-[0_16px_40px_-24px_rgba(24,24,27,0.25)] sm:p-8">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">Booking ID</p>
                  <p className="mt-1 break-all font-mono text-sm text-ink">{booking.id || booking._id || id}</p>
                </div>
                <span className="rounded-full border border-line bg-cream px-3 py-1 text-xs capitalize text-ink">
                  {booking.status || "pending"}
                </span>
              </div>

              <dl className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-ink-soft">Customer</dt>
                  <dd className="mt-1 font-medium text-ink">{booking.customerName || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-soft">Phone</dt>
                  <dd className="mt-1 font-medium text-ink">{booking.phone || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-soft">Start date</dt>
                  <dd className="mt-1 font-medium text-ink">{formatDate(booking.startDate)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-soft">Return date</dt>
                  <dd className="mt-1 font-medium text-ink">{formatDate(booking.returnDate)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-soft">Daily price</dt>
                  <dd className="mt-1 font-medium text-accent">₹{Number(booking.price || 0).toLocaleString("en-IN")}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-soft">Total price</dt>
                  <dd className="mt-1 font-semibold text-accent">₹{Number(booking.totalPrice || 0).toLocaleString("en-IN")}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs text-ink-soft">Booked on</dt>
                  <dd className="mt-1 font-medium text-ink">{formatDate(booking.bookingTime, true)}</dd>
                </div>
              </dl>
            </section>

            <form onSubmit={handleStatusUpdate} className="rounded-md border border-line bg-white p-6 shadow-[0_16px_40px_-24px_rgba(24,24,27,0.25)] sm:p-8">
              <h3 className="text-sm font-semibold text-ink">Update booking status</h3>
              <p className="mt-1 text-xs text-ink-soft">Choose whether to leave the booking pending, confirm it, or cancel it.</p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="flex-1 rounded-md border border-line bg-cream px-3.5 py-2.5 text-sm text-ink outline-none focus:border-accent focus:ring-1 focus:ring-accent/50"
                >
                  <option value="pending">Pending</option>
                  <option value="confirm">Confirmed</option>
                  <option value="cancel">Cancelled</option>
                </select>
                <button
                  type="submit"
                  disabled={updating || !status || status === booking.status}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 shadow-lg shadow-accent/30 hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updating && <i className="fa-solid fa-circle-notch animate-spin" />}
                  {updating ? "Saving..." : "Save status"}
                </button>
              </div>
            </form>
          </>
        ) : !loading && !error ? (
          <div className="rounded-md border border-dashed border-line bg-white p-12 text-center">
            <h3 className="font-semibold text-ink">Booking not found</h3>
            <p className="mt-1 text-sm text-ink-soft">This booking may have been removed or the link may be invalid.</p>
          </div>
        ) : null}
      </div>
    </Layout>
  );
};

export default BookingDetails;
