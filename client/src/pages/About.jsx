import React from "react";
import { Link } from "react-router";
import PageHeader from "../components/ui/PageHeader";
import Reveal from "../components/ui/Reveal";

const STATS = [
  { value: "50+", label: "Cities served" },
  { value: "₹0", label: "Security deposit" },
  { value: "24/7", label: "Roadside support" },
  { value: "4.8", label: "Average trip rating" },
];

const PRINCIPLES = [
  {
    title: "Fewer forms. More road.",
    description:
      "Digital KYC, keyless access, and transparent pricing remove the paperwork that usually sits between you and a good drive.",
  },
  {
    title: "A fleet you can trust.",
    description:
      "Every vehicle is cleaned, inspected, and serviced between trips. What you book is what arrives at your door.",
  },
  {
    title: "Support that answers.",
    description:
      "Real people, around the clock, across the country. If a plan changes or a warning light appears, we are one call away.",
  },
  {
    title: "No hidden arithmetic.",
    description:
      "The price you see is the price you pay. Fuel, deposits, and cancellation terms are stated clearly before you confirm.",
  },
];

const About = () => {
  return (
    <div className="bg-cream">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <PageHeader
          eyebrow="About VirtuaCarz"
          title={
            <>
              Built for the
              <br />
              open road<span className="text-accent">.</span>
            </>
          }
          description="VirtuaCarz exists to make self-drive rentals feel less like admin and more like a good decision. A clean fleet, clear pricing, and the freedom to go where the day takes you."
        />

        <dl className="grid grid-cols-2 border-b border-line sm:grid-cols-4">
          {STATS.map((stat, index) => (
            <div
              key={stat.label}
              className={`py-7 sm:py-9 ${
                index > 0 ? "sm:border-l sm:border-line sm:pl-6" : ""
              } ${index % 2 === 1 ? "border-l border-line pl-5 sm:pl-6" : ""}`}
            >
              <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft">
                {stat.label}
              </dt>
              <dd className="mt-2 font-display text-4xl font-bold tracking-[-0.045em] text-ink sm:text-5xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        <section className="grid gap-10 pt-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20 lg:pt-20">
          <Reveal>
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-accent">
                The premise
              </p>
              <h2 className="mt-4 font-display text-4xl font-bold leading-[0.98] tracking-[-0.04em] text-ink sm:text-5xl">
                A quieter way
                <br />
                to rent<span className="text-accent">.</span>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="max-w-2xl space-y-6 text-sm leading-relaxed text-ink-soft sm:text-base">
              <p>
                Traditional car rental asks a lot of you: phone calls, counters,
                deposits, and fine print. We built VirtuaCarz around a simpler
                idea — choose a car, know the price, and drive.
              </p>
              <p>
                Today the platform connects drivers with a verified fleet across
                India, from compact city cars to SUVs built for the mountains.
                Every booking includes roadside assistance, a digital handover,
                and a support team that stays reachable after the keys change
                hands.
              </p>
              <p className="border-l-2 border-accent pl-5 font-display text-xl font-semibold leading-relaxed tracking-tight text-ink sm:text-2xl">
                “The best rental experience is the one you barely notice. The
                car is there. The terms are clear. The road is yours.”
              </p>
            </div>
          </Reveal>
        </section>
      </section>

      <section className="border-y border-line bg-cream-dark">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="flex flex-col gap-6 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-accent">
                What we stand for
              </p>
              <h2 className="mt-4 font-display text-4xl font-bold leading-[0.98] tracking-[-0.04em] text-ink sm:text-5xl">
                Four operating rules<span className="text-accent">.</span>
              </h2>
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-ink-soft sm:text-right">
              These are the standards behind every listing, handover, and support
              call on the platform.
            </p>
          </div>

          <div className="divide-y divide-line border-b border-line">
            {PRINCIPLES.map((principle, index) => (
              <Reveal key={principle.title} delay={0.05 * index}>
                <div className="grid gap-4 py-7 sm:grid-cols-[48px_220px_minmax(0,1fr)] sm:items-baseline sm:gap-8">
                  <span className="font-mono text-[10px] text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-xl font-bold tracking-tight text-ink">
                    {principle.title}
                  </h3>
                  <p className="max-w-xl text-sm leading-relaxed text-ink-soft">
                    {principle.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-col gap-8 border-t border-line pt-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-accent">
              Ready when you are
            </p>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-bold leading-[0.98] tracking-[-0.04em] text-ink sm:text-5xl">
              Find a car. Take the long way
              <span className="text-accent">.</span>
            </h2>
          </div>
          <Link
            to="/cars"
            className="inline-flex items-center gap-2 self-start border-b border-ink pb-1 text-sm font-semibold text-ink transition-colors duration-200 hover:border-accent hover:text-accent sm:self-end"
          >
            Explore the fleet
            <i className="fa-solid fa-arrow-right text-[10px]" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
