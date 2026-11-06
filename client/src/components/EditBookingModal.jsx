import React from "react";
import { motion } from "framer-motion";
import Button from "./ui/Button";

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4 py-6"
      onClick={() => setEditBookingModal(false)}
    >
      <motion.div
        key="edit-booking-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Edit booking dates"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="max-h-[92vh] w-full max-w-md overflow-y-auto border border-line bg-cream"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-6 border-b border-line px-5 py-5 sm:px-7">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="h-px w-6 bg-accent" aria-hidden="true" />
              <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-accent">
                Reservation
              </p>
            </div>

            <h2 className="mt-3 font-display text-2xl font-bold leading-tight tracking-[-0.03em] text-ink sm:text-3xl">
              Edit booking<span className="text-accent">.</span>
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
              {booking?.car?.name || "Update your booking dates"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setEditBookingModal(false)}
            className="flex h-8 w-8 shrink-0 items-center justify-center border border-line text-ink-soft transition-colors duration-200 hover:border-ink hover:text-ink"
            aria-label="Close modal"
          >
            <i className="fa-solid fa-xmark text-xs" aria-hidden="true" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
          className="px-5 py-6 sm:px-7"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="edit-booking-start"
                className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-ink-soft"
              >
                Pickup date
              </label>
              <input
                id="edit-booking-start"
                type="date"
                value={startDate}
                min={today}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-line bg-white px-3.5 py-2.5 text-sm font-medium text-ink outline-none transition-colors duration-200 focus:border-ink"
              />
            </div>

            <div>
              <label
                htmlFor="edit-booking-return"
                className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-ink-soft"
              >
                Return date
              </label>
              <input
                id="edit-booking-return"
                type="date"
                value={returnDate}
                min={startDate || today}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full border border-line bg-white px-3.5 py-2.5 text-sm font-medium text-ink outline-none transition-colors duration-200 focus:border-ink"
              />
            </div>
          </div>

          <div className="mt-5 flex items-start gap-3 border-l-2 border-amber-500 bg-amber-500/5 px-3.5 py-3">
            <i
              className="fa-solid fa-triangle-exclamation mt-0.5 text-[10px] text-amber-600"
              aria-hidden="true"
            />
            <p className="text-[11px] leading-relaxed text-amber-800">
              A ₹200 penalty will be added to your total price for modifying
              booking dates.
            </p>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2.5 border-t border-line pt-5 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              size="md"
              onClick={() => setEditBookingModal(false)}
            >
              Cancel
            </Button>

            <Button
              variant="accent"
              size="md"
              type="submit"
              disabled={loading}
            >
              {loading ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditBookingModal;
