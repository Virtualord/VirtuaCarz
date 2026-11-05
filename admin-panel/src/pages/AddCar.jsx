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
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              Create Vehicle Listing
            </h2>
            <p className="text-sm text-ink-soft">
              Fill in the vehicle specifications to publish it in your fleet.
            </p>
          </div>
        </div>

        {/* Main Form Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-md border border-line bg-white p-6 shadow-[0_16px_40px_-24px_rgba(24,24,27,0.25)] sm:p-8"
        >
          {/* Section: Basic Details */}
          <div className="mb-8 border-b border-line pb-6">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-accent">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Car Name */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink">
                  Vehicle Name <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Honda City"
                  className="w-full rounded-md border border-line bg-cream px-3.5 py-2.5 text-sm text-ink placeholder-ink-soft outline-none transition-colors duration-200 focus:border-accent focus:ring-1 focus:ring-accent/50"
                />
              </div>

              {/* Model */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink">
                  Model / Trim <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. ZX CVT"
                  className="w-full rounded-md border border-line bg-cream px-3.5 py-2.5 text-sm text-ink placeholder-ink-soft outline-none transition-colors duration-200 focus:border-accent focus:ring-1 focus:ring-accent/50"
                />
              </div>

              {/* Year */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink">
                  Manufacturing Year <span className="text-accent">*</span>
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  min="1990"
                  max="2030"
                  className="w-full rounded-md border border-line bg-cream px-3.5 py-2.5 text-sm text-ink outline-none transition-colors duration-200 focus:border-accent focus:ring-1 focus:ring-accent/50"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink">
                  Body Category <span className="text-accent">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-md border border-line bg-cream px-3.5 py-2.5 text-sm text-ink outline-none transition-colors duration-200 focus:border-accent focus:ring-1 focus:ring-accent/50 cursor-pointer"
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
          <div className="mb-8 border-b border-line pb-6">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-accent">
              Technical Specifications
            </h3>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {/* Fuel */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink">
                  Fuel Type
                </label>
                <select
                  value={fuel}
                  onChange={(e) => setFuel(e.target.value)}
                  className="w-full rounded-md border border-line bg-cream px-3.5 py-2.5 text-sm text-ink outline-none transition-colors duration-200 focus:border-accent focus:ring-1 focus:ring-accent/50 cursor-pointer"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              {/* Transmission */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink">
                  Transmission
                </label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                  className="w-full rounded-md border border-line bg-cream px-3.5 py-2.5 text-sm text-ink outline-none transition-colors duration-200 focus:border-accent focus:ring-1 focus:ring-accent/50 cursor-pointer"
                >
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>

              {/* Seats */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink">
                  Seats
                </label>
                <input
                  type="number"
                  value={seats}
                  onChange={(e) => setSeats(e.target.value)}
                  min="1"
                  max="15"
                  className="w-full rounded-md border border-line bg-cream px-3.5 py-2.5 text-sm text-ink outline-none transition-colors duration-200 focus:border-accent focus:ring-1 focus:ring-accent/50"
                />
              </div>

              {/* Mileage */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink">
                  Mileage (km/l)
                </label>
                <input
                  type="number"
                  value={milage}
                  onChange={(e) => setMilage(e.target.value)}
                  min="0"
                  className="w-full rounded-md border border-line bg-cream px-3.5 py-2.5 text-sm text-ink outline-none transition-colors duration-200 focus:border-accent focus:ring-1 focus:ring-accent/50"
                />
              </div>

              {/* Price Per Day */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-ink">
                  Price Per Day (₹) <span className="text-accent">*</span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-sm text-ink-soft">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min="0"
                    placeholder="1000"
                    className="w-full rounded-md border border-line bg-cream pl-8 pr-3.5 py-2.5 text-sm text-ink outline-none transition-colors duration-200 focus:border-accent focus:ring-1 focus:ring-accent/50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Media & Overview */}
          <div className="mb-8">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-accent">
              Media & Overview
            </h3>

            <div className="space-y-5">
              {/* Image Upload */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink">
                  Car Photo <span className="text-accent">*</span>
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4 rounded-md border border-dashed border-line bg-cream p-4 text-center">
                  {preview ? (
                    <div className="relative h-28 w-44 shrink-0 overflow-hidden rounded-md border border-line bg-black">
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-cream-dark text-ink-soft">
                      <i className="fa-solid fa-image text-2xl"></i>
                    </div>
                  )}

                  <div className="flex-1 text-center sm:text-left">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-cream border border-line hover:bg-cream-deep px-4 py-2 text-xs font-medium text-ink transition-colors duration-200">
                      <i className="fa-solid fa-upload"></i>
                      <span>Select Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <p className="mt-1 text-xs text-ink-soft">
                      {image ? image.name : "PNG, JPG, or WEBP (Max 5MB)"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink">
                  About Vehicle <span className="text-accent">*</span>
                </label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows="4"
                  placeholder="Provide detailed description, features, conditions, and highlights of this car..."
                  className="w-full rounded-md border border-line bg-cream p-3.5 text-sm text-ink placeholder-ink-soft outline-none transition-colors duration-200 focus:border-accent focus:ring-1 focus:ring-accent/50"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2.5 rounded-md bg-accent px-6 py-3 font-bold text-white transition-all duration-300 shadow-lg shadow-accent/30 hover:bg-accent-deep cursor-pointer ${
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
