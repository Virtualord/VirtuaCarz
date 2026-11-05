import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteCar, getCarDetails, updateCar } from "../../store/carSlice";
import { toast } from "react-toastify";

const inputClass =
  "w-full rounded-md border border-line bg-cream px-3.5 py-2.5 text-sm text-ink placeholder-ink-soft/70 outline-none transition-colors duration-200 focus:border-ink focus:ring-1 focus:ring-ink/10";

const labelClass = "mb-1.5 block text-xs font-medium text-ink";

const CarDetails = () => {
  const { id } = useParams();
  const { carDetail, loading } = useSelector((state) => state.cars);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    dispatch(getCarDetails(id));
  }, [id, dispatch]);

  const carDetails = carDetail?._id === id ? carDetail : null;

  const [name, setName] = useState("");
  const [model, setModel] = useState("top");
  const [year, setYear] = useState(2025);
  const [category, setCategory] = useState("Hatchback");
  const [fuel, setFuel] = useState("Petrol");
  const [seats, setSeats] = useState(4);
  const [milage, setMilage] = useState(8);
  const [price, setPrice] = useState(1000);
  const [about, setAbout] = useState("");
  const [transmission, setTransmission] = useState("Manual");

  useEffect(() => {
    if (!carDetails) return;
    setName(carDetails.name || "");
    setModel(carDetails.model || "");
    setAbout(carDetails.about || "");
    setCategory(carDetails.category || "Hatchback");
    setFuel(carDetails.fuel || "Petrol");
    setTransmission(carDetails.transmission ? "Automatic" : "Manual");
    setMilage(carDetails.milage ?? 8);
    setPrice(carDetails.price ?? 1000);
    setPreview(
      carDetails.image
        ? carDetails.image.startsWith("data:")
          ? carDetails.image
          : `data:image/jpeg;base64,${carDetails.image}`
        : null
    );
    setImage(null);
    setSeats(carDetails.seats ?? 4);
    setYear(carDetails.year ?? 2025);
  }, [carDetails]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
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
    if (image) formData.append("image", image);

    try {
      await dispatch(updateCar({ id, formData })).unwrap();
      toast.success("Car updated successfully");
      navigate("/all-cars");
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Unable to update car");
    }
  };

  // Delete car after confirmation.
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;
    try {
      await dispatch(deleteCar(id)).unwrap();
      toast.success("Car has been deleted");
      navigate("/all-cars");
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Unable to delete car");
    }
  };

  return (
    <Layout title="Vehicle Details">
      <div className="mx-auto max-w-6xl">
        {/* Page header */}
        <div className="mb-8 flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              to="/all-cars"
              className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-soft transition-colors duration-200 hover:text-ink"
            >
              <i className="fa-solid fa-arrow-left text-[10px]" />
              Back to fleet
            </Link>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
              Fleet / Vehicle
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.03em] text-ink sm:text-4xl">
              {name ? name : "Edit vehicle"}
            </h2>
            <p className="mt-2 text-sm text-ink-soft">
              Update the listing details or retire this vehicle from the fleet.
            </p>
          </div>

          {loading && !carDetails && (
            <span className="inline-flex items-center gap-2 text-xs text-ink-soft">
              <i className="fa-solid fa-circle-notch animate-spin text-accent" />
              Loading vehicle…
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Form */}
          <form
            onSubmit={handleUpdate}
            className="rounded-md border border-line bg-white p-6 shadow-[0_16px_40px_-28px_rgba(24,24,27,0.28)] sm:p-8"
          >
            {/* Basic details */}
            <div className="mb-8 border-b border-line pb-6">
              <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
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
            <div className="mb-8 border-b border-line pb-6">
              <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
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
              <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
                Media & overview
              </h3>

              <div className="space-y-5">
                <div>
                  <label className={labelClass}>
                    Car Photo <span className="text-accent">*</span>
                  </label>
                  <div className="flex flex-col items-center gap-4 rounded-md border border-dashed border-line bg-cream p-4 sm:flex-row">
                    {preview ? (
                      <div className="h-28 w-44 shrink-0 overflow-hidden rounded-md border border-line bg-black">
                        <img
                          src={preview}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-cream-dark text-ink-soft">
                        <i className="fa-solid fa-image text-2xl" />
                      </div>
                    )}

                    <div className="flex-1 text-center sm:text-left">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-line bg-white px-4 py-2 text-xs font-semibold text-ink transition-colors duration-200 hover:border-ink">
                        <i className="fa-solid fa-upload text-accent" />
                        <span>Replace photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      <p className="mt-1.5 text-xs text-ink-soft">
                        {image
                          ? image.name
                          : "PNG, JPG, or WEBP. Leave empty to keep the current image."}
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
                    placeholder="Provide a detailed description, features, condition, and highlights of this car..."
                    className={`${inputClass} resize-y`}
                  />
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
                className="inline-flex items-center justify-center gap-2.5 rounded-md bg-accent px-6 py-3 text-sm font-bold text-white shadow-[0_14px_30px_-16px_rgba(250,82,15,0.7)] transition-all duration-300 ease-editorial hover:bg-accent-deep active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-circle-notch animate-spin" />
                    <span>Saving changes…</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-check" />
                    <span>Save changes</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Live preview rail */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-md border border-line bg-white shadow-[0_16px_40px_-28px_rgba(24,24,27,0.28)]">
              <div className="relative aspect-[4/3] bg-cream-deep">
                {preview ? (
                  <img
                    src={preview}
                    alt={name || "Vehicle preview"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-ink-soft">
                    <i className="fa-solid fa-car text-4xl" />
                  </div>
                )}
                <span className="absolute left-3 top-3 rounded-full border border-line bg-cream/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink">
                  {category}
                </span>
              </div>

              <div className="p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                  Live listing preview
                </p>
                <h3 className="mt-2 text-xl font-bold tracking-tight text-ink">
                  {name || "Vehicle name"}
                </h3>
                <p className="mt-1 text-xs text-ink-soft">
                  {[model, year].filter(Boolean).join(" · ") || "Model · Year"}
                </p>

                <div className="mt-4 flex items-baseline gap-1.5 border-b border-line pb-4">
                  <span className="text-2xl font-bold tracking-tight text-ink">
                    ₹{Number(price || 0).toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-ink-soft">/ day</span>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <dt className="text-ink-soft">Fuel</dt>
                    <dd className="mt-0.5 font-semibold text-ink">{fuel}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-soft">Gearbox</dt>
                    <dd className="mt-0.5 font-semibold text-ink">
                      {transmission}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-ink-soft">Seats</dt>
                    <dd className="mt-0.5 font-semibold text-ink">
                      {seats} seats
                    </dd>
                  </div>
                  <div>
                    <dt className="text-ink-soft">Mileage</dt>
                    <dd className="mt-0.5 font-semibold text-ink">
                      {milage} km/l
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Danger zone */}
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-700">
                Danger zone
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-red-700/70">
                Deleting this vehicle removes it from the rental catalog. This
                action cannot be undone.
              </p>
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md border border-red-300 bg-white px-4 py-2.5 text-xs font-bold text-red-700 transition-colors duration-200 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <i className="fa-solid fa-trash-can" />
                Delete vehicle
              </button>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default CarDetails;
