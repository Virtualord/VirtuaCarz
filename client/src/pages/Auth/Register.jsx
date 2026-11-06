import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { register } from "../../store/features/authSlice";

const Register = () => {
  const [uname, setUname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!uname.trim() || !email.trim() || !password.trim() || !phone.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!agreeTerms) {
      toast.error("Please agree to the Terms of Service to proceed");
      return;
    }

    try {
      await dispatch(
        register({
          uname: uname.trim(),
          email: email.trim(),
          password,
          phone: phone.trim(),
        })
      ).unwrap();

      toast.success("Account created successfully! Please log in.");
      setUname("");
      setEmail("");
      setPassword("");
      setPhone("");

      navigate("/login");
    } catch (error) {
      toast.error(error || "Registration failed. Please check your details.");
    }
  };

  const handleSsoClick = (provider) => {
    toast(`Sign up with ${provider} is in preview mode.`, {
      icon: "✦",
      style: {
        background: "#18181b",
        color: "#fbfbf8",
        border: "1px solid #e5e5e5",
      },
    });
  };

  return (
    <div className="grid min-h-screen bg-cream text-ink lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-ink p-10 text-cream lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(250,251,248,0.14)_1px,transparent_1px)] [background-size:26px_26px] opacity-40" />
        <div className="pointer-events-none absolute -right-40 top-1/3 h-[30rem] w-[30rem] rounded-full bg-accent/20 blur-[130px]" />

        <div className="relative">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-white">
              <i className="fa-solid fa-car text-xs" aria-hidden="true" />
            </span>
            <div>
              <p className="text-base font-bold tracking-tight text-cream">
                Virtua<span className="text-accent">Carz</span>
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-cream/40">
                Self-drive studio
              </p>
            </div>
          </Link>
        </div>

        <div className="relative max-w-xl py-16">
          <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.32em] text-accent">
            Membership
          </p>
          <h1 className="font-display text-6xl font-bold leading-[0.94] tracking-[-0.045em] text-cream xl:text-7xl 2xl:text-[5.5rem]">
            Join the
            <br />
            road
            <span className="text-accent">.</span>
          </h1>
          <p className="mt-7 max-w-md text-sm leading-relaxed text-cream/55">
            Create an account to reserve cars, manage bookings, and keep your
            details ready for the next trip.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-cream/40">
            <span>Zero deposit</span>
            <span className="h-1 w-1 rounded-full bg-accent" />
            <span>Digital KYC</span>
            <span className="h-1 w-1 rounded-full bg-accent" />
            <span>24/7 support</span>
          </div>
        </div>

        <div className="relative flex items-center justify-between border-t border-cream/10 pt-6 text-[11px] text-cream/35">
          <span>VirtuaCarz Operations</span>
          <span>{new Date().getFullYear()}</span>
        </div>
      </section>

      <section className="relative flex min-h-screen flex-col justify-center px-5 py-12 sm:px-10 lg:px-14 xl:px-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e7e4db_1px,transparent_1px)] [background-size:26px_26px] opacity-40 lg:hidden" />

        <div className="relative mx-auto w-full max-w-[440px]">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <Link to="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-white">
                <i className="fa-solid fa-car text-xs" aria-hidden="true" />
              </span>
              <div>
                <p className="text-base font-bold tracking-tight text-ink">
                  Virtua<span className="text-accent">Carz</span>
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-soft">
                  Self-drive studio
                </p>
              </div>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-accent" aria-hidden="true" />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
                Create an account
              </p>
            </div>

            <h2 className="mt-4 font-display text-4xl font-bold leading-[0.98] tracking-[-0.04em] text-ink sm:text-[2.75rem]">
              Start your engine<span className="text-accent">.</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-ink underline underline-offset-4 hover:text-accent"
              >
                Log in
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="mt-9 space-y-5">
              <div>
                <label
                  htmlFor="uname"
                  className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-ink-soft"
                >
                  Full name
                </label>
                <div className="relative">
                  <i
                    className="fa-regular fa-user pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs text-ink-soft"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    id="uname"
                    value={uname}
                    onChange={(event) => setUname(event.target.value)}
                    placeholder="Aditya Patkar"
                    autoComplete="name"
                    required
                    className="w-full rounded-md border border-line bg-white py-3.5 pl-10 pr-4 text-sm font-medium text-ink placeholder-ink-soft/70 outline-none transition-all duration-300 focus:border-ink focus:ring-1 focus:ring-ink/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-ink-soft"
                >
                  Email address
                </label>
                <div className="relative">
                  <i
                    className="fa-regular fa-envelope pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs text-ink-soft"
                    aria-hidden="true"
                  />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@example.com"
                    autoComplete="email"
                    required
                    className="w-full rounded-md border border-line bg-white py-3.5 pl-10 pr-4 text-sm font-medium text-ink placeholder-ink-soft/70 outline-none transition-all duration-300 focus:border-ink focus:ring-1 focus:ring-ink/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-ink-soft"
                >
                  Phone number
                </label>
                <div className="relative">
                  <i
                    className="fa-solid fa-phone pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs text-ink-soft"
                    aria-hidden="true"
                  />
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                    required
                    className="w-full rounded-md border border-line bg-white py-3.5 pl-10 pr-4 text-sm font-medium text-ink placeholder-ink-soft/70 outline-none transition-all duration-300 focus:border-ink focus:ring-1 focus:ring-ink/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-ink-soft"
                >
                  Password
                </label>
                <div className="relative">
                  <i
                    className="fa-solid fa-lock pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs text-ink-soft"
                    aria-hidden="true"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    required
                    className="w-full rounded-md border border-line bg-white py-3.5 pl-10 pr-12 text-sm font-medium text-ink placeholder-ink-soft/70 outline-none transition-all duration-300 focus:border-ink focus:ring-1 focus:ring-ink/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm p-1.5 text-ink-soft transition-colors duration-200 hover:text-ink"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <i
                      className={`fa-solid ${
                        showPassword ? "fa-eye-slash" : "fa-eye"
                      } text-xs`}
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-2.5 pt-1 text-[11px] leading-relaxed text-ink-soft">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(event) => setAgreeTerms(event.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded-sm border-line bg-white text-ink accent-ink focus:ring-0"
                />
                <span>
                  I agree to VirtuaCarz&apos;s{" "}
                  <span className="font-semibold text-ink underline underline-offset-2">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="font-semibold text-ink underline underline-offset-2">
                    Privacy Policy
                  </span>
                  .
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2.5 rounded-md bg-accent px-4 py-3.5 text-sm font-bold text-white transition-all duration-300 ease-editorial hover:bg-accent-deep active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    <span>Creating account…</span>
                  </>
                ) : (
                  <>
                    <span>Create account</span>
                    <i className="fa-solid fa-arrow-right text-[11px]" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-7 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-line" />
              </div>
              <span className="relative bg-cream px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-soft">
                Or register with
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSsoClick("Google")}
                className="flex items-center justify-center gap-2 rounded-md border border-line bg-white px-3 py-2.5 text-xs font-semibold text-ink transition-colors duration-200 hover:border-ink"
              >
                <i className="fa-brands fa-google" aria-hidden="true" />
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => handleSsoClick("Apple")}
                className="flex items-center justify-center gap-2 rounded-md border border-line bg-white px-3 py-2.5 text-xs font-semibold text-ink transition-colors duration-200 hover:border-ink"
              >
                <i className="fa-brands fa-apple" aria-hidden="true" />
                <span>Apple</span>
              </button>
            </div>

            <div className="mt-8 flex items-start gap-2.5 border-t border-line pt-5 text-[11px] leading-relaxed text-ink-soft">
              <i className="fa-solid fa-shield-halved mt-0.5 text-ink" aria-hidden="true" />
              <span>
                Your details are used only to verify your account and manage
                bookings.
              </span>
            </div>
          </motion.div>

          <footer className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] text-ink-soft">
            <Link to="/about" className="transition-colors hover:text-ink">
              About
            </Link>
            <Link to="/contact" className="transition-colors hover:text-ink">
              Support
            </Link>
            <a
              href="https://portfolio-site.adityapatkar81.workers.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-ink"
            >
              Developer
            </a>
            <span>Terms</span>
            <span>Privacy</span>
          </footer>
        </div>
      </section>
    </div>
  );
};

export default Register;
