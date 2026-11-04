import React, { useEffect } from "react";
import CarCard from "../../components/CarCard";
import { useDispatch, useSelector } from "react-redux";
import { getAllCars } from "../../store/features/carSlice";
import { motion } from "framer-motion";

const Cars = () => {
  const dispatch = useDispatch();
  const { cars, loading, error } = useSelector((state) => state.cars);

  useEffect(() => {
    dispatch(getAllCars());
  }, [dispatch]);

  return (
    <section className="min-h-[80vh] bg-cream px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5 text-[11px] font-bold uppercase tracking-[0.28em] text-accent"
          >
            Our Collection
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl font-bold tracking-[-0.03em] text-ink sm:text-6xl lg:text-7xl"
          >
            Explore the fleet
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg"
          >
            Browse our available vehicles and find the perfect car for your
            next journey. Click on any car to explore specifications and pricing.
          </motion.p>
        </div>

        {/* Divider */}
        <div className="mx-auto mb-14 h-px max-w-6xl bg-line" />

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center mt-10">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-ink" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mx-auto mt-10 max-w-md rounded-md border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Cars Grid */}
        {!loading && !error && (
          <div className="mx-auto grid max-w-6xl grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(cars || []).map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && (cars || []).length === 0 && (
          <div className="mx-auto mt-10 max-w-md rounded-md border border-line bg-white p-8 text-center">
            <h2 className="text-xl font-bold text-ink">
              No cars available
            </h2>
            <p className="mt-2 text-sm text-ink-soft">
              Check back later for new vehicles.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cars;
