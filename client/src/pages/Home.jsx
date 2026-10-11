import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getAllCars } from "../store/features/carSlice";
import initialCars from "../Data/carsData.json";
import BookingModal from "../components/BookingModal";
import API from "../api/API";

// Curated scenic road trip cards for the Zoomcar fan-out hero collage
const HERO_PANORAMIC_CARDS = [
  {
    id: "card-1",
    title: "Mountain Pass",
    location: "Manali & Spiti",
    angle: "-rotate-[7deg]",
    translateY: "translate-y-4",
    img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80",
    tag: "4x4 Expedition",
  },
  {
    id: "card-2",
    title: "Coastal Drive",
    location: "Goa & Konkan",
    angle: "-rotate-[4deg]",
    translateY: "translate-y-1",
    img: "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=800&auto=format&fit=crop&q=80",
    tag: "Beach Cruiser",
  },
  {
    id: "card-3",
    title: "Valley Escapes",
    location: "Pachmarhi Trails",
    angle: "-rotate-[1deg]",
    translateY: "translate-y-0",
    img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80",
    tag: "Scenic Hills",
  },
  {
    id: "card-4",
    title: "Sunset Tailgate",
    location: "Western Ghats",
    angle: "rotate-0",
    translateY: "-translate-y-2",
    img: "https://images.unsplash.com/photo-1470246973918-29a93221c455?w=800&auto=format&fit=crop&q=80",
    tag: "Group Getaway",
  },
  {
    id: "card-5",
    title: "Expressway Rush",
    location: "Yamuna Corridor",
    angle: "rotate-[2deg]",
    translateY: "translate-y-0",
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80",
    tag: "Performance GT",
  },
  {
    id: "card-6",
    title: "Forest Cabins",
    location: "Coorg Woodlands",
    angle: "rotate-[5deg]",
    translateY: "translate-y-2",
    img: "https://images.unsplash.com/photo-1486496572940-2bb2341fdbdf?w=800&auto=format&fit=crop&q=80",
    tag: "Hill Station",
  },
  {
    id: "card-7",
    title: "Weekend Camp",
    location: "Lonavala Outskirts",
    angle: "rotate-[8deg]",
    translateY: "translate-y-5",
    img: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&auto=format&fit=crop&q=80",
    tag: "Tailgate Camp",
  },
];

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

