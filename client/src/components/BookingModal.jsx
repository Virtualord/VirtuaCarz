import React, { useEffect } from "react";
import { motion } from "framer-motion";

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

    const days = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#18181b]/60 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-md border border-line bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-soft">
              New Booking
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-ink">
              Book {car?.name}
            </h2>
          </div>

          {/* Close Button */}
          <button
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
              src={car?.image}
              alt={car?.name}
              className="h-16 w-24 rounded-md object-cover"
            />

            <div>
              <h3 className="font-bold text-ink">
                {car?.name}
              </h3>

              <p className="mt-1 text-sm text-ink-soft">
                ₹{car?.price} / day
              </p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid gap-4 sm:grid-cols-2">

            {/* Pickup */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-ink">
                Pickup Date
              </label>

              <input
                type="date"
                value={pickupDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full rounded-md border border-line bg-cream px-4 py-3 text-sm font-medium text-ink outline-none transition-colors duration-200 focus:border-ink"
              />
            </div>

            {/* Return */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-ink">
                Return Date
              </label>

              <input
                type="date"
                value={returnDate}
                min={pickupDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full rounded-md border border-line bg-cream px-4 py-3 text-sm font-medium text-ink outline-none transition-colors duration-200 focus:border-ink"
              />
            </div>

          </div>

          {/* Booking Summary */}
          <div className="rounded-md border border-line bg-cream p-4">

            <h3 className="mb-4 text-sm font-bold text-ink">
              Booking Summary
            </h3>

            <div className="space-y-3 text-sm">

              <div className="flex justify-between">
                <span className="text-ink-soft">
                  Price per day
                </span>

                <span className="font-semibold text-ink">
                  ₹{car?.price}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-ink-soft">
                  Rental duration
                </span>

                <span className="font-semibold text-ink">
                  {rentalDays} {rentalDays === 1 ? "day" : "days"}
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
        <div className="flex flex-col-reverse gap-3 border-t border-line px-6 py-5 sm:flex-row sm:justify-end">

          <button
            onClick={onClose}
            className="rounded-md border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors duration-200 hover:bg-cream"
          >
            Cancel
          </button>

          <button
            onClick={onBooking}
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:bg-accent-deep hover:shadow-[0_10px_24px_-10px_rgba(250,82,15,0.6)] active:scale-[0.98]"
          >
            Confirm Booking
          </button>

        </div>
      </motion.div>
    </motion.div>
  );
};

export default BookingModal;
