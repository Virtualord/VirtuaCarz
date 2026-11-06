import React from "react";
import { Link } from "react-router";
import Eyebrow from "./Eyebrow";

const PageHeader = ({
  eyebrow,
  title,
  description,
  aside,
  backTo,
  backLabel = "Back",
  className = "",
}) => (
  <header className={`border-b border-line pb-8 sm:pb-10 ${className}`}>
    {backTo && (
      <Link
        to={backTo}
        className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft transition-colors duration-200 hover:text-ink"
      >
        <i className="fa-solid fa-arrow-left text-[9px]" aria-hidden="true" />
        {backLabel}
      </Link>
    )}

    <div
      className={`flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between ${
        backTo ? "mt-5" : ""
      }`}
    >
      <div className="min-w-0">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}

        <h1 className="mt-5 font-display text-4xl font-bold leading-[0.95] tracking-[-0.045em] text-ink sm:text-5xl lg:text-6xl">
          {title}
        </h1>

        {description && (
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">
            {description}
          </p>
        )}
      </div>

      {aside && <div className="shrink-0">{aside}</div>}
    </div>
  </header>
);

export default PageHeader;
