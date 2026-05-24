import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import logo from "../assets/apapa-logo.png";
import { getAuthUser } from "../lib/api";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ CHECK AUTH USER
  const { data: authData } = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
  });

  const isLoggedIn = !!authData?.user;

  const links = [
    { href: "#places", label: "Places" },
    { href: "#questions", label: "Questions" },
    { href: "#how", label: "How it works" },
    { href: "#why", label: "Why Apapa" },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-b border-black/5">
      <div className="w-full px-4 sm:px-8">
        <nav className="h-20 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Apapa logo"
              className="h-28 w-auto object-contain"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 text-base font-bold text-primary">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="hover:text-foreground transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-2">

            {/* ✅ SHOW SIGN IN ONLY WHEN LOGGED OUT */}
            {!isLoggedIn && (
              <button
                onClick={() => navigate("/login")}
                className="px-3 py-1.5 text-sm rounded-md hover:bg-gray-100 transition-colors"
              >
                Sign in
              </button>
            )}

            {/* ✅ CHANGE BUTTON WHEN LOGGED IN */}
            <button
              onClick={() =>
                navigate(isLoggedIn ? "/feed" : "/register")
              }
              className="px-4 py-2 text-sm rounded-full bg-primary text-white hover:opacity-90 shadow"
            >
              {isLoggedIn ? "Go to Feed" : "Get started"}
            </button>

          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-colors"
          >
            {open ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white">
          <div className="px-4 py-4 flex flex-col gap-1">

            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                {l.label}
              </a>
            ))}

            <div className="flex flex-col gap-2 pt-3 mt-2">

              {/* ✅ MOBILE SIGN IN */}
              {!isLoggedIn && (
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/login");
                  }}
                  className="w-full py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                >
                  Sign in
                </button>
              )}

              {/* ✅ MOBILE CTA */}
              <button
                onClick={() => {
                  setOpen(false);
                  navigate(isLoggedIn ? "/feed" : "/register");
                }}
                className="w-full py-2 text-sm rounded-full bg-primary text-white hover:opacity-90 shadow"
              >
                {isLoggedIn ? "Go to Feed" : "Get started"}
              </button>

            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;