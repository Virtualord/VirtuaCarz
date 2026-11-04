import React from "react";
import { motion } from "framer-motion";

const EditBookingModal = ({
  booking,
  startDate,
  setStartDate,
  returnDate,
  setReturnDate,
  handleUpdate,
  loading,
  setEditBookingModal,
}) => {
  const today = new Date().toISOString().split("T")[0];

  return (
    <motion.div
      key="edit-booking-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#18181b]/60 px-4 py-6 backdrop-blur-sm"
      onClick={() => setEditBookingModal(false)}
    >
      {/* Modal */}
      <motion.div
        key="edit-booking-panel"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md overflow-hidden rounded-md border border-line bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-ink">
              Edit Booking
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              {booking?.carName || "Update your booking dates"}
            </p>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={() => setEditBookingModal(false)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-xl text-ink-soft transition-colors duration-200 hover:bg-cream hover:text-ink"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
          className="space-y-5 p-6"
        >
          {/* Start Date */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-ink">
              Pickup Date
            </label>
            <input
              type="date"
              value={startDate}
              min={today}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-md border border-line bg-cream px-4 py-3 text-sm font-medium text-ink outline-none transition-colors duration-200 focus:border-ink"
            />
          </div>

          {/* Return Date */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-ink">
              Return Date
            </label>
            <input
              type="date"
              value={returnDate}
              min={startDate || today}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full rounded-md border border-line bg-cream px-4 py-3 text-sm font-medium text-ink outline-none transition-colors duration-200 focus:border-ink"
            />
          </div>

          {/* Penalty Notice */}
          <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-xs text-amber-700">
              ⚠ A ₹200 penalty will be added to your total price for modifying booking dates.
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-line" />

          {/* Buttons */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setEditBookingModal(false)}
              className="rounded-md border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors duration-200 hover:bg-cream"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-accent px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:bg-accent-deep hover:shadow-[0_10px_24px_-10px_rgba(250,82,15,0.6)] active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditBookingModal;
