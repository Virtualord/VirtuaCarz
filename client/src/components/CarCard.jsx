import { Link } from "react-router";
import { getImageSrc } from "../utils/image";

const CarCard = ({ car }) => {
  const isBookedOut = car?.status === false;

  return (
    <Link to={`/cars/${car?._id}`} className="group block">
      <article>
        <div className="relative aspect-[4/3] overflow-hidden border border-line bg-cream-deep">
          <img
            src={getImageSrc(car?.image)}
            alt={car?.name || "Car"}
            className="h-full w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.03]"
            loading="lazy"
          />

          <span
            className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
              isBookedOut
                ? "border-accent/30 bg-cream/95 text-accent"
                : "border-line bg-cream/95 text-ink"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isBookedOut ? "bg-accent" : "bg-emerald-500"
              }`}
            />
            {isBookedOut ? "Booked out" : "Available"}
          </span>
        </div>

        <div className="border-b border-line pb-5 pt-4">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-xl font-bold tracking-tight text-ink transition-colors duration-300 group-hover:text-accent">
              {car?.name}
            </h3>
            <span className="text-[11px] font-medium text-ink-soft">
              {car?.year || "2026"}
            </span>
          </div>

          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">
            {car?.about || "No description available."}
          </p>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
            <span>{car?.category || "Sedan"}</span>
            <span>{car?.fuel || "Petrol"}</span>
            <span>{car?.seats || 5} seats</span>
          </div>

          <div className="mt-5 flex items-end justify-between gap-3 border-t border-line pt-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-soft">
                From
              </p>
              <p className="mt-1 font-display text-lg font-bold tracking-tight text-ink">
                ₹{Number(car?.price || 0).toLocaleString("en-IN")}
                <span className="ml-1 text-[11px] font-medium text-ink-soft">
                  / day
                </span>
              </p>
            </div>

            <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-ink transition-colors duration-200 group-hover:text-accent">
              View
              <i
                className="fa-solid fa-arrow-right text-[9px] text-ink-soft transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent"
                aria-hidden="true"
              />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default CarCard;
