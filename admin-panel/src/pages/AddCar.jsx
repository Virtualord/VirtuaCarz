import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import Layout from "../components/Layout";
import { addCar, resetCarState } from "../store/carSlice";

const inputClass =
  "w-full rounded-md border border-line bg-cream px-3.5 py-2.5 text-sm text-ink placeholder-ink-soft/70 outline-none transition-colors duration-200 focus:border-ink focus:ring-1 focus:ring-ink/10";

const labelClass = "mb-1.5 block text-xs font-medium text-ink";

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

  const checklist = [
    {
      title: "Accurate specification",
      description: "Match the model, year, fuel, and gearbox to the real vehicle.",
    },
    {
      title: "A clear photograph",
      description: "Use a well-lit, landscape photo of the actual car.",
    },
    {
      title: "Honest description",
      description: "Mention condition, features, and anything a renter should know.",
    },
    {
      title: "Market-ready pricing",
      description: "Set a daily rate that reflects the vehicle and the season.",
    },
  ];

  return (
    <Layout title="Add New Car">
      <div className="mx-auto max-w-7xl">
        {/* Editorial header */}
        <div className="border-b border-line pb-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-accent" />
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">
                  Fleet / New listing
                </p>
              </div>

              <h2 className="mt-5 font-display text-4xl font-bold tracking-[-0.045em] text-ink sm:text-5xl lg:text-6xl">
                New arrival<span className="text-accent">.</span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">
                Fill in the vehicle specifications to publish it in your rental
                catalog.
              </p>
            </div>

            <Link
              to="/all-cars"
              className="inline-flex items-center gap-2 self-start border-b border-ink pb-1 text-xs font-semibold text-ink transition-colors duration-200 hover:border-accent hover:text-accent sm:self-end"
            >
              <i className="fa-solid fa-arrow-left text-[9px]" />
              Back to fleet
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 pt-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16 lg:pt-10">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-md border border-line bg-white p-6 sm:p-8"
          >
            {/* Basic details */}
            <div className="mb-8 border-b border-line pb-7">
              <h3 className="mb-5 text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
                Basic information
              </h3>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>
                    Vehicle Name <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Honda City"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Model / Trim <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. ZX CVT"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Manufacturing Year <span className="text-accent">*</span>
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    min="1990"
                    max="2030"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Body Category <span className="text-accent">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`${inputClass} cursor-pointer`}
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

            {/* Technical specs */}
            <div className="mb-8 border-b border-line pb-7">
              <h3 className="mb-5 text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
                Technical specifications
              </h3>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div>
                  <label className={labelClass}>Fuel Type</label>
                  <select
                    value={fuel}
                    onChange={(e) => setFuel(e.target.value)}
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Transmission</label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value)}
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Seats</label>
                  <input
                    type="number"
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                    min="1"
                    max="15"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Mileage (km/l)</label>
                  <input
                    type="number"
                    value={milage}
                    onChange={(e) => setMilage(e.target.value)}
                    min="0"
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={labelClass}>
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
                      className={`${inputClass} pl-8`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Media & overview */}
            <div className="mb-8">
              <h3 className="mb-5 text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
                Media & overview
              </h3>

              <div className="space-y-5">
                <div>
                  <label className={labelClass}>
                    Car Photo <span className="text-accent">*</span>
                  </label>
                  <div className="flex flex-col items-center gap-4 rounded-md border border-dashed border-line bg-cream p-4 sm:flex-row">
                    {preview ? (
                      <div className="h-28 w-44 shrink-0 overflow-hidden rounded-sm border border-line bg-black">
                        <img
                          src={preview}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-sm bg-cream-dark text-ink-soft">
                        <i className="fa-solid fa-image text-2xl"></i>
                      </div>
                    )}

                    <div className="flex-1 text-center sm:text-left">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-line bg-white px-4 py-2 text-xs font-semibold text-ink transition-colors duration-200 hover:border-ink">
                        <i className="fa-solid fa-upload text-accent"></i>
                        <span>Select photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      <p className="mt-1.5 text-xs text-ink-soft">
                        {image ? image.name : "PNG, JPG, or WEBP (max 5MB)"}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    About Vehicle <span className="text-accent">*</span>
                  </label>
                  <textarea
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    rows="5"
                    placeholder="Describe the condition, features, and highlights of this car..."
                    className={`${inputClass} resize-y`}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse items-stretch gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Link
                to="/all-cars"
                className="inline-flex items-center justify-center rounded-md border border-line bg-cream px-5 py-3 text-xs font-semibold text-ink transition-colors duration-200 hover:border-ink"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2.5 rounded-md bg-accent px-6 py-3 text-sm font-bold text-white shadow-[0_16px_32px_-18px_rgba(250,82,15,0.8)] transition-all duration-300 ease-editorial hover:bg-accent-deep active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-circle-notch animate-spin"></i>
                    <span>Adding vehicle…</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-plus text-[10px]"></i>
                    <span>Add car to fleet</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Editorial guide rail */}
          <aside className="border-t border-line pt-6 lg:sticky lg:top-24 lg:self-start lg:border-t-0 lg:pt-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
              Before publishing
            </p>
            <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink">
              A listing people trust.
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-ink-soft">
              Clear details and an honest photograph help renters choose with
              confidence.
            </p>

            <ol className="mt-6 border-t border-line">
              {checklist.map((item, index) => (
                <li key={item.title} className="flex gap-4 border-b border-line py-4">
                  <span className="pt-0.5 font-mono text-[10px] text-accent">
                    0{index + 1}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-ink">{item.title}</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-ink-soft">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-6 text-[11px] leading-relaxed text-ink-soft">
              Fields marked <span className="text-accent">*</span> are required
              before the vehicle can be published.
            </p>
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default AddCar;
