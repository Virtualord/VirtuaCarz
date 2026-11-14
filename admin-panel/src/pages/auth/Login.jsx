import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, reset } from "../../store/authSlice";
import BrandMark from "../../components/BrandMark";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, success, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (success) {
      setEmail("");
      setPassword("");

      toast.success("Login Success");
      navigate("/");
    }

    if (error) {
      toast.error(error);
    }

    // Clear Redux status after handling it
    if (success || error) {
      dispatch(reset());
    }
  }, [dispatch, navigate, success, error]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Please provide all fields");
    }

    dispatch(login({ email, password }));
  };

  return (
    <div className="grid min-h-screen bg-cream text-ink lg:grid-cols-[1.05fr_0.95fr]">
      {/* Editorial panel */}
      <section className="relative hidden overflow-hidden bg-ink p-10 text-cream lg:flex lg:flex-col lg:justify-between xl:p-14">
        {/* Technical dot field */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(250,251,248,0.14)_1px,transparent_1px)] [background-size:26px_26px] opacity-40" />
        <div className="pointer-events-none absolute -right-40 top-1/3 h-[30rem] w-[30rem] rounded-full bg-accent/20 blur-[130px]" />

        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-white shadow-[0_8px_24px_-8px_rgba(250,82,15,0.65)]">
              <BrandMark className="h-4 w-4" />
            </span>
            <div>
              <p className="text-base font-bold tracking-tight text-cream">
                Virtua<span className="text-accent">Carz</span>
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-cream/40">
                Admin Studio
              </p>
            </div>
          </div>
        </div>

        <div className="relative max-w-xl py-16">
          <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.32em] text-accent">
            Fleet operations
          </p>
          <h1 className="font-display text-6xl font-bold leading-[0.94] tracking-[-0.045em] text-cream xl:text-7xl 2xl:text-[5.5rem]">
            Control
            <br />
            every mile
            <span className="text-accent">.</span>
          </h1>
          <p className="mt-7 max-w-md text-sm leading-relaxed text-cream/55">
            One quiet workspace for your fleet, your reservations, and the
            numbers that keep them moving.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-cream/40">
            <span>Fleet</span>
            <span className="h-1 w-1 rounded-full bg-accent" />
            <span>Bookings</span>
            <span className="h-1 w-1 rounded-full bg-accent" />
            <span>Revenue</span>
          </div>
        </div>

        <div className="relative flex items-center justify-between border-t border-cream/10 pt-6 text-[11px] text-cream/35">
          <span>VirtuaCarz Operations</span>
          <span>{new Date().getFullYear()}</span>
        </div>
      </section>

      {/* Sign-in panel */}
      <section className="relative flex min-h-screen flex-col justify-center px-5 py-12 sm:px-10 lg:px-14 xl:px-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e7e4db_1px,transparent_1px)] [background-size:26px_26px] opacity-40 lg:hidden" />

        <div className="relative mx-auto w-full max-w-[400px]">
          {/* Compact brand for small screens */}
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-white">
              <BrandMark className="h-4 w-4" />
            </span>
            <div>
              <p className="text-base font-bold tracking-tight text-ink">
                Virtua<span className="text-accent">Carz</span>
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-soft">
                Admin Studio
              </p>
            </div>
          </div>

          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">
            Admin access
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-[-0.03em] text-ink sm:text-[2.75rem]">
            Sign in to Studio
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Use your administrator credentials to manage the fleet, review
            reservations, and keep operations moving.
          </p>

          <form onSubmit={handleSubmit} className="mt-9 space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-ink-soft"
              >
                Email address
              </label>
              <div className="relative">
                <i className="fa-regular fa-envelope pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs text-ink-soft" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@virtuacarz.com"
                  autoComplete="email"
                  className="w-full rounded-md border border-line bg-white py-3.5 pl-10 pr-4 text-sm font-medium text-ink placeholder-ink-soft/70 outline-none transition-all duration-300 focus:border-ink focus:ring-1 focus:ring-ink/10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-[11px] font-bold uppercase tracking-[0.16em] text-ink-soft"
                >
                  Password
                </label>
                <span className="text-[11px] font-medium text-ink-soft/70">
                  Restricted
                </span>
              </div>
              <div className="relative">
                <i className="fa-solid fa-lock pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs text-ink-soft" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full rounded-md border border-line bg-white py-3.5 pl-10 pr-12 text-sm font-medium text-ink placeholder-ink-soft/70 outline-none transition-all duration-300 focus:border-ink focus:ring-1 focus:ring-ink/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm p-1.5 text-ink-soft transition-colors duration-200 hover:text-ink"
                >
                  <i
                    className={`fa-solid ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    } text-xs`}
                  />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2.5 rounded-md bg-accent px-4 py-3.5 text-sm font-bold text-white shadow-[0_16px_32px_-16px_rgba(250,82,15,0.7)] transition-all duration-300 ease-editorial hover:bg-accent-deep active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  <span>Signing in…</span>
                </>
              ) : (
                <>
                  <span>Enter Studio</span>
                  <i className="fa-solid fa-arrow-right text-[11px]" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-start gap-2.5 border-t border-line pt-5 text-[11px] leading-relaxed text-ink-soft">
            <i className="fa-solid fa-shield-halved mt-0.5 text-ink" />
            <span>
              Protected workspace. Access is limited to authorized VirtuaCarz
              administrators.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
