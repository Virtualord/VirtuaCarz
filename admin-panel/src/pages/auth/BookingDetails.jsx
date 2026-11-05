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

const statusStyles = {
  pending: { dot: "bg-amber-500", text: "text-amber-700" },
  confirm: { dot: "bg-emerald-500", text: "text-emerald-700" },
  cancel: { dot: "bg-red-500", text: "text-red-700" },
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

  const currentStatus = booking?.status || "pending";
  const currentStyles = statusStyles[currentStatus] || { dot: "bg-zinc-400", text: "text-ink-soft" };

  return (
    <Layout title="Booking Details">
      <div className="mx-auto max-w-6xl">
        {/* Editorial header */}
        <div className="border-b border-line pb-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Link
                to="/all-bookings"
                className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft transition-colors duration-200 hover:text-ink"
              >
                <i className="fa-solid fa-arrow-left text-[9px]" />
                All bookings
              </Link>

              <div className="mt-5 flex items-center gap-3">
                <span className="h-px w-10 bg-accent" />
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">
                  Reservation
                </p>
              </div>

              <h2 className="mt-5 font-display text-4xl font-bold tracking-[-0.045em] text-ink sm:text-5xl lg:text-6xl">
                The reservation<span className="text-accent">.</span>
              </h2>

              <p className="mt-4 break-all font-mono text-[11px] text-ink-soft">
                {booking?.id || booking?._id || id}
              </p>
            </div>

            {booking && (
              <span className={`inline-flex items-center gap-2 self-start text-xs font-semibold capitalize sm:self-end ${currentStyles.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${currentStyles.dot}`} />
                {currentStatus}
              </span>
            )}
          </div>
        </div>

        {error && (
          <div role="alert" className="mt-6 border-l-2 border-red-500 bg-red-500/5 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && !booking ? (
          <div className="flex h-56 items-center justify-center border-b border-line text-sm text-ink-soft">
            <i className="fa-solid fa-circle-notch mr-2 animate-spin text-accent" />
            Loading booking details…
          </div>
        ) : booking ? (
          <div className="grid grid-cols-1 gap-10 pt-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16 lg:pt-10">
            {/* Summary */}
            <section>
              <div className="border-b border-line pb-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-soft">
                  Total amount
                </p>
                <p className="mt-2 font-display text-4xl font-bold tracking-[-0.04em] text-ink sm:text-5xl">
                  ₹{Number(booking.totalPrice || 0).toLocaleString("en-IN")}
                </p>
                <p className="mt-2 text-xs text-ink-soft">
                  ₹{Number(booking.price || 0).toLocaleString("en-IN")} per day
                </p>
              </div>

              <dl className="divide-y divide-line border-b border-line">
                {[
                  { label: "Customer", value: booking.customerName || "—" },
                  { label: "Phone", value: booking.phone || "—" },
                  { label: "Start date", value: formatDate(booking.startDate) },
                  { label: "Return date", value: formatDate(booking.returnDate) },
                  { label: "Booked on", value: formatDate(booking.bookingTime, true) },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[110px_minmax(0,1fr)] gap-4 py-4 sm:grid-cols-[160px_minmax(0,1fr)]"
                  >
                    <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-soft">
                      {row.label}
                    </dt>
                    <dd className="text-sm font-medium text-ink">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* Status rail */}
            <aside className="border-t border-line pt-6 lg:sticky lg:top-24 lg:self-start lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
                Reservation status
              </p>
              <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink">
                Set the next step.
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-ink-soft">
                Confirm the booking once it is approved, or cancel it if the
                reservation cannot go ahead.
              </p>

              <form onSubmit={handleStatusUpdate} className="mt-6">
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-ink-soft">
                  New status
                </label>
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="w-full cursor-pointer rounded-md border border-line bg-transparent px-3.5 py-3 text-sm text-ink outline-none transition-colors duration-200 focus:border-ink"
                >
                  <option value="pending">Pending</option>
                  <option value="confirm">Confirmed</option>
                  <option value="cancel">Cancelled</option>
                </select>

                <button
                  type="submit"
                  disabled={updating || !status || status === booking.status}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2.5 rounded-md bg-accent px-5 py-3 text-sm font-bold text-white shadow-[0_16px_32px_-18px_rgba(250,82,15,0.8)] transition-all duration-300 ease-editorial hover:bg-accent-deep active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updating && <i className="fa-solid fa-circle-notch animate-spin" />}
                  {updating ? "Saving…" : "Save status"}
                </button>
              </form>

              <div className="mt-6 border-t border-line pt-4">
                <p className="text-[11px] leading-relaxed text-ink-soft">
                  Changing the status updates this reservation in the customer
                  bookings view.
                </p>
              </div>
            </aside>
          </div>
        ) : !loading && !error ? (
          <div className="border-b border-line py-20 text-center">
            <h3 className="font-display text-2xl font-bold tracking-tight text-ink">
              Booking not found
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
              This booking may have been removed or the link may be invalid.
            </p>
            <Link
              to="/all-bookings"
              className="mt-6 inline-flex items-center gap-2 border-b border-ink pb-1 text-xs font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
            >
              Back to bookings
              <i className="fa-solid fa-arrow-right text-[9px]" />
            </Link>
          </div>
        ) : null}
      </div>
    </Layout>
  );
};

export default BookingDetails;
