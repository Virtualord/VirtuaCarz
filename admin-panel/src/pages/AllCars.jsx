import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCars } from '../store/carSlice';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const AllCars = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCars());
  }, [dispatch]);

  const { cars, loading } = useSelector((state) => state.cars);

  const getImageSrc = (image) => {
    if (!image) return null;
    if (image.startsWith('data:')) return image;
    return `data:image/jpeg;base64,${image}`;
  };

  const vehicleCount = cars?.length || 0;

  return (
    <Layout title="All Cars">
      <div className="mx-auto max-w-7xl">
        {/* Editorial header */}
        <div className="border-b border-line pb-8">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-accent" />
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">
                  Fleet
                </p>
              </div>

              <h2 className="mt-5 font-display text-4xl font-bold tracking-[-0.045em] text-ink sm:text-5xl lg:text-6xl">
                Fleet inventory<span className="text-accent">.</span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">
                Manage, review and update every vehicle listed in your rental
                catalog.
              </p>
            </div>

            <div className="flex flex-row items-end justify-between gap-8 sm:flex-col sm:items-end sm:gap-4">
              <div className="sm:text-right">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-soft">
                  In catalog
                </p>
                <p className="mt-1 font-display text-4xl font-bold leading-none tracking-[-0.04em] text-ink">
                  {vehicleCount}
                </p>
              </div>

              <Link
                to="/add-car"
                className="inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-md bg-accent px-5 py-3 text-xs font-bold text-white shadow-[0_16px_32px_-18px_rgba(250,82,15,0.8)] transition-all duration-300 ease-editorial hover:bg-accent-deep active:scale-[0.99]"
              >
                <i className="fa-solid fa-plus text-[10px]" />
                <span>Add vehicle</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading && (!cars || cars.length === 0) ? (
          <div className="flex h-64 items-center justify-center border-b border-line">
            <div className="flex flex-col items-center gap-3 text-center">
              <i className="fa-solid fa-circle-notch animate-spin text-2xl text-accent"></i>
              <span className="text-xs text-ink-soft">Loading vehicle fleet…</span>
            </div>
          </div>
        ) : cars && cars.length > 0 ? (
          <div className="border-b border-line">
            {/* Mobile / tablet list */}
            <div className="divide-y divide-line lg:hidden">
              {cars.map((c) => (
                <Link
                  key={c?._id}
                  to={`/car-details/${c?._id}`}
                  className="group flex gap-4 py-5"
                >
                  <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-line bg-cream-deep">
                    {c?.image ? (
                      <img
                        src={getImageSrc(c.image)}
                        alt={c?.name || 'car'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <i className="fa-solid fa-car text-lg text-ink-soft"></i>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-display text-base font-semibold tracking-tight text-ink">
                          {c?.name}
                        </p>
                        <p className="mt-0.5 text-xs text-ink-soft">
                          {c?.model} · {c?.year} · {c?.category || 'Sedan'}
                        </p>
                      </div>
                      <span
                        className={`mt-1 inline-flex shrink-0 items-center gap-1.5 text-[10px] font-medium ${
                          c?.status !== false ? 'text-emerald-700' : 'text-ink-soft'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            c?.status !== false ? 'bg-emerald-500' : 'bg-zinc-400'
                          }`}
                        />
                        {c?.status !== false ? 'Available' : 'Unavailable'}
                      </span>
                    </div>

                    <div className="mt-3 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-accent">
                          ₹{c?.price}
                          <span className="text-[11px] font-normal text-ink-soft"> /day</span>
                        </p>
                        <p className="mt-0.5 text-[10px] text-ink-soft">
                          {c?.fuel} · {c?.transmission ? 'Automatic' : 'Manual'} · {c?.seats} seats
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink transition-colors group-hover:text-accent">
                        View
                        <i className="fa-solid fa-arrow-right text-[9px] text-ink-soft transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent"></i>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[880px] text-left text-sm text-ink">
                <thead>
                  <tr className="border-b border-line">
                    <th scope="col" className="px-3 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft first:pl-0 last:pr-0">
                      Vehicle
                    </th>
                    <th scope="col" className="px-3 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft first:pl-0 last:pr-0">
                      Category
                    </th>
                    <th scope="col" className="px-3 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft first:pl-0 last:pr-0">
                      Fuel
                    </th>
                    <th scope="col" className="px-3 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft first:pl-0 last:pr-0">
                      Gear
                    </th>
                    <th scope="col" className="px-3 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft first:pl-0 last:pr-0">
                      Seats
                    </th>
                    <th scope="col" className="px-3 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft first:pl-0 last:pr-0">
                      Mileage
                    </th>
                    <th scope="col" className="px-3 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft first:pl-0 last:pr-0">
                      Price / Day
                    </th>
                    <th scope="col" className="px-3 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft first:pl-0 last:pr-0">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-4 text-right text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft first:pl-0 last:pr-0">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map((c) => (
                    <tr
                      key={c?._id}
                      className="border-b border-line transition-colors duration-200 last:border-b-0 hover:bg-cream-dark/40"
                    >
                      {/* Vehicle */}
                      <td className="px-3 py-4 first:pl-0 last:pr-0">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-16 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-line bg-cream-deep">
                            {c?.image ? (
                              <img
                                src={getImageSrc(c.image)}
                                alt={c?.name || 'car'}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <i className="fa-solid fa-car text-lg text-ink-soft"></i>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold leading-tight text-ink">
                              {c?.name}
                            </p>
                            <p className="mt-0.5 text-xs text-ink-soft">
                              {c?.model} · {c?.year}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-3 py-4 text-xs text-ink-soft first:pl-0 last:pr-0">
                        {c?.category || 'Sedan'}
                      </td>

                      {/* Fuel */}
                      <td className="px-3 py-4 text-xs text-ink first:pl-0 last:pr-0">
                        <span className="inline-flex items-center gap-1.5">
                          <i className="fa-solid fa-gas-pump text-[10px] text-accent"></i>
                          {c?.fuel}
                        </span>
                      </td>

                      {/* Transmission */}
                      <td className="px-3 py-4 text-xs text-ink first:pl-0 last:pr-0">
                        {c?.transmission ? 'Automatic' : 'Manual'}
                      </td>

                      {/* Seats */}
                      <td className="px-3 py-4 text-xs text-ink first:pl-0 last:pr-0">
                        {c?.seats}
                      </td>

                      {/* Mileage */}
                      <td className="px-3 py-4 text-xs text-ink first:pl-0 last:pr-0">
                        {c?.milage} km/l
                      </td>

                      {/* Price */}
                      <td className="px-3 py-4 first:pl-0 last:pr-0">
                        <span className="text-sm font-semibold text-accent">
                          ₹{c?.price}
                        </span>
                        <span className="text-[11px] text-ink-soft"> /day</span>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-4 first:pl-0 last:pr-0">
                        <span
                          className={`inline-flex items-center gap-2 text-[11px] font-medium ${
                            c?.status !== false
                              ? 'text-emerald-700'
                              : 'text-ink-soft'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              c?.status !== false ? 'bg-emerald-500' : 'bg-zinc-400'
                            }`}
                          ></span>
                          {c?.status !== false ? 'Available' : 'Unavailable'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-4 text-right first:pl-0 last:pr-0">
                        <Link
                          to={`/car-details/${c?._id}`}
                          className="group inline-flex items-center gap-2 text-xs font-semibold text-ink transition-colors duration-200 hover:text-accent"
                        >
                          <span>View</span>
                          <i className="fa-solid fa-arrow-right text-[9px] text-ink-soft transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent"></i>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="border-b border-line py-20 text-center">
            <i className="fa-solid fa-car mb-5 text-3xl text-accent"></i>
            <h3 className="font-display text-2xl font-bold tracking-tight text-ink">
              No vehicles registered
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
              Your fleet is currently empty. Add your first car to start
              accepting rentals.
            </p>
            <Link
              to="/add-car"
              className="mt-6 inline-flex items-center justify-center gap-2.5 rounded-md bg-accent px-5 py-3 text-xs font-bold text-white transition-colors duration-200 hover:bg-accent-deep"
            >
              <i className="fa-solid fa-plus text-[10px]" />
              <span>Add first car</span>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AllCars;
