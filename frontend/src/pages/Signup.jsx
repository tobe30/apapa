import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/apapa-logo.png";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api";
import toast from "react-hot-toast";


const Signup = () => {
    const [registerData, setRegisterData] = useState({
        name: "",
        email: "",
        password: ""
    });


const queryClient = useQueryClient();
const navigate = useNavigate();


 const { mutate:registerMutation, isPending, error} = useMutation({
    mutationFn: signup,
   onSuccess: () => {
			toast.success("Account created successfully");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
     		navigate("/feed"); // Redirect to the home page
		}
  });

    const handleSignup = (e) => {
    e.preventDefault();
    registerMutation(registerData);
  };

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
            Create account
          </h2>

          <p className="text-sm text-gray-500 text-center mt-1 mb-6">
            Join Apapa in seconds
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

          <form onSubmit={handleSignup} className="space-y-4">

            {/* USERNAME */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                value={registerData.name}
                onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                placeholder="John Doe"
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
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
                value={registerData.password}
                onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                placeholder="••••••••"
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-2 py-3 rounded-full bg-primary text-white font-semibold hover:opacity-90 transition"
            >
              {isPending ? "Creating account..." : "Create account"}
            </button>

          </form>

          {/* SIGN IN LINK */}
          <p className="text-sm text-center text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>

        </div>

      </div>
    </main>
  );
};

export default Signup;