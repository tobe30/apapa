import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/apapa-logo.png";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../lib/api";

const Signin = () => {
  const [loginData, setLoginData] = useState({
        email: "",
        password:""
    });


 const queryClient = useQueryClient();
    const navigate = useNavigate()

    const {mutate:loginMutation, isPending, error} = useMutation({
        mutationFn: login,
        onSuccess: async () => {
        await queryClient.invalidateQueries({queryKey: ['authUser']});
        navigate('/');
}

    })

    const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
   }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-primary/5 px-4">

      <div className="w-full max-w-md">

        {/* LOGO */}
        <Link to="/" className="flex flex-col items-center mb-8">
          <img src={logo} alt="Apapa" className="w-32 h-32 object-contain" />
        </Link>

        {/* CARD */}
        <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,2,110,0.08)] p-8">

          <h2 className="text-2xl font-bold text-primary text-center">
            Welcome back
          </h2>

          <p className="text-sm text-gray-500 text-center mt-1 mb-6">
            Sign in to continue exploring
          </p>

          {error && (
            <div className="mb-4 rounded-lg border border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
              <span className="font-medium">Error: </span>
              {error?.response?.data?.error ||
                error?.response?.data?.message ||
                error.message ||
                "Something went wrong. Please try again."}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                placeholder="you@example.com"
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                placeholder="••••••••"
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex justify-end">
  <Link
    to="/forgot-password"
    className="text-sm text-primary hover:underline"
  >
    Forgot password?
  </Link>
</div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-2 py-3 rounded-full bg-primary text-white font-semibold hover:opacity-90 transition"
            >
              {isPending ? "Signing in..." : "Sign in"}
            </button>

          </form>

          {/* SIGN UP */}
          <p className="text-sm text-center text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>

        </div>

      </div>
    </main>
  );
};

export default Signin;