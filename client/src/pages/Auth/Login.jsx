import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
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
        background: "#262626",
        color: "#ececec",
        border: "1px solid #3f3f3f",
      },
    });
  };

  return (
    <div className="relative flex min-h-[90vh] flex-col justify-between bg-[#141414] px-4 py-12 text-[#ececec] selection:bg-[#3f3f3f] selection:text-white sm:px-6">
      
      {/* Subtle Cloudflare-Style Tech Grid Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#2d2d2d_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

      {/* Main Centered Auth Container */}
      <div className="relative mx-auto w-full max-w-[440px]">
        
        {/* Brand Header */}
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 text-xl font-bold tracking-tight text-white transition hover:opacity-80"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#3f3f3f] bg-[#212121] text-lg text-white shadow-md">
              <i className="fa-solid fa-car" />
            </span>
            <span className="text-xl tracking-tight">VirtuaCarz</span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Log in to VirtuaCarz
          </h1>
          <p className="mt-2 text-xs text-[#a3a3a3] sm:text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-white underline underline-offset-4 hover:text-[#b4b4b4]"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Cloudflare-Style Card */}
        <div className="rounded-2xl border border-[#333333] bg-[#1e1e1e] p-6 shadow-2xl backdrop-blur-sm sm:p-8">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#a3a3a3]">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-lg border border-[#3f3f3f] bg-[#141414] px-3.5 py-2.5 text-sm text-[#ececec] placeholder-[#666666] outline-none transition duration-150 focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec]/20"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#a3a3a3]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => toast("Contact support to reset your credentials.", { icon: "🔒" })}
                  className="text-xs text-[#888888] hover:text-[#ececec] hover:underline"
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
                  className="w-full rounded-lg border border-[#3f3f3f] bg-[#141414] px-3.5 py-2.5 pr-10 text-sm text-[#ececec] placeholder-[#666666] outline-none transition duration-150 focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-sm text-[#737373] hover:text-[#ececec]"
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
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#b4b4b4]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-[#3f3f3f] bg-[#141414] text-white focus:ring-0"
                />
                <span>Remember this device</span>
              </label>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#ececec] py-2.5 text-sm font-bold text-[#141414] transition duration-150 hover:bg-white active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#141414] border-t-transparent" />
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
              <div className="w-full border-t border-[#333333]" />
            </div>
            <span className="relative bg-[#1e1e1e] px-3 text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
              Or continue with
            </span>
          </div>

          {/* Cloudflare-Style SSO Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSsoClick("Google")}
              className="flex items-center justify-center gap-2 rounded-lg border border-[#383838] bg-[#171717] px-3 py-2 text-xs font-semibold text-[#b4b4b4] transition hover:border-[#525252] hover:bg-[#222222] hover:text-white"
            >
              <i className="fa-brands fa-google" />
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSsoClick("Apple")}
              className="flex items-center justify-center gap-2 rounded-lg border border-[#383838] bg-[#171717] px-3 py-2 text-xs font-semibold text-[#b4b4b4] transition hover:border-[#525252] hover:bg-[#222222] hover:text-white"
            >
              <i className="fa-brands fa-apple" />
              <span>Apple</span>
            </button>
          </div>

          {/* Cloudflare-Style Single Sign-On Link */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => handleSsoClick("Corporate SSO")}
              className="text-xs text-[#888888] transition hover:text-white hover:underline"
            >
              Log in with Single Sign-On (SSO)
            </button>
          </div>

        </div>

        {/* Cloudflare Security Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-[#737373]">
          <i className="fa-solid fa-shield-halved text-[13px] text-[#a3a3a3]" />
          <span>Protected by Enterprise Security & Zero-Trust Session</span>
        </div>

      </div>

      {/* Cloudflare-Style Minimal Footer */}
      <footer className="relative mt-8 text-center text-xs text-[#666666]">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link to="/about" className="hover:text-[#a3a3a3]">
            About
          </Link>
          <Link to="/contact" className="hover:text-[#a3a3a3]">
            Support
          </Link>
          <a
            href="https://portfolio-site.adityapatkar81.workers.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#a3a3a3]"
          >
            Developer
          </a>
          <span>Terms</span>
          <span>Privacy</span>
        </div>
        <p className="mt-3 text-[11px] text-[#555555]">
          © {new Date().getFullYear()} VirtuaCarz. All rights reserved.
        </p>
      </footer>

    </div>
  );
};

export default Login;
