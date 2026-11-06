import React from "react";
import { Link } from "react-router";

const Footer = () => {
  const year = new Date().getFullYear();

  const groups = [
    {
      label: "Explore",
      links: [
        { name: "Full fleet", path: "/cars" },
        { name: "My account", path: "/profile" },
      ],
    },
    {
      label: "Company",
      links: [
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" },
      ],
    },
    {
      label: "Support",
      links: [
        { name: "Call us", path: "tel:0123456789", external: false },
        { name: "Email us", path: "mailto:adityapatkar81@gmail.com", external: false },
        { name: "Developer", path: "https://portfolio-site.adityapatkar81.workers.dev/", external: true },
      ],
    },
  ];

  return (
    <footer className="border-t border-line bg-cream-dark">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 border-b border-line pb-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 text-lg font-bold tracking-tight text-ink"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-white">
                <i className="fa-solid fa-car text-xs" aria-hidden="true" />
              </span>
              <span>
                Virtua<span className="text-accent">Carz</span>
              </span>
            </Link>

            <p className="mt-8 font-display text-5xl font-bold leading-[0.95] tracking-[-0.05em] text-ink sm:text-6xl">
              Drive
              <br />
              fearless<span className="text-accent">.</span>
            </p>

            <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-soft">
              Self-drive car rentals built for the open road. Zero security
              deposit, doorstep delivery, and 24/7 roadside assistance across
              50+ Indian cities.
            </p>

            <Link
              to="/cars"
              className="mt-7 inline-flex items-center gap-2 border-b border-ink pb-1 text-xs font-semibold text-ink transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              Find your next car
              <i className="fa-solid fa-arrow-right text-[9px]" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {groups.map((group) => (
              <div key={group.label}>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-soft">
                  {group.label}
                </p>
                <ul className="mt-5 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.name}>
                      {link.external ? (
                        <a
                          href={link.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-ink-soft transition-colors duration-200 hover:text-ink"
                        >
                          {link.name}
                        </a>
                      ) : link.path.startsWith("/") ? (
                        <Link
                          to={link.path}
                          className="text-sm text-ink-soft transition-colors duration-200 hover:text-ink"
                        >
                          {link.name}
                        </Link>
                      ) : (
                        <a
                          href={link.path}
                          className="text-sm text-ink-soft transition-colors duration-200 hover:text-ink"
                        >
                          {link.name}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 pt-7 sm:flex-row sm:items-center">
          <p className="text-xs text-ink-soft">
            © {year}{" "}
            <span className="font-semibold text-ink">VirtuaCarz</span>. All
            rights reserved.
          </p>

          <p className="text-xs text-ink-soft">
            Designed &amp; built by{" "}
            <a
              href="https://portfolio-site.adityapatkar81.workers.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-ink underline-offset-4 hover:text-accent hover:underline"
            >
              Aditya
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
