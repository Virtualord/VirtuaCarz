import { motion } from "framer-motion";

const Contact = () => {
  return (
    <section className="flex min-h-[87vh] items-center justify-center bg-cream px-4 py-16">
      
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-2xl rounded-md border border-line bg-white p-8 shadow-[0_24px_60px_-32px_rgba(24,24,27,0.25)] sm:p-12"
      >

        {/* Header */}
        <div className="text-center">
          <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
            Contact Support
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Need some help?
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-ink-soft">
            Have a question about a booking or need assistance with your rental?
            Our support team is here to help.
          </p>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-line" />

        {/* Contact Options */}
        <div className="space-y-4">

          {/* Phone */}
          <a
            href="tel:0123456789"
            className="group flex items-center gap-5 rounded-md border border-line bg-cream p-4 transition-colors duration-300 hover:border-ink"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-line bg-white text-ink transition-colors duration-300 group-hover:border-accent group-hover:text-accent">
              <i className="fa-solid fa-phone-volume" />
            </div>

            <div>
              <p className="text-sm text-ink-soft">
                Call us
              </p>

              <p className="mt-1 font-bold text-ink">
                0123456789
              </p>
            </div>

            <span className="ml-auto text-ink-soft transition-transform duration-300 group-hover:translate-x-1 group-hover:text-ink">
              →
            </span>
          </a>

          {/* Email */}
          <a
            href="mailto:help@carrentalapp.com"
            className="group flex items-center gap-5 rounded-md border border-line bg-cream p-4 transition-colors duration-300 hover:border-ink"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-line bg-white text-ink transition-colors duration-300 group-hover:border-accent group-hover:text-accent">
              <i className="fa-solid fa-envelope" />
            </div>

            <div className="min-w-0">
              <p className="text-sm text-ink-soft">
                Email us
              </p>

              <p className="mt-1 font-bold text-ink truncate">
                adityapatkar81@gmail.com
              </p>
            </div>

            <span className="ml-auto text-ink-soft transition-transform duration-300 group-hover:translate-x-1 group-hover:text-ink">
              →
            </span>
          </a>

          {/* Portfolio */}
          <a
            href="https://portfolio-site.adityapatkar81.workers.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-5 rounded-md border border-line bg-cream p-4 transition-colors duration-300 hover:border-ink"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-line bg-white text-ink transition-colors duration-300 group-hover:border-accent group-hover:text-accent">
              <i className="fa-solid fa-globe" />
            </div>

            <div className="min-w-0">
              <p className="text-sm text-ink-soft">
                Visit Portfolio
              </p>

              <p className="mt-1 font-bold text-ink truncate">
                portfolio-site.adityapatkar81.workers.dev
              </p>
            </div>

            <span className="ml-auto text-ink-soft transition-transform duration-300 group-hover:translate-x-1 group-hover:text-ink">
              →
            </span>
          </a>

        </div>

        {/* Footer Message */}
        <p className="mt-10 text-center text-xs text-ink-soft">
          We&apos;ll get back to you as soon as possible.
        </p>

      </motion.div>
    </section>
  );
};

export default Contact;
