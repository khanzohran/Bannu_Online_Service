
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Nawber";

function Shop() {
  return (
    <div className="min-h-screen bg-white font-serif text-blue-950">
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800">
        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-8">
          <div className="relative z-10 max-w-3xl">
            <p className="mb-6 flex items-center gap-3 text-sm font-medium uppercase tracking-[0.35em] text-blue-200">
              <span className="h-px w-10 bg-blue-200"></span>
              Bannu Online Services
            </p>

            <h1 className="text-5xl font-semibold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
              Premium
              <span className="block italic text-blue-200">
                Electrical & Plumbing Shop
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-blue-100 sm:text-lg">
              Discover quality electrical and plumbing products designed
              for homes, businesses and professional projects.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#categories"
                className="rounded-full bg-white px-8 py-3.5 text-center text-xs font-semibold uppercase tracking-widest text-blue-900 shadow-lg shadow-blue-950/30 transition-all duration-300 hover:bg-blue-50 hover:shadow-xl"
              >
                Explore Products
              </a>

              <a
                href="#categories"
                className="rounded-full border border-white/40 px-8 py-3.5 text-center text-xs font-semibold uppercase tracking-widest text-white transition-all duration-300 hover:border-white hover:bg-white/10"
              >
                View Categories
              </a>
            </div>
          </div>
        </div>

        {/* Decorative Circles */}
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-2xl"></div>

        <div className="absolute -bottom-40 right-40 h-96 w-96 rounded-full bg-blue-400/10 blur-2xl"></div>
      </section>

      {/* ================= SHOP CATEGORIES ================= */}
      <section id="categories" className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-700">
              Shop Categories
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-wide text-blue-950 sm:text-4xl">
              Everything You Need
            </h2>

            <div className="mx-auto mt-5 h-px w-32 bg-gradient-to-r from-transparent via-blue-700 to-transparent"></div>

            <p className="mx-auto mt-5 max-w-2xl italic text-slate-600">
              Shop premium products from our electrical and plumbing
              collections.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {/* ELECTRICAL CARD */}
            <div className="group relative min-h-[360px] overflow-hidden rounded-3xl border border-blue-800 bg-gradient-to-br from-blue-950 to-blue-800 p-8 shadow-2xl shadow-blue-950/20 transition-all duration-500 hover:-translate-y-1 hover:shadow-blue-900/40">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-xl"></div>

              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-xl transition-transform duration-300 group-hover:scale-105">
                    ⚡
                  </div>

                  <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
                    Electrical Collection
                  </p>

                  <h3 className="mt-2 text-3xl font-semibold tracking-wide text-white">
                    Electrician Shop
                  </h3>

                  <p className="mt-4 max-w-md italic leading-7 text-blue-100">
                    Wires, switches, bulbs, electrical accessories and
                    professional equipment.
                  </p>
                </div>

                <Link
                  to="/ElectricalShop"
                  className="mt-8 w-fit rounded-full bg-white px-8 py-3.5 text-center text-xs font-semibold uppercase tracking-widest text-blue-900 shadow-lg shadow-blue-950/30 transition-all duration-300 hover:bg-blue-50 hover:shadow-xl"
                >
                  Shop Electrical →
                </Link>
              </div>
            </div>

            {/* PLUMBING CARD */}
            <div className="group relative min-h-[360px] overflow-hidden rounded-3xl border border-blue-800 bg-gradient-to-br from-blue-800 to-blue-950 p-8 shadow-2xl shadow-blue-950/20 transition-all duration-500 hover:-translate-y-1 hover:shadow-blue-900/40">
              <div className="absolute -bottom-20 -right-10 h-56 w-56 rounded-full bg-white/10 blur-xl"></div>

              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-xl transition-transform duration-300 group-hover:scale-105">
                    🔧
                  </div>

                  <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
                    Plumbing Collection
                  </p>

                  <h3 className="mt-2 text-3xl font-semibold tracking-wide text-white">
                    Plumber Shop
                  </h3>

                  <p className="mt-4 max-w-md italic leading-7 text-blue-100">
                    Premium taps, pipes, shower sets, fittings and plumbing
                    accessories.
                  </p>
                </div>

                <Link
                  to="/PlumbingShop"
                  className="mt-8 w-fit rounded-full bg-white px-8 py-3.5 text-center text-xs font-semibold uppercase tracking-widest text-blue-900 shadow-lg shadow-blue-950/30 transition-all duration-300 hover:bg-blue-50 hover:shadow-xl"
                >
                  Shop Plumbing →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TRUST SECTION ================= */}
      <section className="border-t border-blue-100 bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {/* QUALITY PRODUCTS */}
            <div className="group rounded-2xl border border-blue-800 bg-gradient-to-br from-blue-900 to-blue-950 p-7 text-center shadow-lg shadow-blue-950/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/30">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-white text-2xl text-blue-900 shadow-md transition-transform duration-300 group-hover:scale-105">
                ✓
              </div>

              <h3 className="mt-5 font-semibold tracking-wide text-white">
                Quality Products
              </h3>

              <p className="mt-2 text-sm italic text-blue-200">
                Products selected for reliable use.
              </p>
            </div>

            {/* EASY ORDERING */}
            <div className="group rounded-2xl border border-blue-800 bg-gradient-to-br from-blue-900 to-blue-950 p-7 text-center shadow-lg shadow-blue-950/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/30">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-white text-2xl shadow-md transition-transform duration-300 group-hover:scale-105">
                🚚
              </div>

              <h3 className="mt-5 font-semibold tracking-wide text-white">
                Easy Ordering
              </h3>

              <p className="mt-2 text-sm italic text-blue-200">
                Simple and convenient shopping.
              </p>
            </div>

            {/* SECURE SHOPPING */}
            <div className="group rounded-2xl border border-blue-800 bg-gradient-to-br from-blue-900 to-blue-950 p-7 text-center shadow-lg shadow-blue-950/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/30">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-white text-2xl shadow-md transition-transform duration-300 group-hover:scale-105">
                🔒
              </div>

              <h3 className="mt-5 font-semibold tracking-wide text-white">
                Secure Shopping
              </h3>

              <p className="mt-2 text-sm italic text-blue-200">
                A professional shopping experience.
              </p>
            </div>

            {/* CUSTOMER SUPPORT */}
            <div className="group rounded-2xl border border-blue-800 bg-gradient-to-br from-blue-900 to-blue-950 p-7 text-center shadow-lg shadow-blue-950/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/30">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-white text-2xl shadow-md transition-transform duration-300 group-hover:scale-105">
                📞
              </div>

              <h3 className="mt-5 font-semibold tracking-wide text-white">
                Customer Support
              </h3>

              <p className="mt-2 text-sm italic text-blue-200">
                Support when you need assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#080F1E] font-serif text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-4">
          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#2563EB] text-2xl font-semibold text-[#93B8FF]">
                B
              </div>

              <div>
                <h3 className="font-bold">Bannu Online Services</h3>

                <p className="mt-1 text-xs text-slate-400">
                  Plumbing & Electrical
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-xs text-sm leading-7 text-slate-400">
              Plumbing, electrical services and hardware products for homes
              in Bannu.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="font-bold">Quick links</h3>

            <div className="mt-5 space-y-3 text-sm text-slate-400">
              <Link
                to="/"
                className="block transition hover:text-[#93B8FF]"
              >
                Home
              </Link>

              <Link
                to="/booking"
                className="block transition hover:text-[#93B8FF]"
              >
                Booking
              </Link>

              <Link
                to="/Shop"
                className="block transition hover:text-[#93B8FF]"
              >
                Shop
              </Link>

              <Link
                to="/About"
                className="block transition hover:text-[#93B8FF]"
              >
                About us
              </Link>

              <Link
                to="/Contact"
                className="block transition hover:text-[#93B8FF]"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* SERVICES */}
          <div>
            <h3 className="font-bold">Our services</h3>

            <div className="mt-5 space-y-3 text-sm text-slate-400">
              <p>Plumber booking</p>
              <p>Electrician booking</p>
              <p>Plumbing products</p>
              <p>Electrical products</p>
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="font-bold">Contact</h3>

            <div className="mt-5 space-y-3 text-sm text-slate-400">
              <p>Railway Road, Bannu</p>
              <p>Online customer support</p>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-5 py-6 text-xs text-slate-500 sm:px-8 md:flex-row">
            <p>
              © 2026 Bannu Online Services. All rights reserved.
            </p>

            <p>Made for Bannu, Pakistan.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Shop;
