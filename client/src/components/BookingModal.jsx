import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Button from "./ui/Button";
import { getImageSrc } from "../utils/image";

const BookingModal = ({
  car,
  pickupDate,
  setPickupDate,
  returnDate,
  setReturnDate,
  onClose,
  onBooking,
}) => {
  // Close modal when Escape is pressed
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  // Calculate number of rental days
  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 0;

    const pickup = new Date(pickupDate);
    const dropoff = new Date(returnDate);

    const difference = dropoff - pickup;

    const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

    return days >= 0 ? days + 1 : 0;
  };

  const rentalDays = calculateDays();
  const totalPrice = rentalDays * Number(car?.price || 0);

  return (
    <motion.div
      key="booking-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4 py-6"
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Book ${car?.name || "car"}`}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto border border-line bg-cream"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-6 border-b border-line px-5 py-5 sm:px-7">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="h-px w-6 bg-accent" aria-hidden="true" />
              <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-accent">
                New booking
              </p>
            </div>

            <h2 className="mt-3 font-display text-2xl font-bold leading-tight tracking-[-0.03em] text-ink sm:text-3xl">
              Book {car?.name || "your car"}
              <span className="text-accent">.</span>
            </h2>
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
            <div className="h-16 w-24 shrink-0 overflow-hidden border border-line bg-cream-deep">
              <img
                src={getImageSrc(car?.image)}
                alt={car?.name || "Car"}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0">
              <h3 className="truncate font-display text-lg font-semibold tracking-tight text-ink">
                {car?.name}
              </h3>
              <p className="mt-1 text-xs text-ink-soft">
                {car?.category || "Self-drive"} · {car?.fuel || "Petrol"} ·{" "}
                {car?.seats || 5} seats
              </p>
              <p className="mt-1.5 text-sm font-semibold text-ink">
                ₹{Number(car?.price || 0).toLocaleString("en-IN")}
                <span className="ml-1 text-[10px] font-medium text-ink-soft">
                  / day
                </span>
              </p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid gap-5 border-b border-line py-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="booking-pickup"
                className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-ink-soft"
              >
                Pickup date
              </label>
              <input
                id="booking-pickup"
                type="date"
                value={pickupDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full border border-line bg-white px-3.5 py-2.5 text-sm font-medium text-ink outline-none transition-colors duration-200 focus:border-ink"
              />
            </div>

            <div>
              <label
                htmlFor="booking-return"
                className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-ink-soft"
              >
                Return date
              </label>
              <input
                id="booking-return"
                type="date"
                value={returnDate}
                min={pickupDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full border border-line bg-white px-3.5 py-2.5 text-sm font-medium text-ink outline-none transition-colors duration-200 focus:border-ink"
              />
            </div>
          </div>

          {/* Booking summary */}
          <div className="pt-5">
            <div className="flex items-baseline justify-between border-b border-line pb-2.5">
              <h3 className="font-display text-base font-semibold tracking-tight text-ink">
                Booking summary
              </h3>
              <span className="font-mono text-[9px] tracking-[0.14em] text-ink-soft">
                {String(rentalDays).padStart(2, "0")} days
              </span>
            </div>

            <dl className="divide-y divide-line border-b border-line">
              <div className="flex items-center justify-between py-3 text-xs">
                <dt className="text-ink-soft">Price per day</dt>
                <dd className="font-semibold text-ink">
                  ₹{Number(car?.price || 0).toLocaleString("en-IN")}
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
                  ₹{Number(totalPrice).toLocaleString("en-IN")}
                </dd>
              </div>
            </dl>

            <p className="mt-4 text-[11px] leading-relaxed text-ink-soft">
              No payment is taken now. Your reservation is reviewed and
              confirmed by the VirtuaCarz team.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-2.5 border-t border-line px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
          <Button variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>

          <Button variant="accent" size="md" onClick={onBooking}>
            Confirm booking
            <i className="fa-solid fa-arrow-right text-[9px]" aria-hidden="true" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BookingModal;
