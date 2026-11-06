import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import BookingModal from "../../components/BookingModal";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import { getCarDetails } from "../../store/features/carSlice";
import { getImageSrc } from "../../utils/image";
import API from "../../api/API";

const CarDetails = () => {
  const { id } = useParams();

  const [show, setShow] = useState(false);

  const {
    carDetail: carDetails,
    loading,
    error,
  } = useSelector((state) => state.cars);
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

    const days =
      Math.ceil(
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
    } catch (bookingError) {
      toast.error(
        bookingError.response?.data?.message || "Failed to create booking"
      );
    }
  };

  if (loading) {
    return (
      <section className="flex min-h-[80vh] items-center justify-center bg-cream">
        <div className="flex flex-col items-center gap-3">
          <i className="fa-solid fa-circle-notch animate-spin text-2xl text-accent" aria-hidden="true" />
          <p className="text-sm text-ink-soft">Loading car details…</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex min-h-[80vh] items-center justify-center bg-cream px-4">
        <div className="max-w-md border-l-2 border-red-500 bg-red-500/5 px-5 py-4">
          <h2 className="font-display text-xl font-bold text-red-700">
            Failed to load car
          </h2>
          <p className="mt-2 text-sm text-red-700/80">{error}</p>
          <Link
            to="/cars"
            className="mt-5 inline-flex items-center gap-2 border-b border-red-700 pb-1 text-xs font-semibold text-red-700"
          >
            Browse cars
            <i className="fa-solid fa-arrow-right text-[9px]" aria-hidden="true" />
          </Link>
        </div>
      </section>
    );
  }

  if (!carDetails) {
    return (
      <section className="flex min-h-[80vh] items-center justify-center bg-cream px-4">
        <div className="max-w-md text-center">
          <i className="fa-solid fa-car mb-4 text-3xl text-accent" aria-hidden="true" />
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            Car not found
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            The car you are looking for does not exist or may have been removed
            from the fleet.
          </p>
          <Link
            to="/cars"
            className="mt-6 inline-flex items-center gap-2 border-b border-ink pb-1 text-xs font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
          >
            Browse cars
            <i className="fa-solid fa-arrow-right text-[9px]" aria-hidden="true" />
          </Link>
        </div>
      </section>
    );
  }

  const specifications = [
    { label: "Year", value: carDetails.year },
    { label: "Model", value: carDetails.model },
    { label: "Category", value: carDetails.category },
    { label: "Fuel", value: carDetails.fuel },
    { label: "Seats", value: carDetails.seats },
    {
      label: "Mileage",
      value: carDetails.milage ? `${carDetails.milage} km/l` : null,
    },
    {
      label: "Transmission",
      value: carDetails.transmission ? "Automatic" : "Manual",
    },
  ];

  const isAvailable = carDetails.status !== false;

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <PageHeader
          backTo="/cars"
          backLabel="Back to fleet"
          eyebrow="Fleet / Vehicle"
          title={
            <>
              {carDetails.name}
              <span className="text-accent">.</span>
            </>
          }
          description={`${carDetails.category || "Car"} · ${
            carDetails.fuel || "Petrol"
          } · ${carDetails.year || "2026"}`}
          aside={
            <div className="sm:text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-soft">
                From
              </p>
              <p className="mt-1 font-display text-4xl font-bold leading-none tracking-[-0.04em] text-ink">
                ₹{Number(carDetails.price || 0).toLocaleString("en-IN")}
              </p>
              <p className="mt-1 text-[11px] text-ink-soft">per day</p>
            </div>
          }
        />

        <div className="grid gap-10 pt-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16 lg:pt-12">
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border border-line bg-cream-deep"
            >
              <img
                src={getImageSrc(carDetails.image)}
                alt={carDetails.name}
                className="aspect-[16/11] w-full object-cover"
              />
            </motion.div>

            <div className="mt-8 border-b border-line pb-8">
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
                About this car<span className="text-accent">.</span>
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft">
                {carDetails.about ||
                  "A verified self-drive vehicle ready for your next journey."}
              </p>
            </div>

            <div className="pt-8">
              <div className="flex items-baseline justify-between border-b border-line pb-4">
                <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
                  Specifications<span className="text-accent">.</span>
                </h2>
                <span className="font-mono text-[10px] tracking-[0.16em] text-ink-soft">
                  {specifications.length.toString().padStart(2, "0")} facts
                </span>
              </div>

              <dl className="grid grid-cols-1 border-b border-line sm:grid-cols-2">
                {specifications.map((spec, index) => (
                  <div
                    key={spec.label}
                    className={`flex items-center justify-between gap-4 py-4 sm:px-4 ${
                      index !== specifications.length - 1
                        ? "border-b border-line sm:odd:border-r"
                        : ""
                    } ${index % 2 === 0 ? "sm:pl-0" : ""} ${
                      index % 2 === 1 ? "sm:border-r-0" : ""
                    }`}
                  >
                    <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-soft">
                      {spec.label}
                    </dt>
                    <dd className="text-sm font-medium text-ink">
                      {spec.value || "N/A"}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <aside className="border-t border-line pt-6 lg:sticky lg:top-24 lg:self-start lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
                Reserve this car
              </p>
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${
                  isAvailable ? "text-emerald-700" : "text-accent"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isAvailable ? "bg-emerald-500" : "bg-accent"
                  }`}
                />
                {isAvailable ? "Available" : "Booked out"}
              </span>
            </div>

            <p className="mt-6 font-display text-5xl font-bold leading-none tracking-[-0.05em] text-ink">
              ₹{Number(carDetails.price || 0).toLocaleString("en-IN")}
              <span className="ml-1 font-sans text-xs font-medium tracking-normal text-ink-soft">
                / day
              </span>
            </p>

            <p className="mt-3 text-xs leading-relaxed text-ink-soft">
              Zero security deposit. Free rescheduling. 24/7 roadside assistance
              included with every booking.
            </p>

            <div className="mt-7 space-y-3">
              <Button
                variant="accent"
                size="lg"
                className="w-full"
                onClick={() => setShow(true)}
              >
                Book this car
                <i className="fa-solid fa-arrow-right text-[10px]" aria-hidden="true" />
              </Button>
              <Link
                to="/contact"
                className="flex w-full items-center justify-center rounded-md border border-line px-5 py-3.5 text-sm font-semibold text-ink transition-colors duration-200 hover:border-ink"
              >
                Contact support
              </Link>
            </div>

            <dl className="mt-8 divide-y divide-line border-y border-line">
              {[
                { label: "Pickup", value: "Doorstep or hub" },
                { label: "Fuel", value: carDetails.fuel || "Petrol" },
                {
                  label: "Gearbox",
                  value: carDetails.transmission ? "Automatic" : "Manual",
                },
                { label: "Seats", value: `${carDetails.seats || 5} passengers` },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-4 py-3 text-xs"
                >
                  <dt className="text-ink-soft">{row.label}</dt>
                  <dd className="font-semibold text-ink">{row.value}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-5 text-[11px] leading-relaxed text-ink-soft">
              You will be asked to log in before confirming the reservation.
              Payment is settled after the booking is reviewed.
            </p>
          </aside>
        </div>
      </div>

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
