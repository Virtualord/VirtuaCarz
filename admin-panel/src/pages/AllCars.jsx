import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCars } from '../store/carSlice';
import { Link } from 'react-router-dom';

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
              <h2 className="text-xl font-bold tracking-tight text-[#f5f5f5]">
                Fleet Inventory
              </h2>
              <span className="rounded-full bg-[#2a2a2a] px-2.5 py-0.5 text-xs font-semibold text-amber-400 border border-[#383838]">
                {cars?.length || 0} vehicles
              </span>
            </div>
            <p className="mt-1 text-xs text-[#8c8c8c]">
              Manage, review and update all vehicles listed in your rental catalog.
            </p>
          </div>

          <Link
            to="/add-car"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-2.5 text-xs font-semibold text-black shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-300 transition w-fit"
          >
            <i className="fa-solid fa-plus font-bold"></i>
            <span>Add New Car</span>
          </Link>
        </div>

        {/* Content Section */}
        {loading && (!cars || cars.length === 0) ? (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a]">
            <div className="flex flex-col items-center gap-2 text-center">
              <i className="fa-solid fa-circle-notch animate-spin text-2xl text-amber-400"></i>
              <span className="text-xs text-[#888888]">Loading vehicle fleet...</span>
            </div>
          </div>
        ) : cars && cars.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#d4d4d4]">
                <thead className="border-b border-[#2a2a2a] bg-[#202020] text-[11px] font-semibold uppercase tracking-wider text-[#888888]">
                  <tr>
                    <th scope="col" className="px-4 py-3.5">Vehicle</th>
                    <th scope="col" className="px-4 py-3.5">Category</th>
                    <th scope="col" className="px-4 py-3.5">Fuel</th>
                    <th scope="col" className="px-4 py-3.5">Gear</th>
                    <th scope="col" className="px-4 py-3.5">Seats</th>
                    <th scope="col" className="px-4 py-3.5">Mileage</th>
                    <th scope="col" className="px-4 py-3.5">Price / Day</th>
                    <th scope="col" className="px-4 py-3.5">Status</th>
                    <th scope="col" className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626]">
                  {cars.map((c) => (
                    <tr
                      key={c?._id}
                      className="transition-colors hover:bg-[#222222]/70"
                    >
                      {/* Vehicle Image + Info */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-[#333333] bg-[#121212] flex items-center justify-center">
                            {c?.image ? (
                              <img
                                src={getImageSrc(c.image)}
                                alt={c?.name || 'car'}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <i className="fa-solid fa-car text-xl text-[#555555]"></i>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-[#f5f5f5] text-sm leading-tight">
                              {c?.name}
                            </p>
                            <p className="text-xs text-[#808080] mt-0.5">
                              {c?.model} • {c?.year}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5">
                        <span className="inline-block rounded-md bg-[#252525] px-2.5 py-1 text-xs font-medium text-[#cccccc] border border-[#333333]">
                          {c?.category || 'Sedan'}
                        </span>
                      </td>

                      {/* Fuel */}
                      <td className="px-4 py-3.5 text-xs text-[#d0d0d0]">
                        <span className="inline-flex items-center gap-1.5">
                          <i className="fa-solid fa-gas-pump text-[10px] text-amber-400"></i>
                          {c?.fuel}
                        </span>
                      </td>

                      {/* Transmission */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-medium ${
                          c?.transmission
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {c?.transmission ? 'Automatic' : 'Manual'}
                        </span>
                      </td>

                      {/* Seats */}
                      <td className="px-4 py-3.5 text-xs text-[#d0d0d0]">
                        {c?.seats} seats
                      </td>

                      {/* Mileage */}
                      <td className="px-4 py-3.5 text-xs text-[#d0d0d0]">
                        {c?.milage} km/l
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-amber-400 text-sm">
                          ₹{c?.price}
                        </span>
                        <span className="text-[11px] text-[#777777]">/day</span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium border ${
                            c?.status !== false
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              c?.status !== false ? 'bg-emerald-400' : 'bg-zinc-400'
                            }`}
                          ></span>
                          {c?.status !== false ? 'Available' : 'Unavailable'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <Link
                          to={`/car-details/${c?._id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#282828] hover:bg-[#333333] px-3 py-1.5 text-xs font-medium text-[#f5f5f5] border border-[#3a3a3a] transition"
                        >
                          <i className="fa-solid fa-pen text-[10px] text-amber-400"></i>
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
          <div className="rounded-2xl border border-dashed border-[#333333] p-12 text-center bg-[#1a1a1a]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#252525] text-amber-400 mb-3">
              <i className="fa-solid fa-car text-2xl"></i>
            </div>
            <h3 className="text-base font-semibold text-[#f5f5f5]">No vehicles registered</h3>
            <p className="mt-1 text-xs text-[#888888] max-w-sm mx-auto">
              Your fleet is currently empty. Add your first car to start accepting rentals.
            </p>
            <Link
              to="/add-car"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-2 text-xs font-semibold text-black hover:from-amber-400 hover:to-amber-300 transition"
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
