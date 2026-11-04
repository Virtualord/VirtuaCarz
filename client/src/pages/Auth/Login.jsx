import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { login } from "../../store/features/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please provide your email and password");
      return;
    }

    try {
      await dispatch(
        login({
          email: email.trim(),
          password,
        })
      ).unwrap();

      setEmail("");
      setPassword("");
      toast.success("Login successful!");
      navigate("/cars");
    } catch (error) {
      toast.error(error || "Login failed. Please check your credentials.");
    }
  };

  const handleSsoClick = (provider) => {
    toast(`Single Sign-On with ${provider} is in preview mode.`, {
      icon: "✦",
      style: {
        background: "#18181b",
        color: "#fbfbf8",
        border: "1px solid #e5e5e5",
      },
    });
  };

  return (
    <section className="relative flex min-h-[90vh] flex-col justify-between bg-cream px-4 py-12 text-ink selection:bg-ink selection:text-cream sm:px-6">
      
      {/* Subtle technical grid background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e7e4db_1px,transparent_1px)] [background-size:24px_24px] opacity-50" />

      {/* Main Centered Auth Container */}
      <div className="relative mx-auto w-full max-w-[440px]">
        
        {/* Brand Header */}
        <div className="mb-10 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 text-xl font-bold tracking-tight text-ink transition-opacity duration-200 hover:opacity-80"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-white shadow-[0_8px_20px_-8px_rgba(250,82,15,0.6)]">
              <i className="fa-solid fa-car text-xs" />
            </span>
            <span>
              Virtua<span className="text-accent">Carz</span>
            </span>
          </Link>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Welcome back
          </h1>
          <p className="mt-3 text-sm text-ink-soft">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-ink underline underline-offset-4 hover:text-accent"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-md border border-line bg-white p-6 shadow-[0_24px_60px_-32px_rgba(24,24,27,0.25)] sm:p-8"
        >
          
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Field */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink-soft">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
                required
                className="w-full rounded-md border border-line bg-cream px-4 py-3 text-sm font-medium text-ink placeholder-ink-soft outline-none transition-colors duration-200 focus:border-ink"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => toast("Contact support to reset your credentials.", { icon: "🔒" })}
                  className="text-xs font-medium text-ink-soft transition-colors duration-200 hover:text-ink"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-md border border-line bg-cream px-4 py-3 pr-11 text-sm font-medium text-ink placeholder-ink-soft outline-none transition-colors duration-200 focus:border-ink"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft transition-colors duration-200 hover:text-ink"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <i className="fa-solid fa-eye-slash" />
                  ) : (
                    <i className="fa-solid fa-eye" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-ink-soft">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded-sm border-line bg-white text-ink accent-ink focus:ring-0"
                />
                <span>Remember this device</span>
              </label>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-accent py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-accent-deep hover:shadow-[0_12px_28px_-12px_rgba(250,82,15,0.6)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Log in</span>
              )}
            </button>

          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-line" />
            </div>
            <span className="relative bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-ink-soft">
              Or continue with
            </span>
          </div>

          {/* SSO Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSsoClick("Google")}
              className="flex items-center justify-center gap-2 rounded-md border border-line bg-cream px-3 py-2.5 text-xs font-semibold text-ink transition-colors duration-200 hover:border-ink hover:bg-white"
            >
              <i className="fa-brands fa-google" />
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSsoClick("Apple")}
              className="flex items-center justify-center gap-2 rounded-md border border-line bg-cream px-3 py-2.5 text-xs font-semibold text-ink transition-colors duration-200 hover:border-ink hover:bg-white"
            >
              <i className="fa-brands fa-apple" />
              <span>Apple</span>
            </button>
          </div>

          {/* Single Sign-On Link */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => handleSsoClick("Corporate SSO")}
              className="text-xs font-medium text-ink-soft transition-colors duration-200 hover:text-ink hover:underline"
            >
              Log in with Single Sign-On (SSO)
            </button>
          </div>

        </motion.div>

        {/* Security Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-ink-soft">
          <i className="fa-solid fa-shield-halved text-[13px] text-ink" />
          <span>Protected by Enterprise Security & Zero-Trust Session</span>
        </div>

      </div>

      {/* Auth Footer */}
      <footer className="relative mt-8 text-center text-xs text-ink-soft">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link to="/about" className="transition-colors duration-200 hover:text-ink">
            About
          </Link>
          <Link to="/contact" className="transition-colors duration-200 hover:text-ink">
            Support
          </Link>
          <a
            href="https://portfolio-site.adityapatkar81.workers.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:text-ink"
          >
            Developer
          </a>
          <span>Terms</span>
          <span>Privacy</span>
        </div>
        <p className="mt-3 text-[11px] text-ink-soft/70">
          © {new Date().getFullYear()} VirtuaCarz. All rights reserved.
        </p>
      </footer>

    </section>
  );
};

export default Login;
