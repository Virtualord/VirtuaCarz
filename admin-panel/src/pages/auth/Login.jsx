import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, reset } from "../../store/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, success, error } = useSelector(
    (state) => state.auth
  );

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
    <div className="flex min-h-[90vh] items-center justify-center bg-[#212121] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#3f3f3f] bg-[#2f2f2f] p-8 shadow-lg">

        <h1 className="mb-2 text-center text-3xl font-semibold text-[#f5f5f5]">
          Admin Panel
        </h1>

        <p className="mb-8 text-center text-sm text-[#a3a3a3]">
          Login to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#ececec]"
            >
              Email Address
            </label>

            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-lg border border-[#525252] bg-[#171717] px-4 py-3 text-[#f5f5f5] outline-none placeholder:text-[#737373] focus:border-[#737373]"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#ececec]"
            >
              Password
            </label>

            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-[#525252] bg-[#171717] px-4 py-3 text-[#f5f5f5] outline-none placeholder:text-[#737373] focus:border-[#737373]"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#ececec] px-4 py-3 font-medium text-[#171717] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;
