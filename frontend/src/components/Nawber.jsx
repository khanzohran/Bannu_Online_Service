import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  let navigate = useNavigate();

  // Desktop menu link style (sab links ke liye same)
  const linkClass = `
    relative px-4 py-2
    font-serif font-semibold tracking-widest uppercase text-xs
    text-blue-100
    hover:text-white
    transition-all duration-300
    after:content-[''] after:absolute after:left-1/2 after:-bottom-1
    after:h-[2px] after:w-0 after:-translate-x-1/2
    after:rounded-full after:bg-gradient-to-r after:from-white after:to-blue-300
    after:transition-all after:duration-500
    hover:after:w-full
  `;

  // Mobile menu link style
  const mobileLinkClass = `
    px-4 py-2
    font-serif text-xs font-semibold tracking-widest uppercase
    text-blue-100
    hover:text-white
    transition-colors duration-300
  `;

  return (
    <header className="w-full bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 border-b border-blue-300/30 shadow-lg shadow-blue-900/30 font-serif">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-24 flex items-center justify-between">
          {/* Logo + Name */}
          <div className="flex items-center gap-3">
            {/* Small Logo Icon */}
            <div className="flex items-center justify-center w-14 h-14 rounded-full border-2 border-blue-300 ring-4 ring-white/10 shadow-[0_0_25px_rgba(147,197,253,0.4)] bg-blue-950">
              <svg
                width="40"
                height="40"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* House */}
                <path
                  d="M7 22L24 8L41 22"
                  stroke="#93C5FD"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M11 20V39H37V20"
                  stroke="#F5F5F4"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />

                {/* Wrench */}
                <path
                  d="M17 28L25 36"
                  stroke="#93C5FD"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                <path
                  d="M17 25C15 23 15 20 17 18L20 21L23 18C25 20 25 23 23 25C21 27 19 27 17 25Z"
                  fill="#93C5FD"
                />

                {/* Door */}
                <path d="M28 29H33V39H28V29Z" fill="#F5F5F4" />

                {/* Lightning */}
                <path
                  d="M31 16L27 23H31L28 29L37 20H33L36 16H31Z"
                  fill="#F59E0B"
                />
              </svg>
            </div>

            {/* Name */}
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-wider text-white">
                Bannu Online Services
              </h1>

              <p className="text-[10px] md:text-xs font-semibold italic tracking-[0.3em] uppercase text-blue-200">
                Plumbing & Electrical
              </p>
            </div>
          </div>

          {/* Menu Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            <button onClick={() => navigate("/Home")} className={linkClass}>
              Home
            </button>

            <button onClick={() => navigate("/Shop")} className={linkClass}>
              Shop
            </button>

            <button onClick={() => navigate("/booking")} className={linkClass}>
              Booking
            </button>

            <button onClick={() => navigate("/About")} className={linkClass}>
              About Us
            </button>

            <button onClick={() => navigate("/Contact")} className={linkClass}>
              Contact
            </button>
          </div>

          {/* Login / Signup */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="
                hidden sm:block
                px-6 py-2.5
                rounded-xl
                border border-blue-300/50
                bg-white/5
                font-serif font-semibold text-xs tracking-widest uppercase
                text-white
                hover:bg-white/15
                hover:border-white
                transition-all duration-300
              "
            >
              Login
            </button>

            <button
              onClick={() => navigate("/SiginUp")}
              className="
                px-6 py-2.5
                rounded-xl
                bg-white
                font-serif font-semibold text-xs tracking-widest uppercase
                text-blue-900
                shadow-lg shadow-blue-950/40
                hover:bg-blue-50
                hover:shadow-xl
                transition-all duration-300
              "
            >
              Signup
            </button>
          </div>
        </div>

        {/* Divider (mobile) */}
        <div className="lg:hidden h-px w-full bg-gradient-to-r from-transparent via-blue-300/60 to-transparent" />

        {/* Mobile Buttons */}
        <div className="lg:hidden py-3 flex flex-wrap justify-center gap-1">
          <button onClick={() => navigate("/")} className={mobileLinkClass}>
            Home
          </button>

          <button
            onClick={() => navigate("/booking")}
            className={mobileLinkClass}
          >
            Booking
          </button>

          <button onClick={() => navigate("/Shop")} className={mobileLinkClass}>
            Shop
          </button>

          <button onClick={() => navigate("/About")} className={mobileLinkClass}>
            About Us
          </button>

          <button
            onClick={() => navigate("/Contact")}
            className={mobileLinkClass}
          >
            Contact
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;