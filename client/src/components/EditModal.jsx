import React from "react";

const EditModal = ({
  setEditModal,
  uname,
  setUname,
  phone,
  setPhone,
  password,
  setPassword,
  handleUpdate,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#18181b]/60 px-4 py-6 backdrop-blur-sm"
      onClick={() => setEditModal(false)}
    >
      {/* Modal */}
      <div
        className="w-full max-w-md overflow-hidden rounded-md border border-line bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-ink">
              Manage Profile
            </h2>

            <p className="mt-1 text-sm text-ink-soft">
              Update your account information
            </p>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={() => setEditModal(false)}
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
          {/* Username */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-ink">
              Username
            </label>

            <input
              type="text"
              value={uname}
              onChange={(e) => setUname(e.target.value)}
              placeholder="Enter your username"
              className="w-full rounded-md border border-line bg-cream px-4 py-3 text-sm font-medium text-ink placeholder-ink-soft outline-none transition-colors duration-200 focus:border-ink"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-ink">
              Phone Number
            </label>

            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full rounded-md border border-line bg-cream px-4 py-3 text-sm font-medium text-ink placeholder-ink-soft outline-none transition-colors duration-200 focus:border-ink"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-ink">
              New Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full rounded-md border border-line bg-cream px-4 py-3 text-sm font-medium text-ink placeholder-ink-soft outline-none transition-colors duration-200 focus:border-ink"
            />

            <p className="mt-2 text-xs text-ink-soft">
              Leave blank if you don't want to change your password.
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-line" />

          {/* Buttons */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setEditModal(false)}
              className="rounded-md border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors duration-200 hover:bg-cream"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-md bg-accent px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:bg-accent-deep hover:shadow-[0_10px_24px_-10px_rgba(250,82,15,0.6)] active:scale-[0.98]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
