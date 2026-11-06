import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { getAllCars } from "../store/features/carSlice";
import initialCars from "../Data/carsData.json";
import BookingModal from "../components/BookingModal";
import Button from "../components/ui/Button";
import Eyebrow from "../components/ui/Eyebrow";
import Reveal from "../components/ui/Reveal";
import API from "../api/API";
import { getImageSrc } from "../utils/image";

// Curated scenic road trip image for the editorial hero
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&auto=format&fit=crop&q=80";

// Top cities with verified hubs
const POPULAR_CITIES = [
  { name: "Bhopal", state: "Madhya Pradesh", hubs: 18, popular: "Habib Ganj & Airport" },
  { name: "Mumbai", state: "Maharashtra", hubs: 52, popular: "Bandra, BKC & Airport T2" },
  { name: "Bengaluru", state: "Karnataka", hubs: 48, popular: "Indiranagar, Koramangala & KIA" },
  { name: "Delhi NCR", state: "Delhi", hubs: 64, popular: "Aerocity, Cyber Hub & Connaught" },
  { name: "Hyderabad", state: "Telangana", hubs: 36, popular: "Hitec City, Gachibowli & RGIA" },
  { name: "Pune", state: "Maharashtra", hubs: 28, popular: "Viman Nagar, Hinjewadi & KP" },
  { name: "Goa", state: "Goa", hubs: 24, popular: "Mopa Airport, Panjim & Dabolim" },
  { name: "Jaipur", state: "Rajasthan", hubs: 16, popular: "Airport & C-Scheme" },
];

// Booking type tabs shown inside the hero search console
const BOOKING_TABS = [
  { id: "daily", label: "Daily Drives", desc: "Short trips, up to 7 days" },
  { id: "subscription", label: "Subscription", desc: "Long duration, 7+ days" },
  { id: "weekday", label: "Weekday Pass", desc: "Mon–Fri fixed KM" },
  { id: "ev", label: "EV & Luxury", desc: "Zero-emission fleet", badge: "New" },
];

// FAQ items
const FAQS = [
  {
    q: "What documents do I need to rent a self-drive car?",
    a: "You only need a valid original Driving License (held for at least 1 year) and an Aadhaar card or government ID. Our digital KYC verifies your profile in under 60 seconds with zero physical paperwork.",
  },
  {
    q: "Is there any security deposit required?",
    a: "No. Unlike traditional car rental agencies, VirtuaCarz offers ₹0 security deposit on the majority of our fleet through seamless digital pre-authorization. You only pay for your rental time and fuel option.",
  },
  {
    q: "How does Doorstep Delivery and Airport Pickup work?",
    a: "Simply select 'Delivery & Pick-up' when booking. Our executive will deliver a sanitized, inspected vehicle right to your home, office, or terminal gate at the scheduled time. Return works the same way.",
  },
  {
    q: "What is the fuel policy?",
    a: "You have two flexible choices: 'With Fuel' (we reimburse all petrol/diesel against your receipts) or 'Without Fuel' (receive the car with some fuel and return it at the same level). No hidden markups.",
  },
  {
    q: "Can I take the rental car outside state borders?",
    a: "Yes. All VirtuaCarz vehicles possess All-India Commercial Taxi / Tourist Permits. You can drive across state lines freely; any state border taxes or FASTag tolls are billed at actuals.",
  },
  {
    q: "What happens if the car breaks down or has a flat tyre?",
    a: "Every booking includes 24x7 Pan-India Roadside Assistance (RSA). In case of an emergency, tap 'Roadside Assist' in the app or call our emergency hotline. We dispatch immediate repair or replacement.",
  },
];

