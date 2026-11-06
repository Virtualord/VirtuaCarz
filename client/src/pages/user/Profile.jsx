import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import EditModal from "../../components/EditModal";
import BookingDetailsModal from "../../components/BookingDetailsModal";
import EditBookingModal from "../../components/EditBookingModal";
import PageHeader from "../../components/ui/PageHeader";

import {
  updateUser,
  updateBooking,
  getUserBookings,
  reset,
} from "../../store/features/authSlice.js";

const statusStyles = {
  pending: { dot: "bg-amber-500", text: "text-amber-700" },
  confirm: { dot: "bg-emerald-500", text: "text-emerald-700" },
  confirmed: { dot: "bg-emerald-500", text: "text-emerald-700" },
  cancel: { dot: "bg-red-500", text: "text-red-700" },
  cancelled: { dot: "bg-red-500", text: "text-red-700" },
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Profile = () => {
  const dispatch = useDispatch();

  const { user, loading, bookings } = useSelector((state) => state.auth);

  const [editModal, setEditModal] = useState(false);
  const [bookingDetailsModal, setBookingDetailsModal] = useState(false);
  const [editBookingModal, setEditBookingModal] = useState(false);

  const [uname, setUname] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  useEffect(() => {
    if (user) {
      setUname(user.uname || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  useEffect(() => {
    if (user?._id) {
      dispatch(getUserBookings({ id: user._id }))
        .unwrap()
        .catch((error) => {
          console.error("Failed to fetch bookings:", error);
          toast.error("Failed to load bookings");
        });
    }
  }, [user?._id, dispatch]);

  const handleOpenEditModal = () => {
    setUname(user?.uname || "");
    setPhone(user?.phone || "");
    setPassword("");
    dispatch(reset());
    setEditModal(true);
  };

  const handleUpdate = async (event) => {
    event?.preventDefault();

    if (!user?._id) {
      toast.error("User not found. Please log in again.");
      return;
    }

    const updatedUser = {
      uname: uname.trim(),
      phone: phone.trim(),
    };

    if (password.trim()) {
      updatedUser.password = password;
    }

    try {
      await dispatch(updateUser({ id: user._id, updatedUser })).unwrap();
      toast.success("Profile updated successfully!");
      setPassword("");
      setEditModal(false);
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Failed to update profile"
      );
    }
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setBookingDetailsModal(true);
  };

  const handleOpenEditBooking = (booking) => {
    setSelectedBooking(booking);
    setStartDate(booking.startDate?.split("T")[0] || "");
    setReturnDate(booking.returnDate?.split("T")[0] || "");
    dispatch(reset());
    setEditBookingModal(true);
  };

  const handleUpdateBooking = async () => {
    if (!startDate || !returnDate) {
      toast.error("Please select both dates");
      return;
    }

    if (new Date(returnDate) < new Date(startDate)) {
      toast.error("Return date cannot be before pickup date");
      return;
    }

    try {
      await dispatch(
        updateBooking({
          id: selectedBooking._id,
          startDate,
          returnDate,
        })
      ).unwrap();

      toast.success("Booking updated! ₹200 penalty applied.");
      setEditBookingModal(false);
      setSelectedBooking(null);
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Failed to update booking"
      );
    }
  };

  const initial = user?.uname ? user.uname[0].toUpperCase() : "A";
  const bookingCount = bookings?.length || 0;

  return (
    <section className="min-h-[80vh] bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <PageHeader
          eyebrow="Account"
          title={
            <>
              Your account<span className="text-accent">.</span>
            </>
          }
          description="Manage your details and keep track of every reservation, past and upcoming."
          aside={
            <div className="sm:text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-soft">
                Reservations
              </p>
              <p className="mt-1 font-display text-4xl font-bold leading-none tracking-[-0.04em] text-ink">
                {bookingCount}
              </p>
              <p className="mt-1 text-[11px] text-ink-soft">on your account</p>
            </div>
          }
        />

        <div className="grid gap-10 pt-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16 lg:pt-12">
          <div>
            <div className="flex items-end justify-between gap-4 border-b border-line pb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
                  Personal information
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">
                  The details we hold<span className="text-accent">.</span>
                </h2>
              </div>

              <button
                type="button"
                onClick={handleOpenEditModal}
                className="inline-flex shrink-0 items-center gap-2 border-b border-ink pb-1 text-xs font-semibold text-ink transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                Edit details
                <i className="fa-solid fa-pen text-[9px]" aria-hidden="true" />
              </button>
            </div>

            <dl className="divide-y divide-line border-b border-line">
              {[
                { label: "Name", value: user?.uname || "Not available" },
                { label: "Email", value: user?.email || "Not available" },
                { label: "Phone", value: user?.phone || "Not available" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[90px_minmax(0,1fr)] gap-4 py-4 sm:grid-cols-[160px_minmax(0,1fr)]"
                >
                  <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-soft">
                    {row.label}
                  </dt>
                  <dd className="break-all text-sm font-medium text-ink">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <aside className="border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
              Account snapshot
            </p>

            <div className="mt-5 flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-accent/10 font-display text-lg font-bold text-accent">
                {initial}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">
                  {user?.uname || "VirtuaCarz member"}
                </p>
                <p className="truncate text-xs text-ink-soft">
                  {user?.email || "member@virtuacarz.com"}
                </p>
              </div>
            </div>

            <dl className="mt-6 divide-y divide-line border-y border-line">
              <div className="flex items-center justify-between gap-4 py-3 text-xs">
                <dt className="text-ink-soft">Status</dt>
                <dd className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Active
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-3 text-xs">
                <dt className="text-ink-soft">Bookings</dt>
                <dd className="font-semibold text-ink">{bookingCount}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-3 text-xs">
                <dt className="text-ink-soft">Deposit</dt>
                <dd className="font-semibold text-ink">₹0</dd>
              </div>
            </dl>

            <Link
              to="/cars"
              className="mt-6 inline-flex items-center gap-2 border-b border-ink pb-1 text-xs font-semibold text-ink transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              Book another car
              <i className="fa-solid fa-arrow-right text-[9px]" aria-hidden="true" />
            </Link>
          </aside>
        </div>

        <section className="mt-14 sm:mt-16">
          <div className="flex flex-col gap-4 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
                Reservations
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Your bookings<span className="text-accent">.</span>
              </h2>
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-ink-soft sm:text-right">
              View a reservation, change your dates, or review the payment
              summary.
            </p>
          </div>

          {bookings?.length > 0 ? (
            <div className="border-b border-line">
              <div className="divide-y divide-line lg:hidden">
                {bookings.map((booking) => {
                  const styles =
                    statusStyles[booking.status] || {
                      dot: "bg-zinc-400",
                      text: "text-ink-soft",
                    };

                  return (
                    <div key={booking._id || booking.id} className="py-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate font-display text-lg font-semibold tracking-tight text-ink">
                            {booking.car?.name || "Vehicle"}
                          </p>
                          <p className="mt-1 text-xs text-ink-soft">
                            {formatDate(booking.startDate || booking.pickupDate)}
                            <span className="mx-1.5">→</span>
                            {formatDate(booking.returnDate)}
                          </p>
                        </div>
                        <span
                          className={`inline-flex shrink-0 items-center gap-1.5 pt-1 text-[11px] font-medium capitalize ${styles.text}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
                          {booking.status || "pending"}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                        <p className="text-sm font-semibold text-accent">
                          ₹
                          {Number(
                            booking.totalPrice ||
                              booking.price * 1 ||
                              0
                          ).toLocaleString("en-IN")}
                        </p>
                        <div className="flex items-center gap-4 text-[11px] font-semibold">
                          <button
                            type="button"
                            onClick={() => handleViewBooking(booking)}
                            className="inline-flex items-center gap-1.5 text-ink transition-colors hover:text-accent"
                          >
                            View
                            <i className="fa-solid fa-arrow-right text-[9px]" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditBooking(booking)}
                            className="text-ink-soft transition-colors hover:text-ink"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[720px] text-left text-sm text-ink">
                  <thead>
                    <tr className="border-b border-line">
                      {["Vehicle", "Journey", "Total", "Status", "Actions"].map(
                        (heading, index) => (
                          <th
                            key={heading}
                            scope="col"
                            className={`px-3 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft first:pl-0 last:pr-0 ${
                              index === 4 ? "text-right" : ""
                            }`}
                          >
                            {heading}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => {
                      const styles =
                        statusStyles[booking.status] || {
                          dot: "bg-zinc-400",
                          text: "text-ink-soft",
                        };

                      return (
                        <tr
                          key={booking._id || booking.id}
                          className="border-b border-line transition-colors duration-200 last:border-b-0 hover:bg-cream-dark/40"
                        >
                          <td className="px-3 py-4 first:pl-0 last:pr-0">
                            <p className="font-semibold text-ink">
                              {booking.car?.name || "Vehicle"}
                            </p>
                            <p className="mt-0.5 text-xs text-ink-soft">
                              {booking.car?.model || "Self-drive"}
                            </p>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-xs text-ink-soft first:pl-0 last:pr-0">
                            {formatDate(booking.startDate || booking.pickupDate)}
                            <span className="mx-1.5">→</span>
                            {formatDate(booking.returnDate)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 first:pl-0 last:pr-0">
                            <span className="text-sm font-semibold text-accent">
                              ₹
                              {Number(
                                booking.totalPrice ||
                                  booking.price * 1 ||
                                  0
                              ).toLocaleString("en-IN")}
                            </span>
                          </td>
                          <td className="px-3 py-4 first:pl-0 last:pr-0">
                            <span
                              className={`inline-flex items-center gap-1.5 text-[11px] font-medium capitalize ${styles.text}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${styles.dot}`}
                              />
                              {booking.status || "pending"}
                            </span>
                          </td>
                          <td className="px-3 py-4 first:pl-0 last:pr-0">
                            <div className="flex items-center justify-end gap-4">
                              <button
                                type="button"
                                onClick={() => handleViewBooking(booking)}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink transition-colors duration-200 hover:text-accent"
                              >
                                View
                                <i className="fa-solid fa-arrow-right text-[9px]" aria-hidden="true" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEditBooking(booking)}
                                className="text-xs font-medium text-ink-soft transition-colors duration-200 hover:text-ink"
                              >
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="border-b border-line py-20 text-center">
              <i className="fa-solid fa-car mb-5 text-3xl text-accent" aria-hidden="true" />
              <h3 className="font-display text-2xl font-bold tracking-tight text-ink">
                No bookings yet
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
                Your reservations will appear here once you book a car.
              </p>
              <Link
                to="/cars"
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-xs font-bold text-white transition-colors duration-200 hover:bg-accent-deep"
              >
                Find a car
                <i className="fa-solid fa-arrow-right text-[9px]" aria-hidden="true" />
              </Link>
            </div>
          )}
        </section>
      </div>

      {editModal && (
        <EditModal
          setEditModal={setEditModal}
          uname={uname}
          setUname={setUname}
          phone={phone}
          setPhone={setPhone}
          password={password}
          setPassword={setPassword}
          handleUpdate={handleUpdate}
          loading={loading}
        />
      )}

      <AnimatePresence>
        {bookingDetailsModal && selectedBooking && (
          <BookingDetailsModal
            key={selectedBooking._id || selectedBooking.id}
            booking={selectedBooking}
            setBookingDetailsModal={setBookingDetailsModal}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editBookingModal && selectedBooking && (
          <EditBookingModal
            key={selectedBooking._id || selectedBooking.id}
            booking={selectedBooking}
            startDate={startDate}
            setStartDate={setStartDate}
            returnDate={returnDate}
            setReturnDate={setReturnDate}
            handleUpdate={handleUpdateBooking}
            loading={loading}
            setEditBookingModal={setEditBookingModal}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Profile;
