import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CarCard from "../../components/CarCard";
import PageHeader from "../../components/ui/PageHeader";
import { getAllCars } from "../../store/features/carSlice";

const Cars = () => {
  const dispatch = useDispatch();
  const { cars, loading, error } = useSelector((state) => state.cars);

  useEffect(() => {
    dispatch(getAllCars());
  }, [dispatch]);

  return (
    <section className="min-h-[80vh] bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <PageHeader
          eyebrow="Our collection"
          title={
            <>
              The fleet<span className="text-accent">.</span>
            </>
          }
          description="Browse available self-drive cars and choose the one that fits your next journey. Every listing is verified, inspected, and ready to go."
          aside={
            <div className="sm:text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-soft">
                In catalog
              </p>
              <p className="mt-1 font-display text-4xl font-bold leading-none tracking-[-0.04em] text-ink">
                {(cars || []).filter((car) => car.status !== false).length}
              </p>
              <p className="mt-1 text-[11px] text-ink-soft">
                available vehicles
              </p>
            </div>
          }
        />

        <div className="pt-10">
          {loading && (
            <div className="flex h-56 items-center justify-center border-b border-line text-sm text-ink-soft">
              <i className="fa-solid fa-circle-notch mr-2 animate-spin text-accent" aria-hidden="true" />
              Loading the fleet…
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="border-l-2 border-red-500 bg-red-500/5 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {!loading && !error && (cars || []).length > 0 && (
            <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {(cars || []).map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          )}

          {!loading && !error && (cars || []).length === 0 && (
            <div className="border-b border-line py-20 text-center">
              <i className="fa-solid fa-car mb-5 text-3xl text-accent" aria-hidden="true" />
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
                No cars available
              </h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
                The fleet is being updated. Check back shortly for new vehicles.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Cars;
