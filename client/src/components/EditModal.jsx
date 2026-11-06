import React from "react";
import Button from "./ui/Button";

const EditModal = ({
  setEditModal,
  uname,
  setUname,
  phone,
  setPhone,
  password,
  setPassword,
  handleUpdate,
  loading,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4 py-6"
      onClick={() => setEditModal(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Edit profile details"
        className="max-h-[92vh] w-full max-w-md overflow-y-auto border border-line bg-cream"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-6 border-b border-line px-5 py-5 sm:px-7">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="h-px w-6 bg-accent" aria-hidden="true" />
              <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-accent">
                Account
              </p>
            </div>

            <h2 className="mt-3 font-display text-2xl font-bold leading-tight tracking-[-0.03em] text-ink sm:text-3xl">
              Edit details<span className="text-accent">.</span>
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
              Update the information held on your account.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setEditModal(false)}
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
          <div className="space-y-5">
            <div>
              <label
                htmlFor="profile-uname"
                className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-ink-soft"
              >
                Name
              </label>
              <input
                id="profile-uname"
                type="text"
                value={uname}
                onChange={(e) => setUname(e.target.value)}
                placeholder="Enter your name"
                className="w-full border border-line bg-white px-3.5 py-2.5 text-sm font-medium text-ink placeholder-ink-soft/70 outline-none transition-colors duration-200 focus:border-ink"
              />
            </div>

            <div>
              <label
                htmlFor="profile-phone"
                className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-ink-soft"
              >
                Phone number
              </label>
              <input
                id="profile-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full border border-line bg-white px-3.5 py-2.5 text-sm font-medium text-ink placeholder-ink-soft/70 outline-none transition-colors duration-200 focus:border-ink"
              />
            </div>

            <div>
              <label
                htmlFor="profile-password"
                className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-ink-soft"
              >
                New password
              </label>
              <input
                id="profile-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current"
                className="w-full border border-line bg-white px-3.5 py-2.5 text-sm font-medium text-ink placeholder-ink-soft/70 outline-none transition-colors duration-200 focus:border-ink"
              />
              <p className="mt-2 text-[11px] leading-relaxed text-ink-soft">
                Only fill this in if you want to change your password.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2.5 border-t border-line pt-5 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              size="md"
              onClick={() => setEditModal(false)}
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
      </div>
    </div>
  );
};

export default EditModal;
