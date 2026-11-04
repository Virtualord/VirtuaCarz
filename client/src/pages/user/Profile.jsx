import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import EditModal from "../../components/EditModal";
import BookingDetailsModal from "../../components/BookingDetailsModal";
import EditBookingModal from "../../components/EditBookingModal";

import {
  updateUser,
  updateBooking,
  getUserBookings,
  reset,
} from "../../store/features/authSlice.js";

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

  // Sync form when user data is loaded
  useEffect(() => {
    if (user) {
      setUname(user.uname || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  // Fetch user bookings
  useEffect(() => {
    if (user?._id) {
      dispatch(getUserBookings({ id: user._id }))
        .unwrap()
        .then((data) => {
          console.log("Bookings fetched successfully:", data);
          console.log("Bookings array:", data.booking);
        })
        .catch((err) => {
          console.error("Failed to fetch bookings:", err);
          toast.error("Failed to load bookings");
        });
    }
  }, [user?._id, dispatch]);

  // Debug: log bookings state
  useEffect(() => {
    console.log("Bookings state:", bookings);
  }, [bookings]);

  // Reset the form when the edit modal opens
  const handleOpenEditModal = () => {
    setUname(user?.uname || "");
    setPhone(user?.phone || "");
    setPassword("");
    dispatch(reset());
    setEditModal(true);
  };

  // Update user profile
  const handleUpdate = async (e) => {
    e?.preventDefault();

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
    } catch (err) {
      toast.error(
        typeof err === "string" ? err : err?.message || "Failed to update profile"
      );
    }
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setBookingDetailsModal(true);
  };

  // Open edit booking modal for a specific booking
  const handleOpenEditBooking = (booking) => {
    setSelectedBooking(booking);
    // Pre-fill with existing dates (format to YYYY-MM-DD)
    setStartDate(booking.startDate?.split("T")[0] || "");
    setReturnDate(booking.returnDate?.split("T")[0] || "");
    dispatch(reset());
    setEditBookingModal(true);
  };

  // Update booking dates
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
    } catch (err) {
      toast.error(
        typeof err === "string" ? err : err?.message || "Failed to update booking"
      );
    }
  };

  return (
    <section className="min-h-[80vh] bg-cream px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Page Header */}
        <div className="mb-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
            Account
          </p>

          <h1 className="mt-3 text-5xl font-bold tracking-tight text-ink">
            My Profile
          </h1>

          <p className="mt-3 text-base text-ink-soft">
            Manage your account and view your car bookings.
          </p>
        </div>

        {/* Profile Card */}
        <div className="rounded-md border border-line bg-white p-6 shadow-[0_24px_60px_-32px_rgba(24,24,27,0.25)] sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            {/* User Information */}
            <div>
              <h2 className="text-xl font-bold text-ink">
                Personal Information
              </h2>

              <div className="mt-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <span className="text-sm text-ink-soft">Name</span>
                  <span className="text-sm font-semibold text-ink">
                    : {user?.uname || "Not available"}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <span className="text-sm text-ink-soft">Email</span>
                  <span className="text-sm font-semibold text-ink">
                    : {user?.email || "Not available"}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <span className="text-sm text-ink-soft">Phone</span>
                  <span className="text-sm font-semibold text-ink">
                    : {user?.phone || "Not available"}
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <button
              type="button"
              onClick={handleOpenEditModal}
              className="rounded-md bg-accent px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:bg-accent-deep hover:shadow-[0_10px_24px_-10px_rgba(250,82,15,0.6)] active:scale-[0.98]"
            >
              Edit Details
            </button>
          </div>
        </div>

        {/* Bookings */}
        <div className="mt-8 rounded-md border border-line bg-white shadow-[0_24px_60px_-32px_rgba(24,24,27,0.25)]">

          <div className="border-b border-line px-6 py-5 sm:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-ink">
                  Your Bookings
                </h2>
                <p className="mt-1 text-sm text-ink-soft">
                  View your current and previous car bookings.
                </p>
              </div>
            </div>
          </div>

          {bookings?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left">

                <thead>
                  <tr className="border-b border-line">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-ink-soft">
                      Car
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-ink-soft">
                      Journey Date
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-ink-soft">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-ink-soft">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((booking) => (
                    <tr
                      key={booking._id || booking.id}
                      className="border-b border-line transition-colors duration-200 hover:bg-cream"
                    >
                      <td className="px-6 py-5">
                        <span className="font-bold text-ink">
                          {booking.car?.name || "N/A"}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm text-ink-soft">
                        {new Date(booking.startDate || booking.pickupDate).toLocaleDateString("en-IN")}
                      </td>

                      <td className="px-6 py-5">
                        <span className="inline-flex rounded-md border border-line bg-cream px-3 py-1 text-xs font-semibold text-ink">
                          {booking.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* View */}
                          <button
                            type="button"
                            onClick={() => handleViewBooking(booking)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-soft transition-colors duration-200 hover:bg-cream hover:text-ink"
                            aria-label={`View booking`}
                          >
                            <i className="fa-solid fa-eye" />
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditBooking(booking)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-soft transition-colors duration-200 hover:bg-cream hover:text-ink"
                            aria-label={`Edit booking`}
                          >
                            <i className="fa-solid fa-pen" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          ) : (
            <div className="p-10 text-center">
              <i className="fa-solid fa-car text-3xl text-ink-soft" />

              <h3 className="mt-4 text-lg font-bold text-ink">
                No bookings yet
              </h3>

              <p className="mt-2 text-sm text-ink-soft">
                Your bookings will appear here once you book a car.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
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

      {/* Booking Details Modal */}
      <AnimatePresence>
        {bookingDetailsModal && selectedBooking && (
          <BookingDetailsModal
            key={selectedBooking._id || selectedBooking.id}
            booking={selectedBooking}
            setBookingDetailsModal={setBookingDetailsModal}
          />
        )}
      </AnimatePresence>

      {/* Edit Booking Modal */}
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