// Feature highlights
const WHY_US_FEATURES = [
  {
    title: "Zero security deposit",
    desc: "Keep your money where it belongs. Zero locked capital, with instant digital pre-authorization.",
  },
  {
    title: "Doorstep & hub delivery",
    desc: "Your sanitized car handed over at your doorstep, hotel, or directly outside the airport terminal.",
  },
  {
    title: "100% keyless digital unlock",
    desc: "Zero queues and zero paperwork. Unlock and start your vehicle directly via cloud smart access.",
  },
  {
    title: "Unlimited kilometres",
    desc: "Drive as far as the road goes. Select unlimited KM plans with no speed caps or mileage anxiety.",
  },
  {
    title: "24/7 pan-India assistance",
    desc: "Full roadside coverage, emergency breakdown support, and comprehensive liability insurance.",
  },
  {
    title: "Multipoint sanitized fleet",
    desc: "Every vehicle is professionally detailed, sterilized, and mechanically inspected before departure.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Doorstep delivery at 6:00 AM on the dot. The car was spotless, smelled brand new, and the zero deposit made this by far the smoothest car rental I have ever experienced.",
    name: "Rohit Sharma",
    meta: "Mumbai → Goa · Hyundai Creta SX(O)",
  },
  {
    quote:
      "Rented the Porsche Taycan for our anniversary weekend. Incredible performance, keyless unlock via the app worked instantly, and customer care answered within seconds.",
    name: "Ananya Iyer",
    meta: "Bengaluru → Coorg · Porsche Taycan",
  },
  {
    quote:
      "VirtuaCarz is leagues ahead of traditional rentals. No bargaining, clear fuel policy, and the Fortuner handled the Satpura mountain trails like a dream.",
    name: "Vikram Patel",
    meta: "Bhopal → Pachmarhi · Toyota Fortuner 4x4",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Select dates & city",
    desc: "Choose pickup and return dates, then pick doorstep delivery or a convenient airport hub.",
  },
  {
    step: "02",
    title: "Choose your vehicle",
    desc: "Compare fuel types, passenger capacity, transmission, and choose your favourite model.",
  },
  {
    step: "03",
    title: "60-second digital KYC",
    desc: "Upload your driving licence and ID once. Verified instantly, without paper documents.",
  },
  {
    step: "04",
    title: "Unlock & drive",
    desc: "Arrive at the car, tap unlock on your smartphone, and set off on your journey.",
  },
];

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cars } = useSelector((state) => state.cars);
  const { user } = useSelector((state) => state.auth);

  // Fallback to local cars data if the backend has only a few cars or is offline
  const allAvailableCars = cars && cars.length > 2 ? cars : initialCars;

  // Search state
  const [activeTab, setActiveTab] = useState("daily");
  const [selectedCity, setSelectedCity] = useState("Bhopal");
  const [pickupSpot, setPickupSpot] = useState("Habib Ganj Hub & Stn");
  const [deliveryToggle, setDeliveryToggle] = useState(true);
  const [cityModalOpen, setCityModalOpen] = useState(false);

  // Dates state
  const todayDate = new Date();
  const tomorrowDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const returnDateDefault = new Date(Date.now() + 48 * 60 * 60 * 1000);

  const [tripStartDate, setTripStartDate] = useState(
    tomorrowDate.toISOString().split("T")[0]
  );
  const [tripStartTime] = useState("09:00 AM");
  const [tripEndDate, setTripEndDate] = useState(
    returnDateDefault.toISOString().split("T")[0]
  );
  const [tripEndTime] = useState("09:00 PM");

  // Fleet filters state
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  // Booking modal
  const [selectedBookingCar, setSelectedBookingCar] = useState(null);

  // FAQ state
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  useEffect(() => {
    dispatch(getAllCars());
  }, [dispatch]);

  // Filtered cars
  const filteredCars = allAvailableCars.filter((car) => {
    const matchCategory =
      categoryFilter === "all"
        ? true
        : categoryFilter === "electric"
        ? car.fuel?.toLowerCase() === "electric"
        : car.category?.toLowerCase() === categoryFilter.toLowerCase();

    const matchSearch =
      searchTerm.trim() === "" ||
      car.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.about?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchCategory && matchSearch;
  });

  // Sorted cars
  const sortedCars = [...filteredCars].sort((a, b) => {
    if (sortBy === "price-low") return Number(a.price) - Number(b.price);
    if (sortBy === "price-high") return Number(b.price) - Number(a.price);
    return 0;
  });

  // Hand-picked showcase cars from the live fleet
  const featuredCars = allAvailableCars.slice(0, 3);

  // Scroll to fleet
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const fleetEl = document.getElementById("popular-fleet-section");
    if (fleetEl) {
      fleetEl.scrollIntoView({ behavior: "smooth" });
    }
    toast.success(`Showing verified cars in ${selectedCity}`);
  };

  // Instant booking execution
  const handleBookingConfirm = async () => {
    if (!user?._id) {
      toast.error("Please log in to book a vehicle");
      navigate("/login");
      return;
    }

    try {
      const days = Math.max(
        1,
        Math.ceil(
          (new Date(tripEndDate) - new Date(tripStartDate)) /
            (1000 * 60 * 60 * 24)
        )
      );
      const totalPrice = days * Number(selectedBookingCar?.price || 0);

      await API.post("/booking/create", {
        user: user._id,
        car: selectedBookingCar?._id || selectedBookingCar?.id,
        startDate: tripStartDate,
        returnDate: tripEndDate,
        price: selectedBookingCar?.price,
        totalPrice,
      });

      toast.success(`${selectedBookingCar?.name} booked successfully!`);
      setSelectedBookingCar(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete booking");
    }
  };

  const categories = [
    { id: "all", label: "All fleet" },
    { id: "suv", label: "SUVs & 4x4" },
    { id: "sports", label: "Luxury & sports" },
    { id: "sedan", label: "Sedans" },
    { id: "electric", label: "Electric" },
  ];

  return (
    <div className="min-h-screen bg-cream text-ink selection:bg-ink selection:text-cream">
      {/* ─── UTILITY STRIP ─── */}
      <div className="border-b border-line bg-cream-dark">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft sm:px-6 lg:px-8">
          <p>Self-drive freedom in 50+ Indian cities</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-accent" /> ₹0 deposit
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-accent" /> 24/7 support
            </span>
            <button
              type="button"
              onClick={() => handleSearchSubmit()}
              className="hidden items-center gap-1.5 text-ink transition-colors duration-200 hover:text-accent md:inline-flex"
            >
              Book a car
              <i className="fa-solid fa-arrow-right text-[8px]" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── HERO ─── */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-16">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.1, delayChildren: 0.05 },
                },
              }}
            >
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
              >
                <Eyebrow>Self-drive, redefined</Eyebrow>
              </motion.div>

              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 26 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                className="mt-6 font-display text-[3.35rem] font-bold leading-[0.9] tracking-[-0.055em] text-ink sm:text-[5rem] lg:text-[5.5rem] xl:text-[6.25rem]"
              >
                The road
                <br />
                is yours<span className="text-accent">.</span>
              </motion.h1>

              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 22 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.8,
                      delay: 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  },
                }}
                className="mt-7 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg"
              >
                A clean, verified fleet of self-drive cars across India.
                Transparent pricing, zero security deposit, and the open road
                ahead of you.
              </motion.p>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 22 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.8,
                      delay: 0.14,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  },
                }}
                className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4"
              >
                <Button
                  variant="accent"
                  size="lg"
                  onClick={() => handleSearchSubmit()}
                >
                  Book your car
                  <i
                    className="fa-solid fa-arrow-right text-[10px]"
                    aria-hidden="true"
                  />
                </Button>

                <Link
                  to="/cars"
                  className="group inline-flex items-center gap-2 border-b border-ink pb-1 text-sm font-semibold text-ink transition-colors duration-200 hover:border-accent hover:text-accent"
                >
                  Explore the fleet
                  <i
                    className="fa-solid fa-arrow-right text-[9px] transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </motion.div>

              <motion.dl
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { duration: 0.9, delay: 0.25 },
                  },
                }}
                className="mt-11 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 sm:grid-cols-4"
              >
                {[
                  { value: "50+", label: "Cities" },
                  { value: "₹0", label: "Deposit" },
                  { value: "4.8/5", label: "Rated" },
                  { value: "24/7", label: "Support" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <dd className="font-display text-2xl font-bold tracking-[-0.03em] text-ink sm:text-3xl">
                      {stat.value}
                    </dd>
                    <dt className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft">
                      {stat.label}
                    </dt>
                  </div>
                ))}
              </motion.dl>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="overflow-hidden border border-line bg-cream-deep">
                <img
                  src={HERO_IMAGE}
                  alt="A performance car on the open road"
                  className="aspect-[4/4.4] w-full object-cover sm:aspect-[16/11] lg:aspect-[4/4.6]"
                />
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 border-b border-line pb-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink">
                  The 2026 collection
                </span>
                <span className="font-mono text-[10px] tracking-[0.12em] text-ink-soft">
                  Est. 2026 · Pan-India
                </span>
              </div>

              <div className="absolute left-4 top-4 border border-cream/30 bg-ink px-3 py-1.5">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-cream">
                  Now taking bookings
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── BOOKING SEARCH CONSOLE ─── */}
      <section
        id="book"
        className="border-b border-line bg-cream-dark py-10 sm:py-12"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="border border-line bg-cream"
          >
            {/* Booking tabs */}
            <div className="flex flex-wrap items-center gap-x-7 gap-y-2 border-b border-line px-4 pt-3 sm:px-6">
              {BOOKING_TABS.map((tab, index) => {
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`group relative flex items-baseline gap-2 pb-3 pt-2 text-left text-xs font-semibold transition-colors duration-200 sm:text-[13px] ${
                      isActive ? "text-ink" : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    <span
                      className={`font-mono text-[9px] ${
                        isActive ? "text-accent" : "text-ink-soft/60"
                      }`}
                    >
                      0{index + 1}
                    </span>
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className="border border-accent/30 px-1 py-px text-[8px] font-bold uppercase tracking-[0.12em] text-accent">
                        New
                      </span>
                    )}
                    <span
                      className={`absolute inset-x-0 bottom-0 h-px transition-colors duration-200 ${
                        isActive ? "bg-accent" : "bg-transparent"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSearchSubmit}>
              <div className="grid grid-cols-1 divide-y divide-line sm:grid-cols-2 lg:grid-cols-[1.05fr_1.35fr_0.85fr_0.85fr_auto] lg:divide-x lg:divide-y-0">
                {/* 1. City */}
                <div className="relative px-4 py-4 sm:px-6">
                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink-soft">
                    City
                  </label>
                  <button
                    type="button"
                    onClick={() => setCityModalOpen(!cityModalOpen)}
                    aria-expanded={cityModalOpen}
                    className="mt-1.5 flex w-full items-center justify-between gap-2 text-left"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <i
                        className="fa-solid fa-location-dot text-[11px] text-accent"
                        aria-hidden="true"
                      />
                      <span className="truncate text-sm font-semibold text-ink">
                        {selectedCity}
                      </span>
                    </span>
                    <i
                      className={`fa-solid fa-chevron-down text-[8px] text-ink-soft transition-transform duration-200 ${
                        cityModalOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  <AnimatePresence>
                    {cityModalOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.18 }}
                        className="absolute left-0 top-full z-40 mt-px w-[min(19rem,calc(100vw-2rem))] border border-line bg-cream p-2"
                      >
                        <p className="px-2 pb-2 pt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-ink-soft">
                          Select rental city
                        </p>
                        <div className="max-h-60 overflow-y-auto">
                          {POPULAR_CITIES.map((city) => (
                            <button
                              key={city.name}
                              type="button"
                              onClick={() => {
                                setSelectedCity(city.name);
                                setPickupSpot(`${city.popular}, ${city.name}`);
                                setCityModalOpen(false);
                              }}
                              className={`flex w-full items-center justify-between gap-3 px-2 py-2 text-left transition-colors duration-150 ${
                                selectedCity === city.name
                                  ? "bg-cream-dark"
                                  : "hover:bg-cream-dark/60"
                              }`}
                            >
                              <span className="min-w-0">
                                <span className="block truncate text-xs font-semibold text-ink">
                                  {city.name}
                                </span>
                                <span className="block truncate text-[10px] text-ink-soft">
                                  {city.popular}
                                </span>
                              </span>
                              <span className="shrink-0 font-mono text-[9px] text-ink-soft">
                                {city.hubs} hubs
                              </span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 2. Pickup hub */}
                <div className="px-4 py-4 sm:px-6">
                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink-soft">
                    Pickup location / hub
                  </label>
                  <div className="mt-1.5 flex items-center gap-2">
                    <i
                      className="fa-solid fa-building text-[11px] text-accent"
                      aria-hidden="true"
                    />
                    <input
                      type="text"
                      value={pickupSpot}
                      onChange={(e) => setPickupSpot(e.target.value)}
                      placeholder="Airport, railway station, city hub…"
                      className="w-full bg-transparent text-sm font-semibold text-ink placeholder-ink-soft/70 outline-none"
                    />
                  </div>
                </div>

                {/* 3. Trip start */}
                <div className="px-4 py-4 sm:px-6">
                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink-soft">
                    Trip start
                  </label>
                  <div className="mt-1.5 flex items-baseline gap-2">
                    <i
                      className="fa-regular fa-calendar text-[11px] text-accent"
                      aria-hidden="true"
                    />
                    <input
                      type="date"
                      value={tripStartDate}
                      min={todayDate.toISOString().split("T")[0]}
                      onChange={(e) => setTripStartDate(e.target.value)}
                      className="w-full bg-transparent text-sm font-semibold text-ink outline-none"
                    />
                  </div>
                  <p className="mt-0.5 pl-[19px] font-mono text-[9px] text-ink-soft">
                    {tripStartTime}
                  </p>
                </div>

                {/* 4. Trip end */}
                <div className="px-4 py-4 sm:px-6">
                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink-soft">
                    Trip end
                  </label>
                  <div className="mt-1.5 flex items-baseline gap-2">
                    <i
                      className="fa-regular fa-calendar-check text-[11px] text-accent"
                      aria-hidden="true"
                    />
                    <input
                      type="date"
                      value={tripEndDate}
                      min={tripStartDate}
                      onChange={(e) => setTripEndDate(e.target.value)}
                      className="w-full bg-transparent text-sm font-semibold text-ink outline-none"
                    />
                  </div>
                  <p className="mt-0.5 pl-[19px] font-mono text-[9px] text-ink-soft">
                    {tripEndTime}
                  </p>
                </div>

                {/* 5. Search */}
                <div className="flex items-stretch px-4 py-4 sm:col-span-2 lg:col-span-1 lg:px-5">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2.5 bg-accent px-5 py-3.5 text-xs font-bold text-white transition-colors duration-300 hover:bg-accent-deep lg:w-auto lg:px-6"
                  >
                    <i
                      className="fa-solid fa-magnifying-glass text-[11px]"
                      aria-hidden="true"
                    />
                    <span>Search cars</span>
                  </button>
                </div>
              </div>

              {/* Bottom options */}
              <div className="flex flex-col gap-4 border-t border-line px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <label className="flex cursor-pointer items-start gap-2.5 text-[11px] leading-relaxed text-ink-soft">
                  <input
                    type="checkbox"
                    checked={deliveryToggle}
                    onChange={(e) => setDeliveryToggle(e.target.checked)}
                    className="mt-0.5 h-3.5 w-3.5 rounded-none border-line bg-white text-ink focus:ring-0"
                  />
                  <span>
                    Delivery &amp; pick-up, available for eligible cars and
                    locations.
                  </span>
                </label>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                  <span className="inline-flex items-center gap-1.5">
                    <i className="fa-solid fa-check text-[9px] text-accent" /> Zero deposit
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <i className="fa-solid fa-check text-[9px] text-accent" /> Free rescheduling
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <i className="fa-solid fa-check text-[9px] text-accent" /> 24/7 roadside cover
                  </span>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ─── WHY CHOOSE US ─── */}
      <section className="border-b border-line bg-cream py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Reveal>
                <div className="lg:sticky lg:top-24 lg:self-start">
                  <Eyebrow>Why VirtuaCarz</Eyebrow>
                  <h2 className="mt-5 font-display text-4xl font-bold leading-[0.96] tracking-[-0.045em] text-ink sm:text-5xl">
                    The frictionless
                    <br />
                    standard<span className="text-accent">.</span>
                  </h2>
                  <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-soft sm:text-base">
                    Engineered for seamless road trips. No hidden surprises, no
                    bureaucratic paperwork — just you, the wheel, and the open
                    road.
                  </p>
                  <Link
                    to="/about"
                    className="mt-6 inline-flex items-center gap-2 border-b border-ink pb-1 text-xs font-semibold text-ink transition-colors duration-200 hover:border-accent hover:text-accent"
                  >
                    Our operating rules
                    <i
                      className="fa-solid fa-arrow-right text-[9px]"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-8">
              <div className="border-t border-line">
                {WHY_US_FEATURES.map((feature, index) => (
                  <Reveal key={feature.title} delay={0.04 * (index % 3)}>
                    <div className="group flex items-baseline gap-5 border-b border-line py-6 transition-all duration-300 ease-editorial hover:pl-2 sm:gap-8 sm:py-7">
                      <span className="w-7 shrink-0 font-mono text-[10px] text-accent">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="grid flex-1 gap-1.5 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:items-baseline sm:gap-8">
                        <h3 className="font-display text-lg font-semibold tracking-tight text-ink transition-colors duration-200 group-hover:text-accent sm:text-xl">
                          {feature.title}
                        </h3>
                        <p className="max-w-xl text-sm leading-relaxed text-ink-soft">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="border-b border-line bg-cream-dark py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col gap-6 border-b border-line pb-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Eyebrow>How it works</Eyebrow>
                <h2 className="mt-5 max-w-xl font-display text-4xl font-bold leading-[0.96] tracking-[-0.045em] text-ink sm:text-5xl">
                  Four steps to the highway
                  <span className="text-accent">.</span>
                </h2>
              </div>
              <p className="max-w-xs text-xs leading-relaxed text-ink-soft sm:text-right">
                From first search to first turn — the whole handover takes
                minutes, not a morning.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-10 pt-10 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-line">
            {STEPS.map((step, index) => (
              <Reveal key={step.step} delay={0.06 * index}>
                <div className="border-t border-line pt-5 lg:border-t-0 lg:px-7 lg:pt-0 lg:first:pl-0 lg:last:pr-0">
                  <span className="font-mono text-[10px] text-accent">
                    {step.step}
                  </span>
                  <h3 className="mt-6 font-display text-xl font-bold tracking-tight text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 max-w-xs text-sm leading-relaxed text-ink-soft">
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FLEET SHOWCASE ─── */}
      <section id="popular-fleet-section" className="border-b border-line bg-cream py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <Eyebrow>Available self-drive fleet</Eyebrow>
                <h2 className="mt-5 font-display text-4xl font-bold leading-[0.96] tracking-[-0.045em] text-ink sm:text-5xl">
                  Find your car in {selectedCity}
                  <span className="text-accent">.</span>
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-ink-soft lg:text-right">
                Choose from available self-drive cars based on your location,
                travel dates, car type, and trip requirements.
              </p>
            </div>
          </Reveal>

          {/* Filters */}
          <div className="mt-10 flex flex-col gap-5 border-b border-line pb-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {categories.map((category) => {
                const isActive = categoryFilter === category.id;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setCategoryFilter(category.id)}
                    className={`relative pb-1 text-xs font-semibold transition-colors duration-200 sm:text-[13px] ${
                      isActive
                        ? "text-ink"
                        : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    {category.label}
                    <span
                      className={`absolute inset-x-0 bottom-0 h-px ${
                        isActive ? "bg-accent" : "bg-transparent"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 border border-line bg-white px-3 py-2">
                <i
                  className="fa-solid fa-magnifying-glass text-[10px] text-ink-soft"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  placeholder="Search model…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-40 bg-transparent text-xs text-ink placeholder-ink-soft outline-none sm:w-48"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort cars"
                className="border border-line bg-white px-3 py-2 text-xs font-medium text-ink outline-none transition-colors duration-200 focus:border-ink"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </div>
          </div>

          {/* Fleet rows */}
          {sortedCars.length > 0 ? (
            <div className="mt-2 border-b border-line">
              {sortedCars.map((car, index) => {
                const isBookedOut = car.status === false;

                return (
                  <motion.article
                    key={car._id || car.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.12 }}
                    transition={{
                      duration: 0.65,
                      delay: 0.04 * (index % 4),
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group grid gap-0 border-t border-line py-7 md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] md:gap-10 md:py-8"
                  >
                    <Link
                      to={`/cars/${car._id || car.id}`}
                      className="relative block overflow-hidden border border-line bg-cream-deep"
                    >
                      <img
                        src={getImageSrc(car.image)}
                        alt={car.name}
                        className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 border border-cream/40 bg-cream/95 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-ink">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isBookedOut ? "bg-accent" : "bg-emerald-500"
                          }`}
                        />
                        {isBookedOut ? "Booked out" : "Available"}
                      </span>
                    </Link>

                    <div className="flex flex-col pt-5 md:pt-0">
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="font-mono text-[10px] text-accent">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
                          {car.category || "Sedan"} · {car.fuel || "Petrol"} ·{" "}
                          {car.year || "2026"}
                        </span>
                      </div>

                      <h3 className="mt-3 font-display text-3xl font-bold tracking-[-0.035em] text-ink transition-colors duration-300 group-hover:text-accent sm:text-4xl">
                        {car.name}
                      </h3>

                      <p className="mt-3 line-clamp-2 max-w-xl text-sm leading-relaxed text-ink-soft">
                        {car.about}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-1.5 border-y border-line py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                        <span>{car.seats || 5} seats</span>
                        <span>
                          {car.transmission || car.transmisson
                            ? "Automatic"
                            : "Manual"}
                        </span>
                        <span>
                          {car.milage ? `${car.milage} km/l` : "High mileage"}
                        </span>
                      </div>

                      <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-5">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-ink-soft">
                            Starting from
                          </p>
                          <p className="mt-1 font-display text-2xl font-bold tracking-[-0.03em] text-ink">
                            ₹{Number(car.price || 0).toLocaleString("en-IN")}
                            <span className="ml-1 font-sans text-xs font-medium tracking-normal text-ink-soft">
                              / day
                            </span>
                          </p>
                        </div>

                        <div className="flex items-center gap-5">
                          <Link
                            to={`/cars/${car._id || car.id}`}
                            className="inline-flex items-center gap-2 border-b border-ink pb-1 text-xs font-semibold text-ink transition-colors duration-200 hover:border-accent hover:text-accent"
                          >
                            Details
                            <i
                              className="fa-solid fa-arrow-right text-[9px]"
                              aria-hidden="true"
                            />
                          </Link>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setSelectedBookingCar(car)}
                          >
                            Book now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          ) : (
            <div className="mt-10 border-b border-line py-16 text-center">
              <i
                className="fa-solid fa-car mb-4 text-2xl text-accent"
                aria-hidden="true"
              />
              <h3 className="font-display text-2xl font-bold tracking-tight text-ink">
                No cars match those filters
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
                Try adjusting your search criteria or reset the category.
              </p>
              <Button
                variant="primary"
                size="sm"
                className="mt-6"
                onClick={() => {
                  setCategoryFilter("all");
                  setSearchTerm("");
                }}
              >
                Reset filters
              </Button>
            </div>
          )}

          <div className="mt-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="font-mono text-[10px] tracking-[0.14em] text-ink-soft">
              {sortedCars.length.toString().padStart(2, "0")} of{" "}
              {allAvailableCars.length.toString().padStart(2, "0")} vehicles
              shown
            </p>
            <Link
              to="/cars"
              className="group inline-flex items-center gap-2 border-b border-ink pb-1 text-sm font-semibold text-ink transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              Explore all {allAvailableCars.length} cars
              <i
                className="fa-solid fa-arrow-right text-[9px] transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FEATURED VEHICLES ─── */}
      <section className="border-b border-line bg-cream-dark py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <Eyebrow>This season&apos;s selection</Eyebrow>
                <h2 className="mt-5 font-display text-4xl font-bold leading-[0.96] tracking-[-0.045em] text-ink sm:text-5xl">
                  Featured from the fleet
                  <span className="text-accent">.</span>
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-ink-soft lg:text-right">
                Handpicked machines our team drives hardest — the ones our
                customers rebook most.
              </p>
            </div>
          </Reveal>

          {featuredCars.length > 0 && (
            <div className="mt-10 grid gap-10 border-t border-line pt-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-14">
              <Reveal>
                <Link
                  to={`/cars/${featuredCars[0]._id || featuredCars[0].id}`}
                  className="group block"
                >
                  <div className="overflow-hidden border border-line bg-cream-deep">
                    <img
                      src={getImageSrc(featuredCars[0].image)}
                      alt={featuredCars[0].name}
                      className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </div>

                  <div className="border-b border-line pb-5 pt-5">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-3xl font-bold tracking-[-0.035em] text-ink transition-colors duration-200 group-hover:text-accent sm:text-4xl">
                        {featuredCars[0].name}
                      </h3>
                      <span className="shrink-0 text-sm font-semibold text-ink">
                        ₹{Number(featuredCars[0].price || 0).toLocaleString("en-IN")}
                        <span className="ml-1 text-[11px] font-medium text-ink-soft">
                          / day
                        </span>
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 max-w-xl text-sm leading-relaxed text-ink-soft">
                      {featuredCars[0].about}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold text-ink transition-colors duration-200 group-hover:text-accent">
                      View this car
                      <i
                        className="fa-solid fa-arrow-right text-[9px]"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </Link>
              </Reveal>

              <div className="border-t border-line lg:border-t-0">
                {featuredCars.slice(1).map((car) => (
                  <Reveal key={car._id || car.id}>
                    <Link
                      to={`/cars/${car._id || car.id}`}
                      className="group grid grid-cols-[96px_minmax(0,1fr)] items-center gap-4 border-b border-line py-4 transition-all duration-300 ease-editorial hover:pl-2 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-6 sm:py-5"
                    >
                      <div className="overflow-hidden border border-line bg-cream-deep">
                        <img
                          src={getImageSrc(car.image)}
                          alt={car.name}
                          className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.04]"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate font-display text-xl font-semibold tracking-tight text-ink transition-colors duration-200 group-hover:text-accent">
                          {car.name}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-soft">
                          {car.about}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-ink">
                          ₹{Number(car.price || 0).toLocaleString("en-IN")}
                          <span className="ml-1 text-[10px] font-medium text-ink-soft">
                            / day
                          </span>
                        </p>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="border-b border-line bg-cream py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Reveal>
                <div className="lg:sticky lg:top-24 lg:self-start">
                  <Eyebrow>Customer love</Eyebrow>
                  <h2 className="mt-5 font-display text-4xl font-bold leading-[0.96] tracking-[-0.045em] text-ink sm:text-5xl">
                    Rated 4.8 by
                    <br />
                    three million
                    <br />
                    drivers<span className="text-accent">.</span>
                  </h2>
                  <div className="mt-6 flex items-center gap-2 text-accent">
                    {[0, 1, 2, 3, 4].map((star) => (
                      <i
                        key={star}
                        className="fa-solid fa-star text-[10px]"
                        aria-hidden="true"
                      />
                    ))}
                    <span className="ml-1 font-mono text-[10px] text-ink-soft">
                      4.8 / 5
                    </span>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="border-t border-line lg:col-span-8">
              {TESTIMONIALS.map((testimonial, index) => (
                <Reveal key={testimonial.name} delay={0.06 * index}>
                  <figure className="grid gap-4 border-b border-line py-7 sm:grid-cols-[minmax(0,1fr)_180px] sm:gap-8 sm:py-8">
                    <blockquote className="text-base leading-relaxed text-ink sm:text-lg">
                      <span className="mr-1 font-display text-accent">
                        &ldquo;
                      </span>
                      {testimonial.quote}
                    </blockquote>
                    <figcaption className="sm:text-right">
                      <p className="text-sm font-semibold text-ink">
                        {testimonial.name}
                      </p>
                      <p className="mt-1 text-[11px] leading-relaxed text-ink-soft">
                        {testimonial.meta}
                      </p>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── LOCATIONS ─── */}
      <section className="border-b border-line bg-cream-dark py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <Eyebrow>Find a hub</Eyebrow>
                <h2 className="mt-5 font-display text-4xl font-bold leading-[0.96] tracking-[-0.045em] text-ink sm:text-5xl">
                  Driven from 50+ cities
                  <span className="text-accent">.</span>
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-ink-soft lg:text-right">
                Every hub is stocked, sanitized, and ready. Pick any city, any
                time — the keys are already waiting.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-px border-y border-line bg-line lg:grid-cols-4">
            {POPULAR_CITIES.map((city) => (
              <div key={city.name} className="bg-cream-dark p-5 sm:p-7">
                <p className="font-display text-2xl font-bold tracking-[-0.035em] text-ink sm:text-3xl">
                  {city.name}
                </p>
                <p className="mt-1 text-[11px] text-ink-soft">{city.state}</p>
                <p className="mt-4 text-[10px] leading-relaxed text-ink-soft">
                  {city.hubs} hubs · {city.popular}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="border-b border-line bg-cream py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Reveal>
                <div className="lg:sticky lg:top-24 lg:self-start">
                  <Eyebrow>Got questions?</Eyebrow>
                  <h2 className="mt-5 font-display text-4xl font-bold leading-[0.96] tracking-[-0.045em] text-ink sm:text-5xl">
                    Answers before
                    <br />
                    you drive
                    <span className="text-accent">.</span>
                  </h2>
                  <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-soft">
                    Still unsure about something? The support desk is open
                    around the clock.
                  </p>
                  <Link
                    to="/contact"
                    className="mt-6 inline-flex items-center gap-2 border-b border-ink pb-1 text-xs font-semibold text-ink transition-colors duration-200 hover:border-accent hover:text-accent"
                  >
                    Talk to a human
                    <i
                      className="fa-solid fa-arrow-right text-[9px]"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </Reveal>
            </div>

            <div className="border-t border-line lg:col-span-8">
              {FAQS.map((faq, index) => {
                const isOpen = openFaqIndex === index;

                return (
                  <div key={faq.q} className="border-b border-line">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaqIndex(isOpen ? -1 : index)
                      }
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-6 py-5 text-left"
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="font-mono text-[10px] text-accent">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm font-semibold text-ink sm:text-base">
                          {faq.q}
                        </span>
                      </span>
                      <span
                        className={`relative flex h-5 w-5 shrink-0 items-center justify-center text-ink-soft transition-transform duration-300 ${
                          isOpen ? "rotate-45" : ""
                        }`}
                      >
                        <span className="absolute h-px w-3.5 bg-current" />
                        <span className="absolute h-3.5 w-px bg-current" />
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="answer"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-2xl pb-5 pl-8 pr-8 text-sm leading-relaxed text-ink-soft">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FULL-BLEED CTA ─── */}
      <section className="relative overflow-hidden bg-ink py-20 text-cream sm:py-28">
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          <div className="absolute inset-y-0 left-1/4 w-px bg-cream/10" />
          <div className="absolute inset-y-0 left-1/2 w-px bg-cream/10" />
          <div className="absolute inset-y-0 left-3/4 w-px bg-cream/10" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end lg:gap-20">
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-px w-10 bg-accent" aria-hidden="true" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
                    Ready to take the wheel?
                  </p>
                </div>

                <h2 className="mt-6 font-display text-5xl font-bold leading-[0.9] tracking-[-0.055em] text-cream sm:text-6xl lg:text-7xl">
                  Your next drive
                  <br />
                  starts here<span className="text-accent">.</span>
                </h2>
              </div>

              <div>
                <p className="max-w-md text-sm leading-relaxed text-cream/60">
                  Experience unmatched freedom with India&apos;s cleanest
                  self-drive fleet. Zero security deposit, doorstep delivery,
                  and 24/7 pan-India support.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Button
                    variant="accent"
                    size="lg"
                    onClick={() => handleSearchSubmit()}
                  >
                    Book a car now
                    <i
                      className="fa-solid fa-arrow-right text-[10px]"
                      aria-hidden="true"
                    />
                  </Button>
                  <Link
                    to="/cars"
                    className="inline-flex items-center justify-center gap-2 border border-cream/25 px-6 py-3.5 text-sm font-semibold text-cream transition-colors duration-300 hover:border-cream hover:bg-cream hover:text-ink"
                  >
                    Browse full catalog
                  </Link>
                </div>

                <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-cream/15 pt-4 text-[9px] font-bold uppercase tracking-[0.18em] text-cream/45">
                  <span>₹0 deposit</span>
                  <span className="h-1 w-1 rounded-full bg-accent" />
                  <span>Free rescheduling</span>
                  <span className="h-1 w-1 rounded-full bg-accent" />
                  <span>50+ cities</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── QUICK BOOKING MODAL ─── */}
      <AnimatePresence>
        {selectedBookingCar && (
          <BookingModal
            key={selectedBookingCar._id || selectedBookingCar.id}
            car={selectedBookingCar}
            pickupDate={tripStartDate}
            setPickupDate={setTripStartDate}
            returnDate={tripEndDate}
            setReturnDate={setTripEndDate}
            onClose={() => setSelectedBookingCar(null)}
            onBooking={handleBookingConfirm}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
