import React from "react";
import { Link } from "react-router";

const Footer = () => {
  const year = new Date().getFullYear();

  const exploreLinks = [
    { name: "All Cars", path: "/cars" },
    { name: "My Account", path: "/profile" },
  ];

  const companyLinks = [
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <footer className="relative w-full bg-[#f5f4ef] text-[#737373]">
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-16 sm:px-6 lg:px-8">
        {/* Editorial brand statement */}
        <div className="grid grid-cols-1 gap-12 pb-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 text-2xl font-bold tracking-tight text-[#18181b]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#fa520f] text-white">
                <i className="fa-solid fa-car text-xs" />
              </span>
              <span>
                Virtua<span className="text-[#fa520f]">Carz</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-relaxed">
              Self-drive car rentals engineered for the open road. Zero security
              deposits, doorstep delivery, and 24/7 pan-India roadside assistance
              across 50+ cities.
            </p>

            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-[#a3a3a3]">
              Drive fearless.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#18181b]">
                Explore
              </p>
              <ul className="mt-5 space-y-3">
                {exploreLinks.map((l) => (
                  <li key={l.path}>
                    <Link
                      to={l.path}
                      className="text-sm transition-colors duration-200 hover:text-[#18181b]"
                    >
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#18181b]">
                Company
              </p>
              <ul className="mt-5 space-y-3">
                {companyLinks.map((l) => (
                  <li key={l.path}>
                    <Link
                      to={l.path}
                      className="text-sm transition-colors duration-200 hover:text-[#18181b]"
                    >
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#18181b]">
                Fleet
              </p>
              <ul className="mt-5 space-y-3">
                {[
                  { name: "Self-Drive", path: "/" },
                  { name: "SUVs & 4x4", path: "/" },
                  { name: "Luxury & Sports", path: "/" },
                  { name: "Electric (EV)", path: "/" },
                ].map((l) => (
                  <li key={l.name}>
                    <Link
                      to={l.path}
                      className="text-sm transition-colors duration-200 hover:text-[#18181b]"
                    >
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-[#e5e5e5] pt-8 sm:flex-row">
          <p className="text-xs">
            © {year}{" "}
            <span className="font-semibold text-[#18181b]">VirtuaCarz</span>
            . All rights reserved.
          </p>

          <p className="text-xs">
            Made with <span className="text-[#18181b]">♥</span> by{" "}
            <span className="font-semibold text-[#18181b]">Aditya</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
