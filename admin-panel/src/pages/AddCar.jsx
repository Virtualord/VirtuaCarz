import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import Layout from "../components/Layout";
import { addCar, resetCarState } from "../store/carSlice";

const AddCar = () => {
  const dispatch = useDispatch();

  const { loading, success, error } = useSelector((state) => state.cars);

  const [name, setName] = useState("");
  const [model, setModel] = useState("top");
  const [year, setYear] = useState(2025);
  const [category, setCategory] = useState("Hatchback");
  const [fuel, setFuel] = useState("Petrol");
  const [seats, setSeats] = useState(4);
  const [milage, setMilage] = useState(8);
  const [price, setPrice] = useState(1000);
  const [about, setAbout] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [transmission, setTransmission] = useState("Manual");

  useEffect(() => {
    if (success) {
      toast.success("Car added successfully!");

      setName("");
      setModel("top");
      setYear(2025);
      setCategory("Hatchback");
      setFuel("Petrol");
      setSeats(4);
      setMilage(8);
      setPrice(1000);
      setAbout("");
      setImage(null);
      setPreview(null);
      setTransmission("Manual");

      dispatch(resetCarState());
    }

    if (error) {
      toast.error(error);
      dispatch(resetCarState());
    }
  }, [success, error, dispatch]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !name ||
      !model ||
      !year ||
      !category ||
      !fuel ||
      !seats ||
      !milage ||
      !price ||
      !about ||
      !image
    ) {
      return toast.error("Please provide all required fields including image");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("model", model);
    formData.append("year", year);
    formData.append("category", category);
    formData.append("fuel", fuel);
    formData.append("seats", seats);
    formData.append("milage", milage);
    formData.append("price", price);
    formData.append("about", about);
    formData.append("transmission", transmission);
    formData.append("image", image);

    dispatch(addCar(formData));
  };

  return (
    <Layout title="Add New Car">
      <div className="mx-auto max-w-4xl">
        {/* Page Banner */}
        <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#f5f5f5]">
              Create Vehicle Listing
            </h2>
            <p className="text-sm text-[#8c8c8c]">
              Fill in the vehicle specifications to publish it in your fleet.
            </p>
          </div>
        </div>

        {/* Main Form Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 sm:p-8 shadow-xl"
        >
          {/* Section: Basic Details */}
          <div className="mb-8 border-b border-[#2a2a2a] pb-6">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-amber-400">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Car Name */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#c0c0c0]">
                  Vehicle Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Honda City"
                  className="w-full rounded-xl border border-[#333333] bg-[#222222] px-3.5 py-2.5 text-sm text-[#f5f5f5] placeholder-[#666666] outline-none transition focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/50"
                />
              </div>

              {/* Model */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#c0c0c0]">
                  Model / Trim <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. ZX CVT"
                  className="w-full rounded-xl border border-[#333333] bg-[#222222] px-3.5 py-2.5 text-sm text-[#f5f5f5] placeholder-[#666666] outline-none transition focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/50"
                />
              </div>

              {/* Year */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#c0c0c0]">
                  Manufacturing Year <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  min="1990"
                  max="2030"
                  className="w-full rounded-xl border border-[#333333] bg-[#222222] px-3.5 py-2.5 text-sm text-[#f5f5f5] placeholder-[#666666] outline-none transition focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/50"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#c0c0c0]">
                  Body Category <span className="text-red-400">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-[#333333] bg-[#222222] px-3.5 py-2.5 text-sm text-[#f5f5f5] outline-none transition focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/50 cursor-pointer"
                >
                  <option value="Hatchback">Hatchback</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="MUV">MUV</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Technical Specs */}
          <div className="mb-8 border-b border-[#2a2a2a] pb-6">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-amber-400">
              Technical Specifications
            </h3>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {/* Fuel */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#c0c0c0]">
                  Fuel Type
                </label>
                <select
                  value={fuel}
                  onChange={(e) => setFuel(e.target.value)}
                  className="w-full rounded-xl border border-[#333333] bg-[#222222] px-3.5 py-2.5 text-sm text-[#f5f5f5] outline-none transition focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/50 cursor-pointer"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              {/* Transmission */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#c0c0c0]">
                  Transmission
                </label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                  className="w-full rounded-xl border border-[#333333] bg-[#222222] px-3.5 py-2.5 text-sm text-[#f5f5f5] outline-none transition focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/50 cursor-pointer"
                >
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>

              {/* Seats */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#c0c0c0]">
                  Seats
                </label>
                <input
                  type="number"
                  value={seats}
                  onChange={(e) => setSeats(e.target.value)}
                  min="1"
                  max="15"
                  className="w-full rounded-xl border border-[#333333] bg-[#222222] px-3.5 py-2.5 text-sm text-[#f5f5f5] outline-none transition focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/50"
                />
              </div>

              {/* Mileage */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#c0c0c0]">
                  Mileage (km/l)
                </label>
                <input
                  type="number"
                  value={milage}
                  onChange={(e) => setMilage(e.target.value)}
                  min="0"
                  className="w-full rounded-xl border border-[#333333] bg-[#222222] px-3.5 py-2.5 text-sm text-[#f5f5f5] outline-none transition focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/50"
                />
              </div>

              {/* Price Per Day */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-[#c0c0c0]">
                  Price Per Day (₹) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-sm text-[#888888]">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min="0"
                    placeholder="1000"
                    className="w-full rounded-xl border border-[#333333] bg-[#222222] pl-8 pr-3.5 py-2.5 text-sm text-[#f5f5f5] outline-none transition focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Media & Description */}
          <div className="mb-8">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-amber-400">
              Media & Overview
            </h3>

            <div className="space-y-5">
              {/* Image Upload */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#c0c0c0]">
                  Car Photo <span className="text-red-400">*</span>
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4 rounded-xl border border-dashed border-[#3d3d3d] bg-[#202020] p-4 text-center">
                  {preview ? (
                    <div className="relative h-28 w-44 shrink-0 overflow-hidden rounded-lg border border-[#3a3a3a] bg-black">
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-[#2a2a2a] text-[#777777]">
                      <i className="fa-solid fa-image text-2xl"></i>
                    </div>
                  )}

                  <div className="flex-1 text-center sm:text-left">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#2e2e2e] hover:bg-[#383838] px-4 py-2 text-xs font-medium text-[#f5f5f5] transition border border-[#444444]">
                      <i className="fa-solid fa-upload"></i>
                      <span>Select Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <p className="mt-1 text-xs text-[#777777]">
                      {image ? image.name : "PNG, JPG, or WEBP (Max 5MB)"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#c0c0c0]">
                  About Vehicle <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows="4"
                  placeholder="Provide detailed description, features, conditions, and highlights of this car..."
                  className="w-full rounded-xl border border-[#333333] bg-[#222222] p-3.5 text-sm text-[#f5f5f5] placeholder-[#666666] outline-none transition focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/50"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-3 font-semibold text-black transition shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-300 cursor-pointer ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-circle-notch animate-spin"></i>
                  <span>Adding Vehicle...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-plus font-bold"></i>
                  <span>Add Car to Fleet</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddCar;