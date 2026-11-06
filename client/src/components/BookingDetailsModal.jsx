import React from "react";
import { motion } from "framer-motion";
import Button from "./ui/Button";
import { getImageSrc } from "../utils/image";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const statusStyles = {
  pending: { dot: "bg-amber-500", text: "text-amber-700" },
  confirm: { dot: "bg-emerald-500", text: "text-emerald-700" },
  confirmed: { dot: "bg-emerald-500", text: "text-emerald-700" },
  cancel: { dot: "bg-red-500", text: "text-red-700" },
  cancelled: { dot: "bg-red-500", text: "text-red-700" },
};

const BookingDetailsModal = ({ booking, setBookingDetailsModal }) => {
  if (!booking) return null;

  // Resolve field names – backend uses startDate, car is populated with name/image/price
  const carName = booking.car?.name || "N/A";
  const carImage = booking.car?.image || "";
  const pricePerDay = booking.car?.price || booking.price;

  const pickup = new Date(booking.startDate || booking.pickupDate);
  const returnDate = new Date(booking.returnDate);

  const rentalDays = Math.max(
    1,
    Math.ceil((returnDate - pickup) / (1000 * 60 * 60 * 24))
  );

  const totalPrice = booking.totalPrice || rentalDays * pricePerDay;
  const status = booking.status || "pending";
  const styles = statusStyles[status] || {
    dot: "bg-zinc-400",
    text: "text-ink-soft",
  };

  const onClose = () => {
    setBookingDetailsModal(false);
  };

  return (
    <motion.div
      key="booking-details-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4 py-6"
      onClick={onClose}
    >
      <motion.div
        key="booking-details-panel"
        role="dialog"
        aria-modal="true"
        aria-label={`Booking details for ${carName}`}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto border border-line bg-cream"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-6 border-b border-line px-5 py-5 sm:px-7">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="h-px w-6 bg-accent" aria-hidden="true" />
              <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-accent">
                Booking details
              </p>
            </div>

            <h2 className="mt-3 font-display text-2xl font-bold leading-tight tracking-[-0.03em] text-ink sm:text-3xl">
              {carName}
              <span className="text-accent">.</span>
            </h2>

            <span
              className={`mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium capitalize ${styles.text}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
              {status}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center border border-line text-ink-soft transition-colors duration-200 hover:border-ink hover:text-ink"
            aria-label="Close modal"
          >
            <i className="fa-solid fa-xmark text-xs" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-6 sm:px-7">
          {/* Car preview */}
          <div className="flex items-center gap-4 border-b border-line pb-5">
            <div className="h-20 w-28 shrink-0 overflow-hidden border border-line bg-cream-deep">
              <img
                src={getImageSrc(carImage)}
                alt={carName}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0">
              <h3 className="truncate font-display text-lg font-semibold tracking-tight text-ink">
                {carName}
              </h3>
              <p className="mt-1 text-xs text-ink-soft">
                {booking.car?.category || "Self-drive"} ·{" "}
                {booking.car?.fuel || "Petrol"}
              </p>
              <p className="mt-1.5 text-sm font-semibold text-ink">
                ₹{Number(pricePerDay || 0).toLocaleString("en-IN")}
                <span className="ml-1 text-[10px] font-medium text-ink-soft">
                  / day
                </span>
              </p>
            </div>
          </div>

          {/* Rental information */}
          <div className="pt-5">
            <div className="flex items-baseline justify-between border-b border-line pb-2.5">
              <h3 className="font-display text-base font-semibold tracking-tight text-ink">
                Rental information
              </h3>
              <span className="font-mono text-[9px] tracking-[0.14em] text-ink-soft">
                {String(rentalDays).padStart(2, "0")} days
              </span>
            </div>

            <dl className="divide-y divide-line border-b border-line">
              <div className="flex items-center justify-between gap-4 py-3 text-xs">
                <dt className="text-ink-soft">Pickup date</dt>
                <dd className="font-semibold text-ink">
                  {formatDate(booking.startDate || booking.pickupDate)}
                </dd>
              </div>

              <div className="flex items-center justify-between gap-4 py-3 text-xs">
                <dt className="text-ink-soft">Return date</dt>
                <dd className="font-semibold text-ink">
                  {formatDate(booking.returnDate)}
                </dd>
              </div>

              <div className="flex items-center justify-between gap-4 py-3 text-xs">
                <dt className="text-ink-soft">Rental duration</dt>
                <dd className="font-semibold text-ink">
                  {rentalDays} {rentalDays === 1 ? "day" : "days"}
                </dd>
              </div>
            </dl>
          </div>

          {/* Payment summary */}
          <div className="pt-5">
            <div className="flex items-baseline justify-between border-b border-line pb-2.5">
              <h3 className="font-display text-base font-semibold tracking-tight text-ink">
                Payment summary
              </h3>
            </div>

            <dl className="divide-y divide-line border-b border-line">
              <div className="flex items-center justify-between py-3 text-xs">
                <dt className="text-ink-soft">Price per day</dt>
                <dd className="font-semibold text-ink">
                  ₹{Number(pricePerDay || 0).toLocaleString("en-IN")}
                </dd>
              </div>

              <div className="flex items-center justify-between py-3 text-xs">
                <dt className="text-ink-soft">Rental duration</dt>
                <dd className="font-semibold text-ink">
                  {rentalDays} {rentalDays === 1 ? "day" : "days"}
                </dd>
              </div>

              <div className="flex items-center justify-between py-3.5">
                <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-soft">
                  Total
                </dt>
                <dd className="font-display text-2xl font-bold tracking-[-0.03em] text-ink">
                  ₹{Number(totalPrice || 0).toLocaleString("en-IN")}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-line px-5 py-4 sm:px-7">
          <Button variant="primary" size="md" onClick={onClose}>
            Close
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BookingDetailsModal;
