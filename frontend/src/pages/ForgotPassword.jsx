import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import logo from "../assets/apapa-logo.png";
import { forgotPassword } from "../lib/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const {mutate, isPending, isSuccess, error,} = useMutation({
    mutationFn: forgotPassword,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(email);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-primary/5 px-4">

      <div className="w-full max-w-md">

        {/* LOGO */}
        <Link to="/" className="flex flex-col items-center mb-8">
          <img
            src={logo}
            alt="Apapa"
            className="w-32 h-32 object-contain"
          />
        </Link>

        {/* CARD */}
        <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,2,110,0.08)] p-8">

          <h2 className="text-2xl font-bold text-primary text-center">
            Forgot Password
          </h2>

          <p className="text-sm text-gray-500 text-center mt-1 mb-6">
            Enter your email and we'll send you a reset link.
          </p>

          {/* SUCCESS MESSAGE */}
          {isSuccess && (
            <div className="mb-4 text-green-600 text-sm text-center">
              Reset link sent to your email ✔
            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-4 text-red-500 text-sm text-center">
              {error.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-2 py-3 rounded-full bg-primary text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {isPending ? "Sending..." : "Send Reset Link"}
            </button>

          </form>

          {/* BACK */}
          <p className="text-sm text-center text-gray-500 mt-6">
            Remember your password?{" "}
            <Link
              to="/signin"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>

        </div>

      </div>
    </main>
  );
};

export default ForgotPassword;