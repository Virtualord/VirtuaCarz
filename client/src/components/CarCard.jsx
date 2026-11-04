import { Link } from "react-router";

const getImageSrc = (image) => {
  if (!image) return null;
  if (image.startsWith("http") || image.startsWith("data:")) return image;
  return `data:image/jpeg;base64,${image}`;
};

const CarCard = ({ car }) => {
  const availability = car?.status === false;

  return (
    <Link to={`/cars/${car?._id}`} className="group block w-full max-w-sm">
      <article className="m-2 overflow-hidden rounded-lg border border-line bg-white shadow-[0_16px_40px_-24px_rgba(24,24,27,0.25)] transition-all duration-500 ease-editorial hover:-translate-y-1 hover:shadow-[0_28px_60px_-28px_rgba(24,24,27,0.35)]">

        {/* Car Image */}
        <div className="relative h-72 w-full overflow-hidden bg-cream-deep">
          <img
            src={getImageSrc(car?.image)}
            alt={car?.name || "Car"}
            className="h-full w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#18181b]/70 via-transparent to-transparent" />

          {/* Availability Pill */}
          <div className="absolute top-4 left-4">
            <span className={`rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${
              availability
                ? "bg-accent/95 text-white"
                : "bg-[#18181b]/70 text-cream"
            }`}>
              {availability ? "Booked out" : "Available"}
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">

          {/* Car Name */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-xl font-bold tracking-tight text-ink transition-colors duration-300 group-hover:text-accent">
              {car?.name}
            </h3>
            <span className="text-xs font-semibold text-ink-soft">{car?.year || "2026"}</span>
          </div>

          {/* Description */}
          <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-ink-soft">
            {car?.about || "No description available."}
          </p>

          {/* Divider */}
          <div className="mb-4 h-px w-full bg-line" />

          {/* Price + CTA */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Starting from
              </p>

              <p className="text-lg font-bold text-ink">
                ₹{car?.price}
                <span className="ml-1 text-xs font-medium text-ink-soft"> / day</span>
              </p>
            </div>

            <span className="rounded-md bg-ink px-3.5 py-2 text-sm font-semibold text-cream transition-colors duration-300 group-hover:bg-accent">
              View details →
            </span>

          </div>
        </div>

      </article>
    </Link>
  );
};

export default CarCard;
