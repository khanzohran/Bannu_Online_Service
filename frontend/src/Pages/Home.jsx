import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Nawber";

function Home() {
  return (
    <div
      className="min-h-screen bg-[#FBFAF7] text-slate-900"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        @keyframes rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
        .hero-rise { animation: rise .9s ease both; }
      `}</style>

      <Navbar />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-[#0B1426]">
        <div className="absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-[#2563EB]/10 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div className="hero-rise relative z-10">
            <p className="mb-6 flex items-center gap-3 text-sm font-medium text-[#93B8FF]">
              <span className="h-px w-10 bg-[#2563EB]" />
              Bannu Online Services
            </p>
            <h1 className="serif max-w-2xl text-5xl font-semibold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
              Craftsmanship for every wire, pipe and corner of your home.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              Book trusted plumbers and electricians, and shop premium hardware, all in one place in Bannu.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/booking" className="rounded-full bg-gradient-to-br from-blue-500 to-blue-700 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-black/30 transition hover:brightness-110">
                Book a Professional
              </Link>
              <Link to="/shop" className="rounded-full border border-white/25 px-8 py-4 text-sm font-semibold text-white transition hover:border-[#2563EB] hover:text-[#93B8FF]">
                Browse the Shop
              </Link>
            </div>
            <div className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8">
              <div>
                <p className="serif text-3xl font-semibold text-[#93B8FF]">1,500+</p>
                <p className="mt-1 text-xs text-slate-400">Jobs completed</p>
              </div>
              <div>
                <p className="serif text-3xl font-semibold text-[#93B8FF]">4.8</p>
                <p className="mt-1 text-xs text-slate-400">Average rating</p>
              </div>
              <div>
                <p className="serif text-3xl font-semibold text-[#93B8FF]">Same day</p>
                <p className="mt-1 text-xs text-slate-400">Service available</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute -inset-3 rounded-t-[220px] rounded-b-[28px] border border-[#2563EB]/40" />
            <div className="relative overflow-hidden rounded-t-[210px] rounded-b-[24px]">
              <img
                src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=90"
                alt="Professional electrician at work"
                className="h-[480px] w-full object-cover sm:h-[600px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1426]/70 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-5 left-4 right-4 rounded-2xl bg-white p-5 shadow-2xl sm:left-auto sm:right-[-20px] sm:w-72">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0B1426] text-lg text-[#93B8FF]">✓</div>
                <div>
                  <p className="font-bold text-[#0B1426]">Verified professionals</p>
                  <p className="text-sm text-slate-500">Every technician is checked</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <h2 className="serif text-4xl font-semibold text-[#0B1426] sm:text-5xl">Featured products</h2>
              <p className="mt-4 leading-7 text-slate-600">Two electrical and two plumbing essentials, chosen for quality and durability.</p>
            </div>
            <Link to="/shop" className="text-sm font-bold text-[#0B1426] underline decoration-[#2563EB] decoration-2 underline-offset-8">View all products</Link>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Product 1 */}
            <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-[#FBFAF7] transition hover:border-[#2563EB] hover:shadow-xl">
              <div className="relative overflow-hidden">
                <img src="https://media.istockphoto.com/id/2159463506/photo/three-rolls-of-electrical-wire-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=DqYI8zSajuHh71IBBG7vJAqPHmBmSxw5FPQ-uI-gXS0=" />
                <span className="absolute left-4 top-4 rounded-full bg-[#0B1426] px-3 py-1.5 text-xs font-semibold text-[#93B8FF]">Electrical</span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-[#0B1426]">Premium Electrical wire Cable</h3>
                <p className="mt-1 text-sm text-slate-500">Copper core, 90m coil</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="serif text-2xl font-bold text-[#0B1426]">Rs. 3,200</span>
                  <Link to="/ElectricalShop" className="rounded-full bg-[#0B1426] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#2563EB]">View</Link>
                </div>
              </div>
            </article>

            {/* Product 2 */}
            <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-[#FBFAF7] transition hover:border-[#2563EB] hover:shadow-xl">
              <div className="relative overflow-hidden">
                <img src="https://media.istockphoto.com/id/951831182/vector/transparent-incandescent-bulb-fluorescent-and-led-bulb.jpg?s=612x612&w=0&k=20&c=JRMZ8WpxPXRXxCB-0N7-enpfAQxueg43C0sSBD6vwCo=" />
                <span className="absolute left-4 top-4 rounded-full bg-[#0B1426] px-3 py-1.5 text-xs font-semibold text-[#93B8FF]">Electrical</span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-[#0B1426]">Designer light Set</h3>
                <p className="mt-1 text-sm text-slate-500">Modern finish, fire-retardant</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="serif text-2xl font-bold text-[#0B1426]">Rs.800</span>
                  <Link to="/ElectricalShop" className="rounded-full bg-[#0B1426] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#2563EB]">View</Link>
                </div>
              </div>
            </article>

            {/* Product 3 */}
            <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-[#FBFAF7] transition hover:border-[#2563EB] hover:shadow-xl">
              <div className="relative overflow-hidden">
                <img src="https://media.istockphoto.com/id/1454381796/photo/hdpe-pipes-for-industrial-isolated-on-white-background-3d-render.jpg?s=612x612&w=0&k=20&c=QHaTEr7kdw6D3j_eHu-duxSCF0h0-eIYjBNWe-rz3mI=" alt="PVC Water Pipe" className="h-56 w-full object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute left-4 top-4 rounded-full bg-[#0B1426] px-3 py-1.5 text-xs font-semibold text-[#93B8FF]">Plumbing</span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-[#0B1426]">PVC Water Pipe</h3>
                <p className="mt-1 text-sm text-slate-500">Hight-5m,wight-1 inche </p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="serif text-2xl font-bold text-[#0B1426]">Rs. 400 for one pice</span>
                  <Link to="/PlumbingShop" className="rounded-full bg-[#0B1426] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#2563EB]">View</Link>
                </div>
              </div>
            </article>

            {/* Product 4 */}
            <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-[#FBFAF7] transition hover:border-[#2563EB] hover:shadow-xl">
              <div className="relative overflow-hidden">
                <img src="https://media.istockphoto.com/id/1163543247/photo/metal-sanitary-tees-for-water-supply-pipes.jpg?s=612x612&w=0&k=20&c=V6pcmth26izC0YpfkfWOrYV7nu7JqjbHPL33wXnsG-I=" alt="Heavy-Duty Water Pump" className="h-56 w-full object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute left-4 top-4 rounded-full bg-[#0B1426] px-3 py-1.5 text-xs font-semibold text-[#93B8FF]">Plumbing</span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-[#0B1426]">one inche pipe T</h3>
                <p className="mt-1 text-sm text-slate-500"> 1 year warranty</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="serif text-2xl font-bold text-[#0B1426]">Rs.100</span>
                  <Link to="/PlumbingShop" className="rounded-full bg-[#0B1426] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#2563EB]">View</Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ================= LUXURY BOOKING ================= */}
      <section className="relative overflow-hidden bg-[#0B1426] py-20 sm:py-28">
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#2563EB]/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <h2 className="serif text-4xl font-semibold text-white sm:text-5xl">Book a trusted professional</h2>
            <p className="mt-4 leading-7 text-slate-300">Two electricians and two plumbers, experienced, verified and ready to visit your home.</p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          
             
            <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition hover:border-[#2563EB] hover:shadow-xl">
              <div className="relative overflow-hidden">
                <img src="https://res.cloudinary.com/sgoy94v2/image/upload/v1792473842/bannu-online-services/workers/lcbbcoewi4irrrnpeord.jpg" />
                <span className="absolute left-4 top-4 rounded-full bg-[#0B1426] px-3 py-1.5 text-xs font-semibold text-[#93B8FF]">Electrician</span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-white">Jalal Ustaad</h3>
                <p className="mt-1 text-sm text-slate-500">I am a bast Ustaad for Electrical works

 </p>
                <div className="mt-5 flex items-center justify-between">
                <Link to="/Userelectri" className="rounded-full bg-gradient-to-br from-blue-500 to-blue-700 px-5 py-2.5 text-xs font-bold text-white transition hover:brightness-110">Book now</Link>
                </div>
              </div>
            </article>
           
             {/* Pro 4 */}
           
            <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition hover:border-[#2563EB] hover:shadow-xl">
              <div className="relative overflow-hidden">
                <img src="https://res.cloudinary.com/sgoy94v2/image/upload/v1792474093/bannu-online-services/workers/hgrzeiwtptwn3gbqfdqu.png" />
                <span className="absolute left-4 top-4 rounded-full bg-[#0B1426] px-3 py-1.5 text-xs font-semibold text-[#93B8FF]">Plumber

                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-white">Sher nadim</h3>
                <p className="mt-1 text-sm text-slate-500">The 15 year Experience for Electrician work

 </p>
                <div className="mt-5 flex items-center justify-between">
                <Link to="/UserAllPlumberworker" className="rounded-full bg-gradient-to-br from-blue-500 to-blue-700 px-5 py-2.5 text-xs font-bold text-white transition hover:brightness-110">Book now</Link>
                </div>
              </div>
            </article>
            {/* Pro 3 */}
            
            <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition hover:border-[#2563EB] hover:shadow-xl">
              <div className="relative overflow-hidden h-70">
                <img src="https://res.cloudinary.com/sgoy94v2/image/upload/v1792429805/bannu-online-services/workers/m3aiqb767cxzbwubpjbm.jpg" />
                <span className="absolute left-4 top-4 rounded-full bg-[#0B1426] px-3 py-1.5 text-xs font-semibold text-[#93B8FF]">Plumber</span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-white">Dil nawez</h3>
                <p className="mt-1 text-sm text-slate-500">The 10 year Experience for  work

 </p>
                <div className="mt-5 flex items-center justify-between">
                <Link to="/UserAllPlumberworker" className="rounded-full bg-gradient-to-br from-blue-500 to-blue-700 px-5 py-2.5 text-xs font-bold text-white transition hover:brightness-110">Book now</Link>
                </div>
              </div>
            </article>
           
             {/* Pro 4*/}
            <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition hover:border-[#2563EB] hover:shadow-xl">
              <div className="relative overflow-hidden h-70">
                <img src="https://res.cloudinary.com/sgoy94v2/image/upload/v1792421921/bannu-online-services/workers/no1ab2vcigg1pfv6i2vo.jpg" />
                <span className="absolute left-4 top-4 rounded-full bg-[#0B1426] px-3 py-1.5 text-xs font-semibold text-[#93B8FF]">Electrician</span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-white">Janzeb kamal</h3>
                <p className="mt-1 text-sm text-slate-500">The 15 year Experience for Electrician work

 </p>
                <div className="mt-5 flex items-center justify-between">
                <Link to="/Userelectri" className="rounded-full bg-gradient-to-br from-blue-500 to-blue-700 px-5 py-2.5 text-xs font-bold text-white transition hover:brightness-110">Book now</Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <h2 className="serif max-w-xl text-4xl font-semibold text-[#0B1426] sm:text-5xl">How it works</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <span className="serif text-5xl font-semibold text-[#2563EB]">1</span>
              <h3 className="mt-4 text-lg font-bold text-[#0B1426]">Choose a service</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">Pick a plumber or electrician from our verified professionals.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <span className="serif text-5xl font-semibold text-[#2563EB]">2</span>
              <h3 className="mt-4 text-lg font-bold text-[#0B1426]">Confirm your slot</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">Select a date and time that suits you and share your address.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <span className="serif text-5xl font-semibold text-[#2563EB]">3</span>
              <h3 className="mt-4 text-lg font-bold text-[#0B1426]">Relax at home</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">Your professional arrives on time and completes the job properly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1100&q=90"
              alt="Professional technician working"
              className="h-[420px] w-full rounded-3xl object-cover shadow-xl sm:h-[520px]"
            />
            <div className="absolute -bottom-6 right-6 rounded-2xl bg-[#0B1426] p-6 shadow-xl">
              <p className="serif text-3xl font-semibold text-[#93B8FF]">Bannu</p>
              <p className="mt-1 text-sm text-slate-300">Local online services</p>
            </div>
          </div>
          <div>
            <h2 className="serif text-4xl font-semibold leading-tight text-[#0B1426] sm:text-5xl">A smarter way to look after your home</h2>
            <p className="mt-6 leading-8 text-slate-600">
              Bannu Online Services brings skilled technicians and quality hardware together on one simple platform, so repairs and upgrades never need a long search.
            </p>
            <ul className="mt-8 space-y-5">
              <li className="flex gap-4">
                <span className="mt-1 text-blue-500">◆</span>
                <div>
                  <h3 className="font-bold text-[#0B1426]">Convenient online booking</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">Request plumbing and electrical services from your phone.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="mt-1 text-blue-500">◆</span>
                <div>
                  <h3 className="font-bold text-[#0B1426]">Wide product range</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">Pipes, pumps, cables, switches and more.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="mt-1 text-blue-500">◆</span>
                <div>
                  <h3 className="font-bold text-[#0B1426]">One simple experience</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">Services and shopping from a single account.</p>
                </div>
              </li>
            </ul>
            <Link to="/about" className="mt-9 inline-block rounded-full bg-[#0B1426] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#2563EB]">Read our story</Link>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <h2 className="serif text-4xl font-semibold text-[#0B1426] sm:text-5xl">What our customers say</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <figure className="rounded-2xl border border-slate-200 bg-white p-8">
              <span className="text-blue-500">★★★★★</span>
              <blockquote className="serif mt-5 text-xl leading-8 text-[#0B1426]">
                “The electrician arrived on time, fixed our wiring in one visit and cleaned up afterwards. Excellent work.”
              </blockquote>
              <figcaption className="mt-6 text-sm">
                <span className="font-bold text-[#0B1426]">Hamid Ur Rehman</span>
                <span className="text-slate-500"> · Bannu City</span>
              </figcaption>
            </figure>

            <figure className="rounded-2xl border border-slate-200 bg-white p-8">
              <span className="text-blue-500">★★★★★</span>
              <blockquote className="serif mt-5 text-xl leading-8 text-[#0B1426]">
                “I ordered pipes and a pump online and booked a plumber the same day. Everything was handled in one place.”
              </blockquote>
              <figcaption className="mt-6 text-sm">
                <span className="font-bold text-[#0B1426]">Sana Bibi</span>
                <span className="text-slate-500"> · Domel</span>
              </figcaption>
            </figure>

            <figure className="rounded-2xl border border-slate-200 bg-white p-8">
              <span className="text-blue-500">★★★★★</span>
              <blockquote className="serif mt-5 text-xl leading-8 text-[#0B1426]">
                “Honest prices and very polite staff. Now I call them for every repair at home and in the shop.”
              </blockquote>
              <figcaption className="mt-6 text-sm">
                <span className="font-bold text-[#0B1426]">Tariq Khan</span>
                <span className="text-slate-500"> · Railway Road</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <h2 className="serif text-center text-4xl font-semibold text-[#0B1426] sm:text-5xl">Frequently asked questions</h2>
          <div className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
            <details className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-[#0B1426] [&::-webkit-details-marker]:hidden">
                How do I book a plumber or electrician?
                <span className="text-2xl text-blue-500 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 pr-8 text-sm leading-7 text-slate-600">Open the Booking page, choose a professional, select your date and time, and confirm. We will contact you to verify the visit.</p>
            </details>

            <details className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-[#0B1426] [&::-webkit-details-marker]:hidden">
                Do you serve all areas of Bannu?
                <span className="text-2xl text-blue-500 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 pr-8 text-sm leading-7 text-slate-600">Yes. We cover Bannu city and the surrounding areas. Mention your location while booking.</p>
            </details>

            <details className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-[#0B1426] [&::-webkit-details-marker]:hidden">
                Can I buy products without booking a service?
                <span className="text-2xl text-blue-500 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 pr-8 text-sm leading-7 text-slate-600">Yes. The Shop is open to everyone. You can order plumbing and electrical products on their own.</p>
            </details>

            <details className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-[#0B1426] [&::-webkit-details-marker]:hidden">
                How is the service charge decided?
                <span className="text-2xl text-blue-500 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 pr-8 text-sm leading-7 text-slate-600">Each professional lists a visit charge. Any parts or extra work are explained and agreed before the job begins.</p>
            </details>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-5 py-20 sm:px-8 sm:py-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#0B1426]">
          <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-[#2563EB]/20 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-8 px-7 py-14 sm:px-14 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="serif text-4xl font-semibold leading-tight text-white sm:text-5xl">Your home deserves professional care.</h2>
              <p className="mt-4 leading-7 text-slate-300">Book a visit today or order the products you need.</p>
            </div>
            <Link to="/booking" className="shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 px-8 py-4 text-sm font-bold text-white transition hover:brightness-110">Book your service</Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#080F1E] text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="serif flex h-12 w-12 items-center justify-center rounded-full border border-[#2563EB] text-2xl font-semibold text-[#93B8FF]">B</div>
              <div>
                <h3 className="font-bold">Bannu Online Services</h3>
                <p className="mt-1 text-xs text-slate-400">Plumbing & Electrical</p>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-7 text-slate-400">Plumbing, electrical services and hardware products for homes in Bannu.</p>
          </div>

          <div>
            <h3 className="font-bold">Quick links</h3>
            <div className="mt-5 space-y-3 text-sm text-slate-400">
              <Link to="/" className="block transition hover:text-[#93B8FF]">Home</Link>
              <Link to="/booking" className="block transition hover:text-[#93B8FF]">Booking</Link>
              <Link to="/shop" className="block transition hover:text-[#93B8FF]">Shop</Link>
              <Link to="/about" className="block transition hover:text-[#93B8FF]">About us</Link>
              <Link to="/contact" className="block transition hover:text-[#93B8FF]">Contact</Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold">Our services</h3>
            <div className="mt-5 space-y-3 text-sm text-slate-400">
              <p>Plumber booking</p>
              <p>Electrician booking</p>
              <p>Plumbing products</p>
              <p>Electrical products</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold">Contact</h3>
            <div className="mt-5 space-y-3 text-sm text-slate-400">
              <p>info@bannuonlineservices.com</p>
              <p>03365254197</p>
              <p>Pakistan kpk bannu</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-5 py-6 text-xs text-slate-500 sm:px-8 md:flex-row">
            <p>© 2026 Bannu Online Services. All rights reserved.</p>
            <p>Made for Bannu, Pakistan.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;