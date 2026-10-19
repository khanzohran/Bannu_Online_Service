import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Admin2ndsidebar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    {
      title: "Dashboard",
      icon: "⌂",
      path: "/Admindashbord",
    },
    {
      title: "Products",
      icon: "▦",
      path: "/AdminAllproduct",
    },
    {
      title: "Orders",
      icon: "🛒",
      path: "/AdminAllorder",
    },
    {
      title: "Shops",
      icon: "▣",
      path: "/Adminshop",
    },
  ];

  const goToPage = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* MOBILE TOP HEADER */}
      <header className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-blue-500/30 bg-gradient-to-r from-black via-slate-950 to-blue-950 px-4 py-3 text-white shadow-lg md:hidden">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/50 bg-gradient-to-br from-blue-400 to-blue-800 text-2xl shadow-lg">
            ♛
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold tracking-wide">
              BANNU ONLINE
            </h1>

            <p className="text-xs text-blue-400">Admin Panel</p>
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

      {/* MOBILE OVERLAY */}
      {menuOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex h-dvh w-[min(85vw,300px)] flex-col
          overflow-x-hidden overflow-y-auto overscroll-contain
          [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
          border-r border-blue-500/30
          bg-gradient-to-b from-black via-slate-950 to-blue-950
          font-serif text-white shadow-2xl
          transition-transform duration-300 ease-in-out
          md:sticky md:top-0 md:h-dvh md:w-72 md:shrink-0
          md:translate-x-0 md:transition-none
          ${
            menuOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        {/* BRAND */}
        <div className="border-b border-blue-500/30 px-5 py-6 sm:px-6 sm:py-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-400/50 bg-gradient-to-br from-blue-400 to-blue-800 text-3xl shadow-[0_0_25px_rgba(59,130,246,0.3)] sm:h-14 sm:w-14">
              ♛
            </div>

            <div className="min-w-0">
              <h1 className="text-base font-bold tracking-wide sm:text-xl">
                BANNU ONLINE
              </h1>

              <h2 className="mt-1 text-base font-semibold italic text-blue-400 sm:text-lg">
                Services
              </h2>

              <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-blue-300/70">
                Admin Panel
              </p>
            </div>
          </div>

          <div className="mt-5 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />

          <p className="mt-4 text-xs italic leading-6 text-slate-400 sm:text-sm">
            Manage your products, orders, shops and users from one place.
          </p>
        </div>

        {/* NAVIGATION MENU */}
        <nav className="flex-1 space-y-3 px-4 py-6 sm:px-5 sm:py-7">
          <p className="mb-4 px-2 text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400">
            Main Menu
          </p>

          {menuItems.map((item, index) => (
            <button
              key={item.title}
              type="button"
              onClick={() => goToPage(item.path)}
              className={`group flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all duration-200 sm:gap-4 sm:px-4 sm:py-4 ${
                index === 0
                  ? "border-blue-400/50 bg-gradient-to-r from-blue-600/20 to-blue-900/10 shadow-[0_0_15px_rgba(59,130,246,0.08)]"
                  : "border-blue-500/20 bg-gradient-to-r from-neutral-900 to-slate-950 hover:border-blue-400 hover:bg-blue-900/30"
              }`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-700 text-xl text-white shadow-md transition-transform duration-200 group-hover:scale-105 sm:h-11 sm:w-11">
                {item.icon}
              </span>

              <span className="min-w-0 flex-1 text-sm font-semibold tracking-wide text-slate-200 group-hover:text-blue-300">
                {item.title}
              </span>

              <span className="text-lg text-slate-500 transition group-hover:translate-x-1 group-hover:text-blue-400">
                ›
              </span>
            </button>
          ))}

          {/* USERS */}
          <button
            type="button"
            onClick={() => goToPage("/AdminUsers")}
            className="group flex w-full items-center gap-3 rounded-xl border border-blue-500/20 bg-gradient-to-r from-neutral-900 to-slate-950 px-3 py-3 text-left transition-all duration-200 hover:border-blue-400 hover:bg-blue-900/30 sm:gap-4 sm:px-4 sm:py-4"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-700 text-xl shadow-md sm:h-11 sm:w-11">
              ♙
            </span>

            <span className="min-w-0 flex-1 text-sm font-semibold tracking-wide text-slate-200 group-hover:text-blue-300">
              Users
            </span>

            <span className="text-lg text-slate-500 group-hover:text-blue-400">
              ›
            </span>
          </button>
        </nav>

        {/* ADMIN PROFILE + LOGOUT */}
        <div className="mt-auto border-t border-blue-500/30 px-4 py-5 sm:px-5">
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-blue-500/20 bg-white/[0.03] p-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-blue-400/50 bg-gradient-to-br from-blue-400 to-blue-800 text-lg font-bold shadow-lg">
              A
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold">
                Administrator
              </p>

              <p className="mt-1 text-xs text-blue-400">
                Control Panel
              </p>
            </div>

            <span className="ml-auto h-2.5 w-2.5 shrink-0 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
          </div>

          {/* LOGOUT */}
          <button
            type="button"
            onClick={() => goToPage("/Login")}
            className="group flex w-full items-center justify-center gap-3 rounded-xl border border-red-500/30 bg-gradient-to-r from-neutral-900 to-slate-950 px-4 py-3 transition-all duration-200 hover:border-red-400 hover:from-red-950 hover:to-red-900 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] sm:py-4"
          >
            <span className="text-xl transition-transform group-hover:scale-110">
              ↪
            </span>

            <span className="text-sm font-bold uppercase tracking-[0.2em] text-red-400 group-hover:text-white">
              Logout
            </span>
          </button>

          <p className="mt-4 text-center text-[9px] uppercase tracking-[0.15em] text-slate-500">
            © 2026 Bannu Online Services
          </p>
        </div>
      </aside>
    </>
  );
};

export default Admin2ndsidebar;