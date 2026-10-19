import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminSidebar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // ================= MENU ITEMS =================
  const menuItems = [
        { title: "Dashbord", icon: "👤", path: "/onlineshopowerdashbord" },

    { title: "Product create", icon: "⚡", path: "/shoponwerallproduct" },
    { title: "Orders", icon: "🛒", path: "/shoponwerallorders" },
    { title: "Worker ", icon: "👷", path: "/AdminAllworker" },
  ];

  // ================= NAVIGATION =================
  const goToPage = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    const ok = window.confirm("Kya aap logout karna chahte hain?");
    if (!ok) return;

    // login ka saved data hata do
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();

    setMenuOpen(false);

    // login page par bhej do (back dabane par wapas na aaye)
    navigate("/", { replace: true });
  };

  return (
    <>
      {/* =====================================================
          MOBILE TOP HEADER
      ====================================================== */}
      <header className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-blue-500/30 bg-gradient-to-r from-black via-neutral-950 to-blue-950 px-4 py-3 text-stone-100 shadow-lg md:hidden">
        <div className="flex min-w-0 items-center gap-3">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.4)]">
            <img
              src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=300&q=80"
              alt="Bannu Online Services"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <h1 className="truncate font-serif text-sm font-bold tracking-wide">
              Bannu Online
            </h1>
            <p className="truncate text-[11px] text-blue-400">Shop Panel</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((previous) => !previous)}
          aria-label={menuOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={menuOpen}
          className="ml-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-400/40 bg-blue-900/30 text-2xl transition hover:bg-blue-800/60 active:scale-95"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </header>

      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}
      {menuOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
        />
      )}

      {/* =====================================================
          SIDEBAR
      ====================================================== */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex h-dvh w-[min(85vw,320px)] flex-col
          overflow-x-hidden overflow-y-auto overscroll-contain
          [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
          border-r border-blue-500/30
          bg-gradient-to-b from-black via-neutral-950 to-black
          font-serif text-stone-100
          shadow-[8px_0_40px_rgba(0,0,0,0.6)]
          transition-transform duration-300 ease-in-out
          md:sticky md:top-0 md:h-dvh md:w-72 md:shrink-0
          md:translate-x-0 md:transition-none lg:w-80
          ${menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* TOP LOGO SECTION */}
        <div className="border-b border-blue-500/30 px-5 py-6 sm:px-6 sm:py-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.4)] ring-4 ring-blue-500/10 sm:h-16 sm:w-16">
              <img
                src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=300&q=80"
                alt="Bannu Online Services"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-wider text-stone-50 sm:text-2xl">
                Bannu Online
              </h1>

              <h2 className="bg-gradient-to-r from-blue-300 via-blue-400 to-blue-600 bg-clip-text text-lg font-semibold italic text-transparent sm:text-xl">
                Services
              </h2>

              <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-blue-400/80">
                Plumbing & Electrical
              </p>
            </div>
          </div>

          <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-blue-400 to-transparent" />

          <p className="mt-4 text-xs italic leading-6 text-stone-400 sm:text-sm">
            Shop owner and manager dashboard for products, orders and bookings.
          </p>
        </div>

        {/* MENU SECTION */}
        <nav className="flex-1 px-4 py-6 sm:px-5 sm:py-7">
          <p className="mb-4 px-2 text-xs font-semibold uppercase tracking-[0.3em] text-blue-400">
            Shop Management
          </p>

          <div className="space-y-3">
            {menuItems.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => goToPage(item.path)}
                className="group flex w-full items-center gap-3 rounded-xl border border-blue-500/20 bg-gradient-to-r from-neutral-900 to-neutral-950 px-3 py-3 text-left transition-all duration-300 hover:border-blue-400 hover:from-blue-500/15 hover:to-neutral-900 hover:shadow-[0_0_20px_rgba(59,130,246,0.25)] sm:gap-4 sm:px-4 sm:py-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-blue-700 text-xl text-white shadow-md transition-transform duration-300 group-hover:scale-105 sm:h-11 sm:w-11">
                  {item.icon}
                </span>

                <span className="min-w-0 flex-1 text-sm font-semibold tracking-wide text-stone-200 transition-colors duration-300 group-hover:text-blue-300 sm:text-base">
                  {item.title}
                </span>
              </button>
            ))}
          </div>
        </nav>

        {/* LOGOUT SECTION */}
        <div className="mt-auto px-4 pb-5 sm:px-5">
          <div className="border-t border-blue-500/30 pt-5">
            <button
              type="button"
onClick={() => navigate("/Home")}              className="group flex w-full items-center justify-center gap-3 rounded-xl border border-red-500/30 bg-gradient-to-r from-neutral-900 to-neutral-950 px-4 py-3 transition-all duration-300 hover:border-red-500 hover:from-red-800 hover:to-red-700 hover:shadow-[0_0_20px_rgba(239,68,68,0.35)] sm:py-4"
            >
              <span className="text-xl">🚪</span>
              <span className="text-sm font-semibold uppercase tracking-widest text-red-400 transition-colors duration-300 group-hover:text-white">
                Logout
              </span>
            </button>

            <p className="mt-5 text-center text-[10px] uppercase tracking-[0.2em] text-stone-500">
              © 2026 Bannu Online Services
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;