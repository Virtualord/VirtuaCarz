import React from "react";
import { Link } from "react-router";
import PageHeader from "../components/ui/PageHeader";

const CONTACT_OPTIONS = [
  {
    icon: "fa-solid fa-phone-volume",
    label: "Call the support desk",
    value: "0123456789",
    href: "tel:0123456789",
    note: "Fastest for active bookings and roadside assistance.",
  },
  {
    icon: "fa-solid fa-envelope",
    label: "Email the team",
    value: "adityapatkar81@gmail.com",
    href: "mailto:adityapatkar81@gmail.com",
    note: "Best for account, invoice, or general questions.",
  },
  {
    icon: "fa-solid fa-globe",
    label: "Visit the portfolio",
    value: "portfolio-site.adityapatkar81.workers.dev",
    href: "https://portfolio-site.adityapatkar81.workers.dev/",
    note: "See the design and engineering work behind the product.",
    external: true,
  },
];

const Contact = () => {
  return (
    <section className="min-h-[80vh] bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <PageHeader
          eyebrow="Contact"
          title={
            <>
              Talk to a human<span className="text-accent">.</span>
            </>
          }
          description="Questions about a booking, a vehicle, or a return? Reach the team directly. No ticket maze, no hold music."
          aside={
            <div className="sm:text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-soft">
                Support hours
              </p>
              <p className="mt-1 font-display text-2xl font-bold tracking-tight text-ink">
                24 / 7
              </p>
              <p className="mt-1 text-[11px] text-ink-soft">
                Every day, pan-India
              </p>
            </div>
          }
        />

        <div className="grid gap-10 pt-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-16 lg:pt-12">
          <div className="border-t border-line">
            {CONTACT_OPTIONS.map((option) => (
              <a
                key={option.label}
                href={option.href}
                target={option.external ? "_blank" : undefined}
                rel={option.external ? "noopener noreferrer" : undefined}
                className="group grid grid-cols-[40px_minmax(0,1fr)_auto] items-start gap-4 border-b border-line py-6 transition-colors duration-200 hover:text-accent sm:gap-6 sm:py-7"
              >
                <span className="flex h-10 w-10 items-center justify-center border border-line text-xs text-ink transition-colors duration-200 group-hover:border-accent group-hover:text-accent">
                  <i className={option.icon} aria-hidden="true" />
                </span>

                <span className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft">
                    {option.label}
                  </span>
                  <span className="mt-1 block break-all text-base font-semibold tracking-tight text-ink transition-colors duration-200 group-hover:text-accent sm:text-lg">
                    {option.value}
                  </span>
                  <span className="mt-1.5 block text-xs leading-relaxed text-ink-soft">
                    {option.note}
                  </span>
                </span>

                <i
                  className="fa-solid fa-arrow-right mt-1 text-[10px] text-ink-soft transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent"
                  aria-hidden="true"
                />
              </a>
            ))}
          </div>

          <aside className="border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
              Before you write
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink">
              A little context helps<span className="text-accent">.</span>
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-ink-soft">
              Include these details and the team can resolve most requests on the
              first reply.
            </p>

            <ul className="mt-6 divide-y divide-line border-y border-line">
              {[
                "Your booking reference, if you have one",
                "The vehicle name and rental dates",
                "The city or pickup hub",
                "A phone number we can reach you on",
              ].map((item, index) => (
                <li key={item} className="flex gap-4 py-3.5 text-xs text-ink-soft">
                  <span className="font-mono text-[10px] text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 border border-line bg-cream-dark p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-soft">
                Prefer self-serve?
              </p>
              <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                Manage dates, review a reservation, or update your profile from
                your account.
              </p>
              <Link
                to="/profile"
                className="mt-4 inline-flex items-center gap-2 border-b border-ink pb-1 text-xs font-semibold text-ink transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                Go to account
                <i className="fa-solid fa-arrow-right text-[9px]" aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Contact;
