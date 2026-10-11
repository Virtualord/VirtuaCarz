const Contact = () => {
  return (
    <section className="flex min-h-[87vh] items-center justify-center bg-[#212121] px-4 py-10">
      
      <div className="w-full max-w-xl rounded-2xl border border-[#3f3f3f] bg-[#2f2f2f] p-8 shadow-2xl sm:p-12">

        {/* Header */}
        <div className="text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-[#737373]">
            Contact Support
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-[#f5f5f5] sm:text-4xl">
            Need some help?
          </h1>

          <p className="mt-4 text-sm leading-6 text-[#a3a3a3] sm:text-base">
            Have a question about a booking or need assistance with your rental?
            Our support team is here to help.
          </p>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-[#3f3f3f]" />

        {/* Contact Options */}
        <div className="space-y-4">

          {/* Phone */}
          <a
            href="tel:0123456789"
            className="group flex items-center gap-4 rounded-xl border border-[#3f3f3f] bg-[#212121] p-4 transition hover:bg-[#383838]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#525252] text-lg text-[#ececec]">
              <i className="fa-solid fa-phone-volume" />
            </div>

            <div>
              <p className="text-sm text-[#737373]">
                Call us
              </p>

              <p className="mt-1 font-medium text-[#ececec]">
                0123456789
              </p>
            </div>

            <span className="ml-auto text-[#737373] transition group-hover:translate-x-1 group-hover:text-[#ececec]">
              →
            </span>
          </a>

          {/* Email */}
          <a
            href="mailto:help@carrentalapp.com"
            className="group flex items-center gap-4 rounded-xl border border-[#3f3f3f] bg-[#212121] p-4 transition hover:bg-[#383838]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#525252] text-lg text-[#ececec]">
              <i className="fa-solid fa-envelope" />
            </div>

            <div>
              <p className="text-sm text-[#737373]">
                Email us
              </p>

              <p className="mt-1 font-medium text-[#ececec]">
                adityapatkar81@gmail.com
              </p>
            </div>

            <span className="ml-auto text-[#737373] transition group-hover:translate-x-1 group-hover:text-[#ececec]">
              →
            </span>
          </a>

          {/* Portfolio */}
          <a
            href="https://portfolio-site.adityapatkar81.workers.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-xl border border-[#3f3f3f] bg-[#212121] p-4 transition hover:bg-[#383838]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#525252] text-lg text-[#ececec]">
              <i className="fa-solid fa-globe" />
            </div>

            <div className="truncate">
              <p className="text-sm text-[#737373]">
                Visit Portfolio
              </p>

              <p className="mt-1 font-medium text-[#ececec] truncate">
                portfolio-site.adityapatkar81.workers.dev
              </p>
            </div>

            <span className="ml-auto text-[#737373] transition group-hover:translate-x-1 group-hover:text-[#ececec]">
              →
            </span>
          </a>

        </div>

        {/* Footer Message */}
        <p className="mt-8 text-center text-xs text-[#737373]">
          We'll get back to you as soon as possible.
        </p>

      </div>
    </section>
  );
};

export default Contact;