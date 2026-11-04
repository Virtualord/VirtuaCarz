import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { getAllCars } from "../store/features/carSlice";
import initialCars from "../Data/carsData.json";
import BookingModal from "../components/BookingModal";
import Button from "../components/ui/Button";
import Reveal from "../components/ui/Reveal";
import API from "../api/API";

// Curated scenic road trip cards for the editorial hero backdrop
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
  { id: "weekday", label: "Weekday Pass", desc: "Mon-Fri fixed KM" },
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
    a: "No! Unlike traditional car rental agencies, VirtuaCarz offers ₹0 security deposit on the majority of our fleet through seamless digital pre-authorization. You only pay for your rental time and fuel option.",
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
    a: "Yes! All VirtuaCarz vehicles possess All-India Commercial Taxi / Tourist Permits (All India Permits). You can drive across state lines freely; any state border taxes or FASTag tolls are billed at actuals.",
  },
  {
    q: "What happens if the car breaks down or has a flat tyre?",
    a: "Every booking includes 24x7 Pan-India Roadside Assistance (RSA). In case of an emergency, tap 'Roadside Assist' in the app or call our emergency hotline. We dispatch immediate repair or replacement.",
  },
];

// Feature highlights
const WHY_US_FEATURES = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Zero Security Deposit",
    desc: "Keep your money where it belongs. Enjoy zero locked capital with instant digital pre-authorization.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    title: "Doorstep & Hub Delivery",
    desc: "Get your sanitized car handed over at your doorstep, hotel, or directly outside the airport terminal.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: "100% Keyless Digital Unlock",
    desc: "Zero queues and zero paperwork. Unlock and start your vehicle directly via cloud smart access.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Unlimited Kilometers",
    desc: "Drive as far as the road goes. Select our unlimited KM plans with no speed caps or mileage anxiety.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "24/7 Pan-India Assistance",
    desc: "Full roadside coverage, emergency breakdown support, and comprehensive liability insurance.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    title: "Multipoint Sanitized Fleet",
    desc: "Every vehicle is professionally detailed, sterilized, and mechanically inspected before departure.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Doorstep delivery at 6:00 AM on the dot. The car was spotless, smells brand new, and the zero deposit made this by far the smoothest car rental I have ever experienced.",
    name: "Rohit Sharma",
    meta: "Mumbai ➔ Goa Trip • Hyundai Creta SX(O)",
  },
  {
    quote:
      "Rented the Porsche Taycan for our anniversary weekend. Incredible performance, keyless unlock via app worked instantly, and customer care was reachable within 10 seconds.",
    name: "Ananya Iyer",
    meta: "Bengaluru ➔ Coorg • Porsche Taycan",
  },
  {
    quote:
      "VirtuaCarz is leagues ahead of traditional rentals. No bargaining, clear fuel policy, and the Fortuner handled the Satpura mountain trails like a dream.",
    name: "Vikram Patel",
    meta: "Bhopal ➔ Pachmarhi • Toyota Fortuner 4x4",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Select Dates & City",
    desc: "Choose pickup and return dates, select doorstep delivery or a convenient airport hub.",
  },
  {
    step: "02",
    title: "Choose Your Vehicle",
    desc: "Compare fuel types, passenger capacity, transmission, and choose your favorite model.",
  },
  {
    step: "03",
    title: "60-Second Digital KYC",
    desc: "Upload driving license and ID once. Verified instantly without paper documents.",
  },
  {
    step: "04",
    title: "Unlock & Drive",
    desc: "Arrive at the car, tap unlock on your smartphone, turn the key, and embark on your journey.",
  },
];

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cars, loading } = useSelector((state) => state.cars);
  const { user } = useSelector((state) => state.auth);

  // Fallback to local cars data if backend has only 1 car or is offline
  const allAvailableCars = cars && cars.length > 2 ? cars : initialCars;

  // Search state
  const [activeTab, setActiveTab] = useState("daily"); // daily, subscription, weekday, ev
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
  const [tripStartTime, setTripStartTime] = useState("09:00 AM");
  const [tripEndDate, setTripEndDate] = useState(
    returnDateDefault.toISOString().split("T")[0]
  );
  const [tripEndTime, setTripEndTime] = useState("09:00 PM");

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

  // Image resolver
  const getImageSrc = (image) => {
    if (!image) return null;
    if (image.startsWith("http") || image.startsWith("data:")) return image;
    return `data:image/jpeg;base64,${image}`;
  };

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
    return 0; // featured
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

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12, delayChildren: 0.05 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 36 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div className="min-h-screen bg-cream text-ink selection:bg-ink selection:text-cream">

      {/* ─── TOP NOTIFICATION / PROMO BAR ─── */}
      <div className="border-b border-line bg-cream-dark">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs text-ink-soft sm:px-6 lg:px-8">
          <span className="hidden rounded-md border border-line bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink sm:inline-block">
            ✦ VirtuaCarz
          </span>
          <span>
            Self-drive freedom in 50+ cities across India. Zero security deposit • 100% digital unlock.
          </span>
          <button
            type="button"
            onClick={() => handleSearchSubmit()}
            className="ml-1 hidden font-semibold text-ink underline underline-offset-4 hover:text-accent sm:inline"
          >
            Book your ride →
          </button>
        </div>
      </div>

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 lg:px-8"
        >
          <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-8">

            {/* Editorial headline */}
            <motion.div variants={item} className="lg:col-span-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
                ✦ Self-Drive, Redefined
              </p>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 text-[46px] font-bold leading-[0.96] tracking-[-0.035em] text-ink sm:text-[74px] lg:text-[102px]"
              >
                The road is{" "}
                <span className="text-accent italic">yours.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="mt-7 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg"
              >
                An affordable, sanitized fleet of self-drive cars across India.
                Transparent pricing, zero security deposit, and the open road
                ahead of you.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="mt-9 flex flex-wrap items-center gap-4"
              >
                <Button variant="accent" size="lg" onClick={() => handleSearchSubmit()}>
                  Book your car
                </Button>

                <Link
                  to="/cars"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-ink transition-colors duration-200 hover:text-accent"
                >
                  Explore the fleet
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </motion.div>

              {/* Social proof */}
              <motion.dl
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.55 }}
                className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6"
              >
                {[
                  { value: "50,00,000+", label: "Trips Completed" },
                  { value: "30,00,000+", label: "User Ratings" },
                  { value: "4.8 / 5", label: "Avg Trip Rating" },
                  { value: "₹0", label: "Security Deposit" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <dt className="order-2 text-[11px] font-medium uppercase tracking-wider text-ink-soft">
                      {stat.label}
                    </dt>
                    <dd className="order-1 font-bold tracking-tight text-ink">{stat.value}</dd>
                  </div>
                ))}
              </motion.dl>
            </motion.div>

            {/* Editorial hero imagery */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative lg:col-span-7"
            >
              <div className="relative overflow-hidden rounded-md border border-line bg-cream-deep">
                <img
                  src={HERO_IMAGE}
                  alt="Premium sports car ready for the open road"
                  className="aspect-[4/4.6] w-full object-cover md:aspect-[16/11]"
                />
              </div>

              {/* Offset caption strip — editorial framing */}
              <div className="mt-5 flex items-center justify-between border-b border-line pb-4 text-xs text-ink-soft">
                <span className="font-semibold uppercase tracking-[0.2em] text-ink">The Collection</span>
                <span className="italic">Est. 2026 · Pan-India</span>
              </div>
            </motion.div>

          </div>
        </motion.div>

        {/* ─── FLOATING BOOKING & SEARCH CONSOLE ─── */}
        <div className="relative z-30 mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-md border border-line bg-white p-5 shadow-[0_24px_60px_-32px_rgba(24,24,27,0.25)] sm:p-7"
          >
            {/* Top Booking Tabs */}
            <div className="mb-6 flex flex-wrap gap-2">
              {BOOKING_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 rounded-md px-4 py-2.5 text-xs font-semibold transition-all duration-300 sm:text-sm ${
                    activeTab === tab.id
                      ? "bg-ink text-cream"
                      : "bg-cream-dark text-ink-soft hover:bg-cream-deep hover:text-ink"
                  }`}
                >
                  <div className="text-left">
                    <span className="flex items-center gap-2 leading-none">
                      {tab.label}
                      {tab.badge && (
                        <span className="rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                          New
                        </span>
                      )}
                    </span>
                    <span className="mt-1 block text-[10px] font-normal opacity-70">{tab.desc}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Main Interactive Search Grid */}
            <form onSubmit={handleSearchSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12 lg:items-end">
                {/* 1. City Module */}
                <div className="relative lg:col-span-3">
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                    City
                  </label>
                  <button
                    type="button"
                    onClick={() => setCityModalOpen(!cityModalOpen)}
                    className="flex w-full items-center justify-between rounded-md border border-line bg-cream px-3.5 py-3 text-left text-sm text-ink transition-colors duration-200 hover:border-ink focus:outline-none"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <svg className="h-4 w-4 shrink-0 text-ink-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-semibold text-ink">{selectedCity}</span>
                    </div>
                    <svg className="h-4 w-4 text-ink-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* City Selector Dropdown */}
                  {cityModalOpen && (
                    <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-md border border-line bg-white p-3 shadow-[0_20px_50px_-20px_rgba(24,24,27,0.35)]">
                      <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                        Select Rental City
                      </div>
                      <div className="max-h-60 space-y-1 overflow-y-auto">
                        {POPULAR_CITIES.map((c) => (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => {
                              setSelectedCity(c.name);
                              setPickupSpot(`${c.popular}, ${c.name}`);
                              setCityModalOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs transition-colors duration-200 ${
                              selectedCity === c.name
                                ? "bg-cream-dark font-semibold text-ink"
                                : "text-ink-soft hover:bg-cream hover:text-ink"
                            }`}
                          >
                            <div>
                              <p className="font-medium text-ink">{c.name}</p>
                              <p className="text-[10px] text-ink-soft">{c.popular}</p>
                            </div>
                            <span className="rounded bg-cream-dark px-1.5 py-0.5 text-[10px] font-medium text-ink-soft">
                              {c.hubs} hubs
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Pickup Location Hub */}
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                    Pickup Location / Hub
                  </label>
                  <div className="flex items-center rounded-md border border-line bg-cream px-3.5 py-2.5 text-sm">
                    <svg className="mr-2.5 h-4 w-4 shrink-0 text-ink-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <input
                      type="text"
                      value={pickupSpot}
                      onChange={(e) => setPickupSpot(e.target.value)}
                      placeholder="Airport, Railway Stn, City Hub..."
                      className="w-full bg-transparent text-sm text-ink placeholder-ink-soft outline-none"
                    />
                  </div>
                </div>

                {/* 3. Trip Start (Date + Time) */}
                <div className="lg:col-span-2">
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                    Trip Start
                  </label>
                  <div className="rounded-md border border-line bg-cream px-3 py-2 text-sm">
                    <input
                      type="date"
                      value={tripStartDate}
                      min={todayDate.toISOString().split("T")[0]}
                      onChange={(e) => setTripStartDate(e.target.value)}
                      className="w-full bg-transparent font-semibold text-ink outline-none"
                    />
                    <div className="mt-0.5 text-[10px] text-ink-soft">{tripStartTime}</div>
                  </div>
                </div>

                {/* 4. Trip End (Date + Time) */}
                <div className="lg:col-span-2">
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                    Trip End
                  </label>
                  <div className="rounded-md border border-line bg-cream px-3 py-2 text-sm">
                    <input
                      type="date"
                      value={tripEndDate}
                      min={tripStartDate}
                      onChange={(e) => setTripEndDate(e.target.value)}
                      className="w-full bg-transparent font-semibold text-ink outline-none"
                    />
                    <div className="mt-0.5 text-[10px] text-ink-soft">{tripEndTime}</div>
                  </div>
                </div>

                {/* 5. Search Action Button */}
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="mb-2 hidden text-[11px] font-bold uppercase tracking-wider text-transparent lg:block">
                    Action
                  </label>
                  <button
                    type="submit"
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-accent px-4 font-semibold text-white transition-all duration-300 hover:bg-accent-deep hover:shadow-[0_12px_28px_-12px_rgba(250,82,15,0.6)] active:scale-[0.98] sm:h-11"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Search Cars</span>
                  </button>
                </div>
              </div>

              {/* Bottom Options & Perks Bar */}
              <div className="flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex cursor-pointer items-start gap-2.5 text-xs text-ink-soft">
                  <input
                    type="checkbox"
                    checked={deliveryToggle}
                    onChange={(e) => setDeliveryToggle(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded-sm border-line bg-white text-ink focus:ring-0"
                  />
                  <span>Delivery & Pick-up, available for eligible cars & locations.</span>
                </label>

                <div className="flex flex-wrap items-center gap-4 text-xs text-ink-soft">
                  <span className="flex items-center gap-1.5">
                    <span className="font-bold text-ink">✓</span> Zero Deposit
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="font-bold text-ink">✓</span> Free Rescheduling
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="font-bold text-ink">✓</span> 24/7 Roadside Cover
                  </span>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ─── WHY CHOOSE US ─── */}
      <section className="border-t border-line bg-cream-dark py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Reveal>
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
                  Why VirtuaCarz
                </p>
                <h2 className="mt-5 text-4xl font-bold tracking-[-0.02em] text-ink sm:text-5xl lg:text-6xl">
                  The frictionless
                <br />
                self-drive standard
                </h2>
                <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft">
                  Engineered for seamless road trips. No hidden surprises, no
                  bureaucratic paperwork — just you, the wheel, and the open road.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-8">
              <div>
                {WHY_US_FEATURES.map((feat, idx) => (
                  <Reveal key={feat.title} delay={0.05 * (idx % 2)}>
                    <div className="group grid gap-4 border-t border-line py-7 md:grid-cols-12 md:items-center">
                      <div className="md:col-span-1">
                        <span className="text-[64px] font-bold tracking-tight text-[rgba(24,24,27,0.07)] transition-colors duration-300 group-hover:text-[rgba(250,82,15,0.4)]">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <div className="md:col-span-2">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-line bg-white text-ink transition-colors duration-300 group-hover:border-ink">
                          {feat.icon}
                        </div>
                      </div>

                      <div className="md:col-span-9">
                        <h3 className="text-xl font-bold tracking-tight text-ink transition-colors duration-300 group-hover:text-accent">
                          {feat.title}
                        </h3>
                        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
                          {feat.desc}
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
      <section id="how-it-works" className="bg-cream py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
                How It Works
              </p>
              <h2 className="mt-5 text-4xl font-bold tracking-[-0.02em] text-ink sm:text-5xl">
                Four steps to hit the highway
              </h2>
            </Reveal>
          </div>

          <div className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {STEPS.map((step, idx) => (
              <Reveal key={step.step} delay={0.1 * idx}>
                <div className="relative border-t border-line pt-8">
                  <span className="text-7xl font-bold tracking-tight text-ink/6">
                    {step.step}
                  </span>
                  <h3 className="mt-6 text-xl font-bold tracking-tight text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FLEET SHOWCASE ─── */}
      <section id="popular-fleet-section" className="bg-cream-dark py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <Reveal>
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
                  Available Self-Drive Fleet
                </p>
                <h2 className="mt-5 text-4xl font-bold tracking-[-0.02em] text-ink sm:text-5xl">
                  Find your car in {selectedCity}
                </h2>
              </Reveal>
            </div>

            <Reveal delay={0.15}>
              <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
                Choose from available self-drive cars based on your location,
                travel dates, car type and trip requirements.
              </p>
            </Reveal>
          </div>

          {/* Filters */}
          <div className="mt-12 flex flex-col gap-5 border-b border-line pb-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All Fleet" },
                { id: "suv", label: "SUVs & 4x4" },
                { id: "sports", label: "Luxury & Sports" },
                { id: "sedan", label: "Sedans" },
                { id: "electric", label: "Electric (EV)" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`rounded-md px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                    categoryFilter === cat.id
                      ? "bg-ink text-cream"
                      : "border border-line bg-white text-ink-soft hover:border-ink hover:text-ink"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-44 rounded-md border border-line bg-white px-3.5 py-2 text-xs text-ink placeholder-ink-soft outline-none transition-colors duration-200 focus:border-ink sm:w-56"
              />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-md border border-line bg-white px-3 py-2 text-xs font-medium text-ink outline-none transition-colors duration-200 focus:border-ink"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Editorial fleet list */}
          {sortedCars.length > 0 ? (
            <div className="mt-10 divide-y divide-line border-b border-line">
              {sortedCars.map((car, idx) => (
                <motion.div
                  key={car._id || car.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.7, delay: 0.05 * (idx % 4), ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="group grid overflow-hidden bg-white md:grid-cols-12">
                    {/* Editorial image arrangement */}
                    <Link
                      to={`/cars/${car._id || car.id}`}
                      className="relative block h-72 overflow-hidden bg-cream-deep md:col-span-5"
                    >
                      <img
                        src={getImageSrc(car.image)}
                        alt={car.name}
                        className="h-full w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
                        loading="lazy"
                      />
                    </Link>

                    <div className="p-6 md:col-span-7 md:p-10">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-md bg-cream-dark px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">
                          {car.category || "Sedan"}
                        </span>
                        <span className="text-xs font-medium text-ink-soft">
                          {car.fuel || "Petrol"} · {car.year || "2026"}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${car.status === false ? "text-accent" : "text-ink"}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${car.status === false ? "bg-accent" : "bg-emerald-600"}`} />
                          {car.status === false ? "Booked out" : "Available"}
                        </span>
                      </div>

                      <h3 className="mt-4 text-2xl font-bold tracking-tight text-ink transition-colors duration-300 group-hover:text-accent sm:text-3xl">
                        {car.name}
                      </h3>

                      <p className="mt-2 line-clamp-2 max-w-xl text-sm leading-relaxed text-ink-soft">
                        {car.about}
                      </p>

                      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-ink-soft">
                        <span>{car.seats || "5"} Seats</span>
                        <span>{car.transmisson || car.transmission ? "Automatic" : "Manual Transmission"}</span>
                        <span>{car.milage ? `${car.milage} km/l` : "High Mileage"}</span>
                      </div>

                      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
                            Starting from
                          </p>
                          <p className="text-2xl font-bold tracking-tight text-ink">
                            ₹{car.price}
                            <span className="ml-1 text-sm font-medium text-ink-soft">/ day</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <Link
                            to={`/cars/${car._id || car.id}`}
                            className="rounded-md border border-line px-4 py-2.5 text-xs font-semibold text-ink transition-all duration-300 hover:border-ink hover:bg-cream"
                          >
                            Details
                          </Link>
                          <button
                            type="button"
                            onClick={() => setSelectedBookingCar(car)}
                            className="rounded-md bg-ink px-5 py-2.5 text-xs font-bold text-cream transition-all duration-300 hover:bg-accent hover:shadow-[0_10px_24px_-10px_rgba(250,82,15,0.6)]"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-md border border-line bg-white p-12 text-center">
              <h3 className="text-xl font-bold text-ink">No cars found matching filters</h3>
              <p className="mt-2 text-sm text-ink-soft">
                Try adjusting your search criteria or reset the category.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCategoryFilter("all");
                  setSearchTerm("");
                }}
                className="mt-6 rounded-md bg-ink px-5 py-2.5 text-xs font-bold text-cream transition-colors duration-200 hover:bg-accent"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* View All Cars Link */}
          <div className="mt-12 text-center">
            <Link
              to="/cars"
              className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-6 py-3.5 text-sm font-semibold text-ink transition-all duration-300 hover:border-ink hover:bg-ink hover:text-cream"
            >
              <span>Explore All {allAvailableCars.length} Cars in Fleet</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FEATURED VEHICLES ─── */}
      <section className="bg-cream py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <Reveal>
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
                  This Season&apos;s Selection
                </p>
                <h2 className="mt-5 text-4xl font-bold tracking-[-0.02em] text-ink sm:text-5xl">
                  Featured vehicles from the fleet
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.15}>
              <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
                Handpicked machines our team drives hardest — the ones our
                customers rebook most.
              </p>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredCars.map((car, idx) => (
              <Reveal key={car._id || car.id} delay={0.1 * idx}>
                <Link
                  to={`/cars/${car._id || car.id}`}
                  className="group block bg-white"
                >
                  <div className="relative h-72 overflow-hidden bg-cream-deep">
                    <img
                      src={getImageSrc(car.image)}
                      alt={car.name}
                      className="h-full w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold tracking-tight text-ink transition-colors duration-300 group-hover:text-accent">
                        {car.name}
                      </h3>
                      <span className="text-sm font-bold text-ink">
                        ₹{car.price}
                        <span className="ml-1 text-xs font-medium text-ink-soft">/ day</span>
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-ink-soft">
                      {car.about}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="bg-cream-dark py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
                Customer Love
              </p>
              <h2 className="mt-5 text-4xl font-bold tracking-[-0.02em] text-ink sm:text-5xl">
                Rated 4.8 by over 3 million drivers
              </h2>
            </Reveal>
          </div>

          <div className="mt-16 divide-y divide-line border-b border-line">
            {TESTIMONIALS.map((testi, i) => (
              <Reveal key={testi.name} delay={0.08}>
                <figure className="grid gap-6 py-10 md:grid-cols-12 md:items-start">
                  <span className="font-bold leading-none text-accent text-6xl">&ldquo;</span>
                  <blockquote className="md:col-span-9">
                    <div className="flex text-sm text-accent">
                      ★★★★★
                    </div>
                    <p className="mt-5 text-lg leading-relaxed text-ink sm:text-xl">
                      &ldquo;{testi.quote}&rdquo;
                    </p>
                  </blockquote>
                  <figcaption className="md:col-span-3 md:text-right">
                    <p className="font-bold text-ink">{testi.name}</p>
                    <p className="mt-1 text-xs text-ink-soft">{testi.meta}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LOCATIONS ─── */}
      <section className="bg-cream py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <Reveal>
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
                  Find a Hub
                </p>
                <h2 className="mt-5 text-4xl font-bold tracking-[-0.02em] text-ink sm:text-5xl">
                  Driven from 50+ cities
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.15}>
              <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
                Every hub is stocked, sanitized and ready. Pick any city, any
                time — the keys are already waiting.
              </p>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-0 border-t border-line sm:grid-cols-2 lg:grid-cols-4">
            {POPULAR_CITIES.map((city, i) => (
              <Reveal key={city.name} delay={0.06}>
                <div className={`py-8 pr-8 ${i > 0 ? "border-l border-line lg:pl-8" : ""}`}>
                  <p className="text-4xl font-bold tracking-tight text-ink">{city.name}</p>
                  <p className="mt-1 text-sm text-ink-soft">{city.state}</p>
                  <p className="mt-4 text-xs text-ink-soft">
                    {city.hubs} hubs · {city.popular}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="bg-cream-dark py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
                Got Questions?
              </p>
              <h2 className="mt-5 text-4xl font-bold tracking-[-0.02em] text-ink sm:text-5xl">
                Frequently asked questions
              </h2>
            </Reveal>
          </div>

          <div className="mt-14 space-y-0">
            {FAQS.map((faq, idx) => (
              <Reveal key={idx} delay={0.05}>
                <div className="border-b border-line last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? -1 : idx)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="text-base font-semibold text-ink sm:text-lg">{faq.q}</span>
                    <span className="text-2xl font-normal text-ink-soft transition-transform duration-300">
                      {openFaqIndex === idx ? "−" : "+"}
                    </span>
                  </button>
                  {openFaqIndex === idx && (
                    <p className="pb-6 pr-10 text-sm leading-relaxed text-ink-soft">
                      {faq.a}
                    </p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="bg-cream py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-md border border-line bg-ink px-8 py-16 text-center sm:px-14">
              {/* Subtle editorial texture */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(250,82,15,0.25),transparent_60%)]" />

              <div className="relative mx-auto max-w-2xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-cream/60">
                  Ready to Take the Wheel?
                </p>
                <h2 className="mt-6 text-4xl font-bold tracking-[-0.02em] text-cream sm:text-5xl">
                  Your self-drive journey starts in two minutes.
                </h2>
                <p className="mt-5 text-sm leading-relaxed text-cream/70">
                  Experience unmatched freedom with India&apos;s cleanest self-drive
                  fleet. Zero security deposit, doorstep delivery, and 24x7 pan-India support.
                </p>

                <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button variant="accent" size="lg" onClick={() => handleSearchSubmit()}>
                    Book a Car Now
                  </Button>
                  <Link
                    to="/cars"
                    className="inline-flex items-center justify-center rounded-md border border-cream/30 px-7 py-4 text-sm font-semibold text-cream transition-colors duration-300 hover:border-cream hover:bg-white/5"
                  >
                    Browse Full Catalog
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── MODAL FOR QUICK BOOKING DIRECTLY FROM HOME PAGE ─── */}
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
