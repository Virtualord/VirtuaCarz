import React from "react";
import { motion } from "framer-motion";

const BookingDetailsModal = ({
  booking,
  setBookingDetailsModal,
}) => {
  if (!booking) return null;

  // Resolve field names – backend uses startDate, car is populated with name/image/price
  const carName = booking.car?.name || "N/A";
  const carImage = booking.car?.image || "";
  const pricePerDay = booking.car?.price || booking.price;

  // Calculate rental duration
  const pickup = new Date(booking.startDate);
  const returnDate = new Date(booking.returnDate);

  const rentalDays = Math.max(
    1,
    Math.ceil(
      (returnDate - pickup) / (1000 * 60 * 60 * 24)
    )
  );

  const totalPrice = booking.totalPrice || rentalDays * pricePerDay;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#18181b]/60 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal */}
      <motion.div
        key="booking-details-panel"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg overflow-hidden rounded-md border border-line bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-soft">
              Booking Details
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-ink">
              {carName}
            </h2>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-md text-xl text-ink-soft transition-colors duration-200 hover:bg-cream hover:text-ink"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 p-6">

          {/* Car Preview */}
          <div className="flex items-center gap-4 rounded-md border border-line bg-cream p-3">
            <img
              src={carImage}
              alt={carName}
              className="h-20 w-28 rounded-md object-cover"
            />

            <div>
              <h3 className="font-bold text-ink">
                {carName}
              </h3>

              <p className="mt-1 text-sm text-ink-soft">
                ₹{pricePerDay} / day
              </p>
            </div>
          </div>

          {/* Booking Information */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-ink">
              Rental Information
            </h3>

            <div className="overflow-hidden rounded-md border border-line">

              {/* Pickup */}
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <span className="text-sm text-ink-soft">
                  Pickup Date
                </span>

                <span className="text-sm font-semibold text-ink">
                  {formatDate(booking.pickupDate)}
                </span>
              </div>

              {/* Return */}
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <span className="text-sm text-ink-soft">
                  Return Date
                </span>

                <span className="text-sm font-semibold text-ink">
                  {formatDate(booking.returnDate)}
                </span>
              </div>

              {/* Duration */}
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-ink-soft">
                  Rental Duration
                </span>

                <span className="text-sm font-semibold text-ink">
                  {rentalDays}{" "}
                  {rentalDays === 1 ? "day" : "days"}
                </span>
              </div>

            </div>
          </div>

          {/* Booking Summary */}
          <div className="rounded-md border border-line bg-cream p-4">

            <h3 className="mb-4 text-sm font-bold text-ink">
              Payment Summary
            </h3>

            <div className="space-y-3 text-sm">

              <div className="flex justify-between">
                <span className="text-ink-soft">
                  Price per day
                </span>

                <span className="font-semibold text-ink">
                  ₹{booking.price}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-ink-soft">
                  Rental duration
                </span>

                <span className="font-semibold text-ink">
                  {rentalDays}{" "}
                  {rentalDays === 1 ? "day" : "days"}
                </span>
              </div>

              <div className="h-px bg-line" />

              <div className="flex items-center justify-between">
                <span className="font-semibold text-ink">
                  Total
                </span>

                <span className="text-xl font-bold text-ink">
                  ₹{totalPrice}
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-line px-6 py-5">

          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-ink px-5 py-2.5 text-sm font-bold text-cream transition-colors duration-200 hover:bg-accent"
          >
            Close
          </button>

        </div>
      </motion.div>
    </motion.div>
  );
};

export default BookingDetailsModal;
