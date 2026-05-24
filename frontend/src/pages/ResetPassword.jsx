import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import logo from "../assets/apapa-logo.png";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../lib/api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });


  const { mutate, isPending, isSuccess, error } = useMutation({
  mutationFn: resetPassword,
  onSuccess: () => {
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  },
});

const handleSubmit = (e) => {
  e.preventDefault();

  if (passwords.password !== passwords.confirmPassword) {
    return alert("Passwords do not match");
  }

  mutate({
    token,
    password: passwords.password,
  });
};

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-primary/5 px-4">

      <div className="w-full max-w-md">

        <Link to="/" className="flex justify-center mb-8">
          <img
            src={logo}
            alt="Apapa"
            className="w-32 h-32 object-contain"
          />
        </Link>

        <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,2,110,0.08)] p-8">

          <h2 className="text-2xl font-bold text-primary text-center">
            Reset Password
          </h2>

          <p className="text-sm text-gray-500 text-center mt-1 mb-6">
            Enter your new password
          </p>

          {error && (
  <p className="text-red-500 text-sm text-center mb-3">
    {error.message}
  </p>
)}

{isSuccess && (
  <p className="text-green-600 text-sm text-center mb-3">
    Password reset successful. Redirecting...
  </p>
)}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="text-sm font-medium text-gray-700">
                New Password
              </label>

              <input
                type="password"
                value={passwords.password}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    password: e.target.value,
                  })
                }
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>

              <input
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200"
              />
            </div>

<button
  type="submit"
  disabled={isPending}
  className="w-full py-3 rounded-full bg-primary text-white font-semibold disabled:opacity-50"
>
  {isPending ? "Resetting..." : "Reset Password"}
</button>
          </form>

        </div>
      </div>
    </main>
  );
};

export default ResetPassword;