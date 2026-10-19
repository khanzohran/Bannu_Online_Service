
import React from "react";
import Navbar from "../components/Nawber";

function About() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
<Navbar/>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-blue-200">
              About Our Company
            </p>

            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Bannu Online Services
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
              Professional plumbing and electrical solutions for homes,
              businesses and commercial properties. Reliable service,
              quality products and customer satisfaction are our priority.
            </p>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10"></div>
        <div className="absolute -bottom-32 right-20 h-80 w-80 rounded-full bg-blue-400/10"></div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">

          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-blue-600">
              Who We Are
            </p>

            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Your Trusted Plumbing & Electrical Partner
            </h2>

            <p className="mt-6 leading-8 text-slate-600">
              Bannu Online Services is a professional service platform
              providing plumbing and electrical solutions along with
              quality products. We aim to make it easy for customers to
              find reliable services and products in one place.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              From plumbing repairs and installations to electrical
              maintenance and equipment, our goal is to provide
              dependable solutions with professional customer service.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <div className="rounded-xl border border-blue-100 bg-blue-50 px-6 py-4">
                <p className="text-2xl font-bold text-blue-700">100%</p>
                <p className="text-sm text-slate-600">Quality Focus</p>
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50 px-6 py-4">
                <p className="text-2xl font-bold text-blue-700">24/7</p>
                <p className="text-sm text-slate-600">Support</p>
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50 px-6 py-4">
                <p className="text-2xl font-bold text-blue-700">Pro</p>
                <p className="text-sm text-slate-600">Service</p>
              </div>
            </div>
          </div>

          {/* Service Card */}
          <div className="relative">
            <div className="rounded-3xl bg-gradient-to-br from-blue-700 to-blue-950 p-8 shadow-2xl">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur">

                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-lg">
                  🔧
                </div>

                <h3 className="text-2xl font-bold text-white">
                  Professional Services
                </h3>

                <p className="mt-4 leading-7 text-blue-100">
                  We provide practical and reliable solutions for
                  plumbing and electrical needs, helping customers
                  keep their homes and businesses running smoothly.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3 text-white">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                      ✓
                    </span>
                    Quality Products
                  </div>

                  <div className="flex items-center gap-3 text-white">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                      ✓
                    </span>
                    Professional Service
                  </div>

                  <div className="flex items-center gap-3 text-white">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                      ✓
                    </span>
                    Customer Support
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Why Choose Us
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Built Around Your Needs
            </h2>

            <p className="mt-4 text-slate-600">
              We focus on quality, reliability and a simple customer
              experience.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">

            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                ⚡
              </div>

              <h3 className="mt-6 text-xl font-bold">
                Electrical Solutions
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Electrical installation, maintenance and repair
                solutions for different residential and commercial needs.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                🚰
              </div>

              <h3 className="mt-6 text-xl font-bold">
                Plumbing Services
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Plumbing installation, maintenance and repair services
                designed for homes and businesses.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                🛒
              </div>

              <h3 className="mt-6 text-xl font-bold">
                Quality Products
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Explore useful plumbing and electrical products through
                our online shop.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= MISSION ================= */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="rounded-3xl bg-blue-950 px-8 py-14 text-center shadow-xl sm:px-14">

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-300">
            Our Mission
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold text-white sm:text-4xl">
            Making Professional Plumbing & Electrical Services Easier
            to Access
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-blue-100">
            Our mission is to connect customers with useful products
            and dependable services through a modern, simple and
            professional online experience.
          </p>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">

          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Need Plumbing or Electrical Services?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Explore our services, browse our products or book a service
            for your next project.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">

            <button className="rounded-xl bg-white px-7 py-3.5 font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50">
              Book a Service
            </button>

            <button className="rounded-xl border border-white/40 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10">
              Visit Shop
            </button>

          </div>
        </div>
      </section>
 {/* ================= FOOTER ================= */}
      <footer className="bg-slate-950 text-white">

        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-black">
                B
              </div>

              <div>
                <h2 className="font-black">
                  Bannu Online Services
                </h2>

                <p className="text-xs text-slate-400">
                  Plumbing & Electrical
                </p>
              </div>

            </div>

            <p className="mt-5 leading-7 text-slate-400">
              Your home. Our expertise. A convenient platform for plumbing,
              electrical services and hardware products.
            </p>

          </div>


          <div>

            <h3 className="font-black">
              Quick Links
            </h3>

            <div className="mt-5 space-y-3 text-slate-400">

              <button className="block transition hover:text-white">
                Home
              </button>

              <button className="block transition hover:text-white">
                Booking
              </button>

              <button className="block transition hover:text-white">
                Shop
              </button>

              <button className="block transition hover:text-white">
                About Us
              </button>

              <button className="block transition hover:text-white">
                Contact
              </button>

            </div>

          </div>


          <div>

            <h3 className="font-black">
              Services
            </h3>

            <div className="mt-5 space-y-3 text-slate-400">

              <p>Plumber Booking</p>
              <p>Electrician Booking</p>
              <p>Plumbing Services</p>
              <p>Electrical Services</p>

            </div>

          </div>


          <div>

            <h3 className="font-black">
              Shop
            </h3>

            <div className="mt-5 space-y-3 text-slate-400">

              <p>Plumbing Pipes & Fittings</p>
              <p>Water Pumps & Valves</p>
              <p>Electrical Cables</p>
              <p>Switches & Sockets</p>

            </div>

          </div>

        </div>


        <div className="border-t border-slate-800">

          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 py-6 text-sm text-slate-500 md:flex-row">

            <p>
              © 2026 Bannu Online Services. All rights reserved.
            </p>

            <div className="flex gap-4 text-blue-400">
              <span>Facebook</span>
              <span>Instagram</span>
              <span>YouTube</span>
            </div>

          </div>

        </div>

      </footer>
    </div>
  );
}

export default About;
