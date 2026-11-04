import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import BookingModal from "../../components/BookingModal";
import { useDispatch, useSelector } from "react-redux";
import { getCarDetails } from "../../store/features/carSlice";
import API from "../../api/API";

const CarDetails = () => {
  const { id } = useParams();

  const [show, setShow] = useState(false);

  const { carDetail: carDetails, loading, error } = useSelector((state) => state.cars);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const today = new Date().toISOString().split("T")[0];

  const [pickupDate, setPickupDate] = useState(today);
  const [returnDate, setReturnDate] = useState(today);

  useEffect(() => {
    if (id) {
      dispatch(getCarDetails(id));
    }
  }, [id, dispatch]);

  // Booking function
  const handleBooking = async () => {
    if (!user?._id) {
      toast.error("Please log in to book a car");
      return;
    }

    if (!pickupDate || !returnDate) {
      toast.error("Please select pickup and return dates");
      return;
    }

    if (new Date(returnDate) < new Date(pickupDate)) {
      toast.error("Return date cannot be before pickup date");
      return;
    }

    const days = Math.ceil(
      (new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)
    ) + 1;
    const totalPrice = days * Number(carDetails.price || 0);

    try {
      await API.post("/booking/create", {
        user: user._id,
        car: carDetails._id,
        startDate: pickupDate,
        returnDate,
        price: carDetails.price,
        totalPrice,
      });

      toast.success(`${carDetails.name} booked successfully!`);
      setShow(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create booking"
      );
    }
  };

  // Resolve image source - backend stores images as base64 strings
  const getImageSrc = (image) => {
    if (!image) return null;
    // If already a URL (http/https or data URI), return as-is
    if (image.startsWith("http") || image.startsWith("data:")) return image;
    // Otherwise it's a raw base64 string from the backend
    return `data:image/jpeg;base64,${image}`;
  };

  // Loading State
  if (loading) {
    return (
      <section className="flex min-h-[80vh] items-center justify-center bg-cream">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-ink" />
          <p className="text-sm text-ink-soft">Loading car details...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="flex min-h-[80vh] items-center justify-center bg-cream px-4">
        <div className="max-w-md rounded-md border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="text-xl font-semibold text-red-600">Failed to load car</h2>
          <p className="mt-2 text-sm text-red-500">{error}</p>
          <Link
            to="/cars"
            className="mt-6 inline-block rounded-md bg-ink px-5 py-2.5 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-accent"
          >
            Browse Cars
          </Link>
        </div>
      </section>
    );
  }

  // Car Not Found
  if (!carDetails) {
    return (
      <section className="flex min-h-[80vh] items-center justify-center bg-cream px-4">
        <div className="max-w-md rounded-md border border-line bg-white p-8 text-center">
          <h2 className="text-2xl font-semibold text-ink">Car not found</h2>
          <p className="mt-3 text-sm text-ink-soft">
            The car you're looking for doesn't exist or may have been removed.
          </p>
          <Link
            to="/cars"
            className="mt-6 inline-block rounded-md bg-ink px-5 py-2.5 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-accent"
          >
            Browse Cars
          </Link>
        </div>
      </section>
    );
  }

  // Car specifications
  const specifications = [
    { label: "Year", value: carDetails.year },
    { label: "Model", value: carDetails.model },
    { label: "Category", value: carDetails.category },
    { label: "Fuel", value: carDetails.fuel },
    { label: "Seats", value: carDetails.seats },
    { label: "Mileage", value: carDetails.milage },
    {
      label: "Transmission",
      value: carDetails.transmission ? "Automatic" : "Manual",
    },
  ];

  return (
    <section className="bg-cream px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Back Button */}
        <Link
          to="/cars"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-ink-soft transition-colors duration-200 hover:text-ink"
        >
          <span className="text-lg">←</span>
          Back to cars
        </Link>

        {/* Editorial vehicle header */}
        <div className="mb-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
            Vehicle Details
          </p>
          <h1 className="mt-4 text-5xl font-bold tracking-[-0.03em] text-ink sm:text-6xl lg:text-7xl">
            {carDetails.name}
          </h1>
          <p className="mt-4 text-sm font-medium text-ink-soft">
            {carDetails.category} · {carDetails.fuel} · {carDetails.year}
          </p>
        </div>

        {/* Editorial vehicle layout */}
        <div className="grid gap-12 md:grid-cols-12">

          {/* Car Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[420px] overflow-hidden rounded-t-lg bg-cream-deep md:col-span-5 md:h-[72vh] md:rounded-t-none"
          >
            <img
              src={getImageSrc(carDetails.image)}
              alt={carDetails.name}
              className="h-full w-full object-cover"
            />
          </motion.div>

          {/* Car Details */}
          <div className="md:col-span-7">

            <div className="mt-6">
              <p className="text-base leading-relaxed text-ink-soft">{carDetails.about}</p>
            </div>

            {/* Specifications */}
            <div className="mt-10">
              <h2 className="mb-4 text-lg font-bold text-ink">Specifications</h2>
              <div className="overflow-hidden rounded-md border border-line">
                {specifications.map((spec, index) => (
                  <div
                    key={spec.label}
                    className={`flex items-center justify-between px-5 py-3.5 text-sm ${
                      index !== specifications.length - 1 ? "border-b border-line" : ""
                    }`}
                  >
                    <span className="text-ink-soft">{spec.label}</span>
                    <span className="font-semibold text-ink">{spec.value || "N/A"}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mt-8 rounded-md border border-line bg-white p-6">
              <p className="text-sm text-ink-soft">Rental Price</p>
              <p className="mt-1 text-3xl font-bold tracking-tight text-ink">
                ₹{carDetails.price}
                <span className="ml-1 text-sm font-medium text-ink-soft">/ day</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setShow(true)}
                className="flex-1 rounded-md bg-accent px-6 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-accent-deep hover:shadow-[0_12px_28px_-12px_rgba(250,82,15,0.6)] active:scale-[0.98]"
              >
                Book this car
              </button>
              <Link
                to="/contact"
                className="flex-1 rounded-md border border-line px-6 py-3.5 text-center text-sm font-semibold text-ink transition-all duration-300 hover:border-ink hover:bg-cream"
              >
                Contact seller
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {show && (
          <BookingModal
            key="car-details-booking"
            car={carDetails}
            pickupDate={pickupDate}
            setPickupDate={setPickupDate}
            returnDate={returnDate}
            setReturnDate={setReturnDate}
            onClose={() => setShow(false)}
            onBooking={handleBooking}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default CarDetails;