// FAQ items
const FAQS = [
  {
    q: "What documents do I need to rent a self-drive car?",
    a: "You only need a valid original Driving License (held for at least 1 year) and an Aadhaar card or government ID. Our digital KYC verifies your profile in under 60 seconds with zero physical paperwork.",
  },
  {
    q: "Is there any security deposit required?",
    a: "No! Unlike traditional car rental agencies, Virtuacarz offers ₹0 security deposit on the majority of our fleet through seamless digital pre-authorization. You only pay for your rental time and fuel option.",
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
    a: "Yes! All Virtuacarz vehicles possess All-India Commercial Taxi / Tourist Permits (All India Permits). You can drive across state lines freely; any state border taxes or FASTag tolls are billed at actuals.",
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

  return (
    <div className="min-h-screen bg-[#212121] text-[#ececec] selection:bg-[#3f3f3f] selection:text-white">

      {/* ─── TOP NOTIFICATION / PROMO BAR (OpenAI Monochrome) ─── */}
      <div className="border-b border-[#333333] bg-[#1a1a1a] px-4 py-2 text-center text-xs tracking-wide text-[#b4b4b4]">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
          <span className="inline-flex items-center rounded-full border border-[#444444] bg-[#262626] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#ececec]">
            ✦ VirtuaCarz
          </span>
          <span>
            Self-drive freedom in 50+ cities across India. Zero security deposit • 100% digital unlock.
          </span>
          <button
            onClick={() => handleSearchSubmit()}
            className="ml-1 hidden font-semibold text-[#ffffff] underline underline-offset-4 hover:text-[#b4b4b4] sm:inline"
          >
            Book your ride →
          </button>
        </div>
      </div>

      {/* ─── HERO HEADER SECTION (Zoomcar layout in OpenAI Monochrome) ─── */}
      <section className="relative overflow-hidden pt-10 pb-6 sm:pt-14 sm:pb-8">
        
        {/* Subtle Ambient Radial Glow (OpenAI signature dark ambient) */}
        <div className="pointer-events-none absolute inset-0 -top-24 flex items-center justify-center">
          <div className="h-[480px] w-[800px] rounded-full bg-gradient-to-b from-[#3a3a3a]/25 via-[#292929]/10 to-transparent blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">


          {/* Main Headline */}
          <h1 className="mx-auto max-w-4xl text-3xl font-extrabold tracking-tight text-[#f5f5f5] sm:text-5xl sm:leading-[1.15] lg:text-6xl">
            Self Drive Car Rentals Across India — Easy, Affordable & Flexible
          </h1>

          {/* Zoomcar-Style Social Proof Metrics */}
          <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs sm:text-sm text-[#b4b4b4]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#ececec]">50,00,000+</span>
              <span className="text-[#888888]">Trips Completed</span>
            </div>
            <span className="hidden text-[#444444] sm:inline">•</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#ececec]">30,00,000+</span>
              <span className="text-[#888888]">User Ratings</span>
            </div>
            <span className="hidden text-[#444444] sm:inline">•</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#ececec]">4.8+</span>
              <span className="text-[#888888]">Average Trip Rating</span>
            </div>
            <span className="hidden text-[#444444] sm:inline">•</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#ececec]">₹0</span>
              <span className="text-[#888888]">Security Deposit</span>
            </div>
          </div>

          {/* Subtitle */}
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#a3a3a3] sm:text-base">
            Choose your car, choose your dates, pick up or get it delivered, and drive without a driver.
            Transparent pricing, unlimited kilometer options, and 24/7 roadside assistance.
          </p>

        </div>

        {/* ─── THE ICONIC ZOOMCAR HERO FAN-OUT PANORAMIC CARDS ─── */}
        <div className="relative mt-8 sm:mt-12 overflow-hidden py-4 sm:py-6">
          <div className="no-scrollbar flex items-center justify-center gap-2 overflow-x-auto px-4 sm:gap-3 md:gap-4">
            {HERO_PANORAMIC_CARDS.map((card) => (
              <div
                key={card.id}
                className={`group relative h-48 w-32 shrink-0 sm:h-64 sm:w-44 md:h-72 md:w-52 transition-all duration-300 ease-out hover:z-20 hover:scale-105 hover:rotate-0 ${card.angle} ${card.translateY}`}
              >
                <div className="relative h-full w-full overflow-hidden rounded-2xl border border-[#3f3f3f] bg-[#1a1a1a] shadow-xl transition-all duration-300 group-hover:border-[#ececec]/60 group-hover:shadow-2xl">
                  {/* Photo */}
                  <img
                    src={card.img}
                    alt={card.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Subtle Monochrome Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Card Caption Tag */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left">
                    <span className="inline-block rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-medium text-[#ececec] backdrop-blur-md">
                      {card.tag}
                    </span>
                    <p className="mt-1 truncate text-xs font-semibold text-white">
                      {card.title}
                    </p>
                    <p className="truncate text-[10px] text-[#a3a3a3]">
                      {card.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#212121] to-transparent sm:w-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#212121] to-transparent sm:w-20" />
        </div>

        {/* ─── FLOATING BOOKING & SEARCH CONSOLE (Zoomcar Centerpiece in OpenAI Monochrome) ─── */}
        <div className="relative mx-auto -mt-6 max-w-5xl px-4 sm:-mt-10 sm:px-6 lg:px-8 z-30">
          <div className="overflow-hidden rounded-3xl border border-[#3f3f3f] bg-[#2a2a2a]/95 p-4 shadow-2xl backdrop-blur-xl sm:p-6 md:p-7">

            {/* Top Booking Tabs (Daily, Subscription, Weekday, EV) */}
            <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-[#383838] pb-5">
              
              <button
                type="button"
                onClick={() => setActiveTab("daily")}
                className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition active:scale-95 ${
                  activeTab === "daily"
                    ? "bg-[#ececec] text-[#171717] shadow"
                    : "bg-[#212121] text-[#b4b4b4] hover:bg-[#333333] hover:text-[#ececec]"
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div className="text-left">
                  <span className="block leading-none">Daily Drives</span>
                  <span className="text-[10px] font-normal opacity-80">Short trips, upto 7 days</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("subscription")}
                className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium transition active:scale-95 ${
                  activeTab === "subscription"
                    ? "bg-[#ececec] text-[#171717] shadow"
                    : "bg-[#212121] text-[#b4b4b4] hover:bg-[#333333] hover:text-[#ececec]"
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="text-left">
                  <span className="block leading-none font-semibold">Subscription</span>
                  <span className="text-[10px] font-normal opacity-80">Long duration, 7+ days</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("weekday")}
                className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium transition active:scale-95 ${
                  activeTab === "weekday"
                    ? "bg-[#ececec] text-[#171717] shadow"
                    : "bg-[#212121] text-[#b4b4b4] hover:bg-[#333333] hover:text-[#ececec]"
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div className="text-left">
                  <span className="block leading-none font-semibold">Weekday Pass</span>
                  <span className="text-[10px] font-normal opacity-80">Mon-Fri fixed KM</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("ev")}
                className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium transition active:scale-95 ${
                  activeTab === "ev"
                    ? "bg-[#ececec] text-[#171717] shadow"
                    : "bg-[#212121] text-[#b4b4b4] hover:bg-[#333333] hover:text-[#ececec]"
                }`}
              >
                <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                  New
                </span>
                <div className="text-left">
                  <span className="block leading-none font-semibold">EV & Luxury</span>
                  <span className="text-[10px] font-normal opacity-80">Zero-emission fleet</span>
                </div>
              </button>

            </div>

            {/* Main Interactive Search Grid */}
            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:items-center">

                {/* 1. City Module */}
                <div className="relative lg:col-span-3">
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-[#888888]">
                    City
                  </label>
                  <button
                    type="button"
                    onClick={() => setCityModalOpen(!cityModalOpen)}
                    className="flex w-full items-center justify-between rounded-xl border border-[#3f3f3f] bg-[#212121] px-3.5 py-3 text-left text-sm text-[#ececec] transition hover:border-[#555555] focus:outline-none"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <svg className="h-4 w-4 shrink-0 text-[#b4b4b4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-semibold text-white">{selectedCity}</span>
                    </div>
                    <svg className="h-4 w-4 text-[#888888]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* City Selector Dropdown */}
                  {cityModalOpen && (
                    <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-2xl border border-[#444444] bg-[#1f1f1f] p-3 shadow-2xl">
                      <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#888888]">
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
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition ${
                              selectedCity === c.name
                                ? "bg-[#333333] text-white font-semibold"
                                : "text-[#b4b4b4] hover:bg-[#2a2a2a] hover:text-[#ececec]"
                            }`}
                          >
                            <div>
                              <p className="font-medium text-white">{c.name}</p>
                              <p className="text-[10px] text-[#777777]">{c.popular}</p>
                            </div>
                            <span className="rounded bg-[#171717] px-1.5 py-0.5 text-[10px] text-[#888888]">
                              {c.hubs} hubs
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Pickup Location Hub */}
                <div className="lg:col-span-3">
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-[#888888]">
                    Pickup Location / Hub
                  </label>
                  <div className="flex items-center rounded-xl border border-[#3f3f3f] bg-[#212121] px-3.5 py-2.5 text-sm">
                    <svg className="mr-2.5 h-4 w-4 shrink-0 text-[#b4b4b4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <input
                      type="text"
                      value={pickupSpot}
                      onChange={(e) => setPickupSpot(e.target.value)}
                      placeholder="Airport, Railway Stn, City Hub..."
                      className="w-full bg-transparent text-xs sm:text-sm text-[#ececec] placeholder-[#666666] outline-none"
                    />
                  </div>
                </div>

                {/* 3. Trip Start (Date + Time) */}
                <div className="lg:col-span-2">
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-[#888888]">
                    Trip Start
                  </label>
                  <div className="rounded-xl border border-[#3f3f3f] bg-[#212121] px-3 py-2 text-xs">
                    <input
                      type="date"
                      value={tripStartDate}
                      min={todayDate.toISOString().split("T")[0]}
                      onChange={(e) => setTripStartDate(e.target.value)}
                      className="w-full bg-transparent font-medium text-[#ececec] outline-none"
                    />
                    <div className="mt-0.5 text-[10px] text-[#777777]">
                      {tripStartTime}
                    </div>
                  </div>
                </div>

                {/* 4. Trip End (Date + Time) */}
                <div className="lg:col-span-2">
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-[#888888]">
                    Trip End
                  </label>
                  <div className="rounded-xl border border-[#3f3f3f] bg-[#212121] px-3 py-2 text-xs">
                    <input
                      type="date"
                      value={tripEndDate}
                      min={tripStartDate}
                      onChange={(e) => setTripEndDate(e.target.value)}
                      className="w-full bg-transparent font-medium text-[#ececec] outline-none"
                    />
                    <div className="mt-0.5 text-[10px] text-[#777777]">
                      {tripEndTime}
                    </div>
                  </div>
                </div>

                {/* 5. Search Action Button */}
                <div className="sm:col-span-2 lg:col-span-2 flex flex-col justify-end">
                  <label className="hidden lg:block mb-1 text-[11px] font-semibold uppercase tracking-wider text-transparent">
                    Action
                  </label>
                  <button
                    type="submit"
                    className="flex h-[42px] w-full items-center justify-center gap-2 rounded-xl bg-[#ececec] px-4 font-semibold text-[#171717] transition hover:bg-white active:scale-95 shadow-md"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Search Cars</span>
                  </button>
                </div>

              </div>

              {/* Bottom Options & Perks Bar */}
              <div className="flex flex-col gap-3 border-t border-[#383838] pt-4 sm:flex-row sm:items-center sm:justify-between">
                
                {/* Delivery checkbox */}
                <label className="flex items-center gap-2 text-xs text-[#b4b4b4] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={deliveryToggle}
                    onChange={(e) => setDeliveryToggle(e.target.checked)}
                    className="h-4 w-4 rounded border-[#555555] bg-[#212121] text-white focus:ring-0"
                  />
                  <span>Delivery & Pick-up, available for eligible cars & locations.</span>
                </label>

                {/* Quick Trust Badges */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#888888]">
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#ececec]">✓</span> Zero Deposit
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#ececec]">✓</span> Free Rescheduling
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#ececec]">✓</span> 24/7 Roadside Cover
                  </span>
                </div>

              </div>

            </form>

          </div>
        </div>

      </section>

      {/* ─── POPULAR CARS FLEET SHOWCASE SECTION ("Find Popular Cars in India") ─── */}
      <section id="popular-fleet-section" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        
        {/* Section Header matching Zoomcar */}
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#888888]">
            Available Self-Drive Fleet
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-[#f5f5f5] sm:text-4xl">
            Find Popular Cars in {selectedCity}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#a3a3a3]">
            Choose from available self-drive cars in India based on your location, travel dates, car type and trip requirements.
          </p>
        </div>

        {/* Filter Pills & Controls */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "all", label: "All Fleet" },
              { id: "suv", label: "SUVs & 4x4" },
              { id: "sports", label: "Luxury & Sports" },
              { id: "sedan", label: "Sedans" },
              { id: "electric", label: "Electric (EV)" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition active:scale-95 ${
                  categoryFilter === cat.id
                    ? "bg-[#ececec] text-[#171717]"
                    : "border border-[#3f3f3f] bg-[#292929] text-[#b4b4b4] hover:bg-[#333333] hover:text-[#ececec]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search + Sort */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-44 sm:w-56 rounded-xl border border-[#3f3f3f] bg-[#292929] px-3.5 py-2 text-xs text-[#ececec] placeholder-[#666666] outline-none transition focus:border-[#777777]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-2.5 text-xs text-[#888888] hover:text-white"
                >
                  ×
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-[#3f3f3f] bg-[#292929] px-3 py-2 text-xs text-[#ececec] outline-none transition focus:border-[#777777]"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

        </div>

        {/* Cars Grid */}
        {sortedCars.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedCars.map((car) => (
              <div
                key={car._id || car.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#3f3f3f] bg-[#292929] shadow-lg transition duration-300 hover:-translate-y-1 hover:border-[#5a5a5a] hover:shadow-2xl"
              >
                {/* Image Banner */}
                <div className="relative h-52 w-full overflow-hidden bg-[#171717]">
                  <img
                    src={getImageSrc(car.image)}
                    alt={car.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="rounded-md border border-white/20 bg-black/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                      {car.category || "Sedan"}
                    </span>
                  </div>

                  {/* Fuel Pill */}
                  <div className="absolute top-3 right-3">
                    <span className="rounded-md border border-white/20 bg-black/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#b4b4b4] backdrop-blur-md">
                      {car.fuel || "Petrol"}
                    </span>
                  </div>
                </div>

                {/* Car Details Content */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    {/* Model + Name */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-bold text-[#ececec] group-hover:text-white">
                        {car.name}
                      </h3>
                      <span className="text-xs text-[#888888]">{car.year || "2026"}</span>
                    </div>

                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#a3a3a3]">
                      {car.about}
                    </p>

                    {/* Quick Specs Badges */}
                    <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-[#b4b4b4]">
                      <span className="rounded-md bg-[#212121] px-2 py-1 border border-[#3a3a3a]">
                        👥 {car.seats || "5"} Seats
                      </span>
                      <span className="rounded-md bg-[#212121] px-2 py-1 border border-[#3a3a3a]">
                        ⚙️ {car.transmisson || car.transmission ? "Automatic" : "Manual"}
                      </span>
                      <span className="rounded-md bg-[#212121] px-2 py-1 border border-[#3a3a3a]">
                        ⛽ {car.milage ? `${car.milage} km/l` : "High Mileage"}
                      </span>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="mt-6 border-t border-[#3a3a3a] pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#777777]">
                          Starting from
                        </span>
                        <div className="text-lg font-bold text-[#f5f5f5]">
                          ₹{car.price}
                          <span className="text-xs font-normal text-[#888888]"> / day</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/cars/${car._id || car.id}`}
                          className="rounded-xl border border-[#444444] px-3 py-2 text-xs font-medium text-[#ececec] transition hover:bg-[#383838]"
                        >
                          Details
                        </Link>
                        <button
                          type="button"
                          onClick={() => setSelectedBookingCar(car)}
                          className="rounded-xl bg-[#ececec] px-3.5 py-2 text-xs font-bold text-[#171717] transition hover:bg-white active:scale-95"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-[#3f3f3f] bg-[#292929] p-12 text-center">
            <h3 className="text-xl font-bold text-white">No cars found matching filters</h3>
            <p className="mt-2 text-sm text-[#888888]">
              Try adjusting your search criteria or reset the category.
            </p>
            <button
              onClick={() => {
                setCategoryFilter("all");
                setSearchTerm("");
              }}
              className="mt-4 rounded-xl bg-[#ececec] px-5 py-2.5 text-xs font-bold text-[#171717]"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* View All Cars Link */}
        <div className="mt-12 text-center">
          <Link
            to="/cars"
            className="inline-flex items-center gap-2 rounded-xl border border-[#444444] bg-[#292929] px-6 py-3.5 text-sm font-semibold text-[#ececec] transition hover:border-[#ececec] hover:bg-[#333333]"
          >
            <span>Explore All {allAvailableCars.length} Cars in Fleet</span>
            <span>→</span>
          </Link>
        </div>

      </section>

      {/* ─── WHY CHOOSE VIRTUACARZ / ZOOMCAR-GRADE ADVANTAGES (OpenAI Monochrome) ─── */}
      <section className="border-t border-[#333333] bg-[#1a1a1a] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#888888]">
              Why VirtuaCarz
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-[#f5f5f5] sm:text-4xl">
              The Frictionless Self-Drive Standard
            </h2>
            <p className="mt-3 text-sm text-[#a3a3a3]">
              Engineered for seamless road trips. No hidden surprises, no bureaucratic paperwork.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_US_FEATURES.map((feat, idx) => (
              <div
                key={idx}
                className="group rounded-2xl border border-[#333333] bg-[#212121] p-7 transition duration-300 hover:border-[#555555] hover:bg-[#262626]"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#444444] bg-[#2a2a2a] text-[#ececec] transition group-hover:bg-[#ececec] group-hover:text-[#171717]">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold text-[#ececec]">{feat.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#888888]">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── HOW SELF-DRIVE RENTAL WORKS (4-Step Timeline) ─── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#888888]">
              How It Works
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-[#f5f5f5] sm:text-4xl">
              Four Steps to Hit the Highway
            </h2>
            <p className="mt-3 text-sm text-[#a3a3a3]">
              From booking to ignition in under 2 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
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
            ].map((step, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl border border-[#383838] bg-[#262626] p-6 text-left"
              >
                <div className="text-3xl font-black tracking-tight text-[#444444]">
                  {step.step}
                </div>
                <h3 className="mt-3 text-lg font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#999999]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── POPULAR ROAD TRIP ROUTES ACROSS INDIA ─── */}
      <section className="border-t border-[#333333] bg-[#1a1a1a] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#888888]">
                Curated Itineraries
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[#f5f5f5] sm:text-3xl">
                Popular Self-Drive Escapes
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#888888] max-w-md">
              Unmetered highways, scenic coastal stretches, and misty mountain ghats ready for your next weekend.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                route: "Mumbai ➔ Goa",
                distance: "585 km • NH 66",
                scenery: "Coastal cliffs, coconut groves & Western Ghats",
                recommended: "Toyota Fortuner or Creta",
              },
              {
                route: "Delhi ➔ Rishikesh / Mussoorie",
                distance: "260 km • NH 334",
                scenery: "Ganga riverbanks, foothills & pine winding roads",
                recommended: "Audi Sports SUV or HR-V",
              },
              {
                route: "Bengaluru ➔ Coorg / Ooty",
                distance: "245 km • Mysore Hwy",
                scenery: "Misty tea estates, wildlife corridors & hill hairpins",
                recommended: "Porsche Taycan or Creta",
              },
              {
                route: "Bhopal ➔ Pachmarhi",
                distance: "210 km • MP SH 19",
                scenery: "Satpura forest valleys, waterfalls & heritage temples",
                recommended: "Chevrolet Camaro or Fortuner",
              },
            ].map((route, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[#333333] bg-[#212121] p-5 transition hover:border-[#555555]"
              >
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#777777]">
                  {route.distance}
                </span>
                <h3 className="mt-1 text-base font-bold text-white">{route.route}</h3>
                <p className="mt-2 text-xs text-[#a3a3a3] leading-relaxed">{route.scenery}</p>
                <div className="mt-4 border-t border-[#333333] pt-3 text-[11px] text-[#888888]">
                  <span className="text-[#ececec] font-medium">Best in:</span> {route.recommended}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── CUSTOMER TESTIMONIALS & DRIVER PRAISE ─── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#888888]">
              Customer Love
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-[#f5f5f5] sm:text-4xl">
              Rated 4.8/5 by Over 3 Million Drivers
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                name: "Rohit Sharma",
                city: "Mumbai ➔ Goa Trip",
                quote:
                  "Doorstep delivery at 6:00 AM on the dot. The car was spotless, smells brand new, and the zero deposit made this by far the smoothest car rental I have ever experienced.",
                car: "Hyundai Creta SX(O)",
              },
              {
                name: "Ananya Iyer",
                city: "Bengaluru ➔ Coorg",
                quote:
                  "Rented the Porsche Taycan for our anniversary weekend. Incredible performance, keyless unlock via app worked instantly, and customer care was reachable within 10 seconds.",
                car: "Porsche Taycan",
              },
              {
                name: "Vikram Patel",
                city: "Bhopal ➔ Pachmarhi",
                quote:
                  "Virtuacarz is leagues ahead of traditional rentals. No bargaining, clear fuel policy, and the Fortuner handled the Satpura mountain trails like a dream.",
                car: "Toyota Fortuner 4x4",
              },
            ].map((testi, i) => (
              <div
                key={i}
                className="flex flex-col justify-between rounded-2xl border border-[#383838] bg-[#262626] p-6"
              >
                <div>
                  <div className="flex text-sm text-[#ececec]">
                    ★★★★★
                  </div>
                  <p className="mt-4 text-xs sm:text-sm leading-relaxed text-[#b4b4b4]">
                    "{testi.quote}"
                  </p>
                </div>
                <div className="mt-6 border-t border-[#3a3a3a] pt-4">
                  <p className="text-xs font-bold text-white">{testi.name}</p>
                  <p className="text-[10px] text-[#777777]">{testi.city} • {testi.car}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── FREQUENTLY ASKED QUESTIONS (Interactive Accordion) ─── */}
      <section className="border-t border-[#333333] bg-[#1a1a1a] py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          <div className="mx-auto mb-12 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#888888]">
              Got Questions?
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-[#f5f5f5] sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-[#333333] bg-[#212121] transition hover:border-[#4a4a4a]"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? -1 : idx)}
                  className="flex w-full items-center justify-between px-6 py-4.5 text-left text-sm font-semibold text-[#ececec]"
                >
                  <span>{faq.q}</span>
                  <span className="ml-4 text-lg text-[#888888]">
                    {openFaqIndex === idx ? "−" : "+"}
                  </span>
                </button>
                {openFaqIndex === idx && (
                  <div className="border-t border-[#2e2e2e] px-6 py-4 text-xs sm:text-sm leading-relaxed text-[#a3a3a3]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── BOTTOM CALL TO ACTION BANNER (OpenAI Monochrome) ─── */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-[#444444] bg-gradient-to-b from-[#2a2a2a] to-[#1c1c1c] p-8 text-center sm:p-14 shadow-2xl">
            
            <div className="mx-auto max-w-2xl">
              <span className="rounded-full border border-[#555555] bg-[#333333] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#ececec]">
                Ready to Take the Wheel?
              </span>
              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                Your Self-Drive Journey Starts in 2 Minutes.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#a3a3a3]">
                Experience unmatched freedom with India's cleanest self-drive fleet. Zero security deposit, doorstep delivery, and 24x7 pan-India support.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => handleSearchSubmit()}
                  className="rounded-xl bg-[#ececec] px-7 py-3.5 text-sm font-bold text-[#171717] transition hover:bg-white active:scale-95 shadow-lg"
                >
                  Book a Car Now
                </button>
                <Link
                  to="/cars"
                  className="rounded-xl border border-[#555555] bg-[#222222] px-7 py-3.5 text-sm font-semibold text-[#ececec] transition hover:bg-[#333333]"
                >
                  Browse Full Catalog
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── MODAL FOR QUICK BOOKING DIRECTLY FROM HOME PAGE ─── */}
      {selectedBookingCar && (
        <BookingModal
          car={selectedBookingCar}
          pickupDate={tripStartDate}
          setPickupDate={setTripStartDate}
          returnDate={tripEndDate}
          setReturnDate={setTripEndDate}
          onClose={() => setSelectedBookingCar(null)}
          onBooking={handleBookingConfirm}
        />
      )}

    </div>
  );
};

export default Home;
