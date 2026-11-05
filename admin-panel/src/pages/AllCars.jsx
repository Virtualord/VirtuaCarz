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

  return (
    <Layout title="All Cars">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-ink">
                Fleet Inventory
              </h2>
              <span className="rounded-md bg-cream-dark px-2.5 py-0.5 text-xs font-semibold text-accent border border-line">
                {cars?.length || 0} vehicles
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-soft">
              Manage, review and update all vehicles listed in your rental catalog.
            </p>
          </div>

          <Link
            to="/add-car"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-accent/30 transition-all duration-300 hover:bg-accent-deep"
          >
            <i className="fa-solid fa-plus font-bold"></i>
            <span>Add New Car</span>
          </Link>
        </div>

        {/* Content Section */}
        {loading && (!cars || cars.length === 0) ? (
          <div className="flex h-64 items-center justify-center rounded-md border border-line bg-white">
            <div className="flex flex-col items-center gap-2 text-center">
              <i className="fa-solid fa-circle-notch animate-spin text-2xl text-accent"></i>
              <span className="text-xs text-ink-soft">Loading vehicle fleet...</span>
            </div>
          </div>
        ) : cars && cars.length > 0 ? (
          <div className="overflow-hidden rounded-md border border-line bg-white shadow-[0_16px_40px_-24px_rgba(24,24,27,0.25)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-ink">
                <thead>
                  <tr className="border-b border-line bg-cream">
                    <th scope="col" className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-ink-soft">Vehicle</th>
                    <th scope="col" className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-ink-soft">Category</th>
                    <th scope="col" className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-ink-soft">Fuel</th>
                    <th scope="col" className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-ink-soft">Gear</th>
                    <th scope="col" className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-ink-soft">Seats</th>
                    <th scope="col" className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-ink-soft">Mileage</th>
                    <th scope="col" className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-ink-soft">Price / Day</th>
                    <th scope="col" className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-ink-soft">Status</th>
                    <th scope="col" className="px-4 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-ink-soft">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map((c) => (
                    <tr
                      key={c?._id}
                      className="border-b border-line last:border-b-0 transition-colors hover:bg-cream/60"
                    >
                      {/* Vehicle Image + Info */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-16 shrink-0 overflow-hidden rounded-md border border-line bg-cream-deep flex items-center justify-center">
                            {c?.image ? (
                              <img
                                src={getImageSrc(c.image)}
                                alt={c?.name || 'car'}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <i className="fa-solid fa-car text-xl text-ink-soft"></i>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-ink text-sm leading-tight">
                              {c?.name}
                            </p>
                            <p className="text-xs text-ink-soft mt-0.5">
                              {c?.model} • {c?.year}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5">
                        <span className="inline-block rounded-md bg-cream-dark px-2.5 py-1 text-xs font-medium text-ink border border-line">
                          {c?.category || 'Sedan'}
                        </span>
                      </td>

                      {/* Fuel */}
                      <td className="px-4 py-3.5 text-xs text-ink">
                        <span className="inline-flex items-center gap-1.5">
                          <i className="fa-solid fa-gas-pump text-[10px] text-accent"></i>
                          {c?.fuel}
                        </span>
                      </td>

                      {/* Transmission */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-block rounded-md border px-2 py-0.5 text-xs font-medium ${
                          c?.transmission
                            ? 'border-accent/20 bg-accent/10 text-accent-deep'
                            : 'border-line bg-cream-dark text-ink-soft'
                        }`}>
                          {c?.transmission ? 'Automatic' : 'Manual'}
                        </span>
                      </td>

                      {/* Seats */}
                      <td className="px-4 py-3.5 text-xs text-ink">
                        {c?.seats} seats
                      </td>

                      {/* Mileage */}
                      <td className="px-4 py-3.5 text-xs text-ink">
                        {c?.milage} km/l
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-accent text-sm">
                          ₹{c?.price}
                        </span>
                        <span className="text-[11px] text-ink-soft">/day</span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium border ${
                            c?.status !== false
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                              : 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
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
                      <td className="px-4 py-3.5 text-right">
                        <Link
                          to={`/car-details/${c?._id}`}
                          className="inline-flex items-center gap-1.5 rounded-md bg-cream border border-line px-3 py-1.5 text-xs font-medium text-ink hover:border-ink hover:bg-cream-dark transition-colors duration-200"
                        >
                          <i className="fa-solid fa-pen text-[10px] text-accent"></i>
                          <span>View / Edit</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-line bg-white p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-cream-dark text-accent mb-3">
              <i className="fa-solid fa-car text-2xl"></i>
            </div>
            <h3 className="text-base font-semibold text-ink">No vehicles registered</h3>
            <p className="mt-1 text-sm text-ink-soft max-w-sm mx-auto">
              Your fleet is currently empty. Add your first car to start accepting rentals.
            </p>
            <Link
              to="/add-car"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 text-xs font-bold text-white hover:bg-accent-deep transition-colors"
            >
              <i className="fa-solid fa-plus font-bold"></i>
              <span>Add First Car</span>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AllCars;
