import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Nawber";

const YELLOW = "#F5F02E";

const products = [
  {
    tag: "Electrical",
    name: "Premium Electrical Wire Cable",
    note: "Copper core, 90m coil",
    price: "Rs. 3,200",
    to: "/ElectricalShop",
    img: "https://media.istockphoto.com/id/2159463506/photo/three-rolls-of-electrical-wire-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=DqYI8zSajuHh71IBBG7vJAqPHmBmSxw5FPQ-uI-gXS0=",
  },
  {
    tag: "Electrical",
    name: "Designer Light Set",
    note: "Modern finish, fire-retardant",
    price: "Rs. 800",
    to: "/ElectricalShop",
    img: "https://media.istockphoto.com/id/951831182/vector/transparent-incandescent-bulb-fluorescent-and-led-bulb.jpg?s=612x612&w=0&k=20&c=JRMZ8WpxPXRXxCB-0N7-enpfAQxueg43C0sSBD6vwCo=",
  },
  {
    tag: "Plumbing",
    name: "PVC Water Pipe",
    note: "Length 5 m, diameter 1 inch",
    price: "Rs. 400 per piece",
    to: "/PlumbingShop",
    img: "https://media.istockphoto.com/id/1454381796/photo/hdpe-pipes-for-industrial-isolated-on-white-background-3d-render.jpg?s=612x612&w=0&k=20&c=QHaTEr7kdw6D3j_eHu-duxSCF0h0-eIYjBNWe-rz3mI=",
  },
  {
    tag: "Plumbing",
    name: "1 Inch Pipe Tee",
    note: "1 year warranty",
    price: "Rs. 100",
    to: "/PlumbingShop",
    img: "https://media.istockphoto.com/id/1163543247/photo/metal-sanitary-tees-for-water-supply-pipes.jpg?s=612x612&w=0&k=20&c=V6pcmth26izC0YpfkfWOrYV7nu7JqjbHPL33wXnsG-I=",
  },
];

const pros = [
  {
    tag: "Electrician",
    name: "Jalal Ustaad",
    note: "Trusted electrician for home wiring and repairs.",
    to: "/Userelectri",
    img: "https://res.cloudinary.com/sgoy94v2/image/upload/v1792473842/bannu-online-services/workers/lcbbcoewi4irrrnpeord.jpg",
  },
  {
    tag: "Plumber",
    name: "Sher Nadim",
    note: "15 years of experience in plumbing work.",
    to: "/UserAllPlumberworker",
    img: "https://res.cloudinary.com/sgoy94v2/image/upload/v1792474093/bannu-online-services/workers/hgrzeiwtptwn3gbqfdqu.png",
  },
  {
    tag: "Plumber",
    name: "Dil Nawez",
    note: "10 years of experience in plumbing work.",
    to: "/UserAllPlumberworker",
    img: "https://res.cloudinary.com/sgoy94v2/image/upload/v1792429805/bannu-online-services/workers/m3aiqb767cxzbwubpjbm.jpg",
  },
  {
    tag: "Electrician",
    name: "Janzeb Kamal",
    note: "15 years of experience in electrical work.",
    to: "/Userelectri",
    img: "https://res.cloudinary.com/sgoy94v2/image/upload/v1792421921/bannu-online-services/workers/no1ab2vcigg1pfv6i2vo.jpg",
  },
];

const stats = [
  { n: "1,500+", l: "Jobs completed" },
  { n: "4.8", l: "Average rating" },
  { n: "100%", l: "Verified technicians" },
  { n: "Same day", l: "Service available" },
];

const features = [
  { t: "Easy booking", d: "Request a plumber or electrician from your phone in a few taps.", icon: "M5 13l4 4L19 7" },
  { t: "Verified professionals", d: "Every technician is checked before they join the platform.", icon: "M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" },
  { t: "On-time visits", d: "Pick your slot and your professional arrives when promised.", icon: "M12 7v5l3 2M12 21a9 9 0 100-18 9 9 0 000 18z" },
];

const reviews = [
  { q: "The electrician arrived on time, fixed our wiring in one visit and cleaned up afterwards. Excellent work.", n: "Hamid Ur Rehman", p: "Bannu City" },
  { q: "I ordered pipes and a pump online and booked a plumber the same day. Everything was handled in one place.", n: "Sana Bibi", p: "Domel" },
  { q: "Honest prices and very polite staff. Now I call them for every repair at home and in the shop.", n: "Tariq Khan", p: "Railway Road" },
];

const faqs = [
  { q: "How do I book a plumber or electrician?", a: "Open the Booking page, choose a professional, select your date and time, and confirm. We will contact you to verify the visit." },
  { q: "Do you serve all areas of Bannu?", a: "Yes. We cover Bannu city and the surrounding areas. Mention your location while booking." },
  { q: "Can I buy products without booking a service?", a: "Yes. The Shop is open to everyone. You can order plumbing and electrical products on their own." },
  { q: "How is the service charge decided?", a: "Each professional lists a visit charge. Any parts or extra work are explained and agreed before the job begins." },
];

const btnYellow =
  "inline-flex items-center justify-center rounded-full bg-[#F5F02E] px-7 py-3.5 text-sm font-semibold text-black transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
const btnWhite =
  "inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F02E]";

function SectionLabel({ children }) {
  return (
    <p className="mb-5 flex items-center gap-3 text-sm text-neutral-400">
      <span className="h-px w-10" style={{ background: YELLOW }} />
      {children}
    </p>
  );
}

function Home() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = (e) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <div className="min-h-screen bg-[#111] text-white" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
        @keyframes heroIn { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
        .hero-in { animation: heroIn .9s cubic-bezier(.2,.7,.2,1) both; }
        .hero-in-2 { animation: heroIn .9s .15s cubic-bezier(.2,.7,.2,1) both; }
        @media (prefers-reduced-motion: reduce) { .hero-in, .hero-in-2 { animation: none; } }
      `}</style>

      <Navbar />

      {/* ================= HERO ================= */}
      <section className="relative isolate overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1800&q=90"
          alt="Professional electrician at work"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[#111] to-transparent" />

        <div className="mx-auto grid min-h-[88vh] max-w-7xl items-end gap-10 px-5 pb-16 pt-32 sm:px-8 lg:grid-cols-[1.4fr_0.6fr] lg:pb-24">
          <div className="hero-in max-w-3xl">
            <SectionLabel>Bannu Online Services</SectionLabel>
            <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Expert Plumbers &amp; Electricians, At Your Door
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-neutral-300 sm:text-lg">
              Book trusted professionals for every wire, pipe and fix in your home, and shop quality hardware, all in one place in Bannu.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/booking" className={btnYellow}>Book a Professional</Link>
              <Link to="/shop" className={btnWhite}>Browse the Shop</Link>
            </div>
          </div>

          <Link
            to="/booking"
            className="hero-in-2 group relative hidden overflow-hidden rounded-2xl border border-white/15 bg-black/40 backdrop-blur-md lg:block"
          >
            <img
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
              alt="Technician at work"
              className="h-56 w-full object-cover"
            />
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-semibold">Verified professionals</p>
                <p className="text-xs text-neutral-400">Book in under a minute</p>
              </div>
              <span
                className="flex h-11 w-11 items-center justify-center rounded-lg text-black transition group-hover:scale-105"
                style={{ background: YELLOW }}
                aria-hidden="true"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l13 8-13 8z" /></svg>
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid grid-cols-2 gap-10 text-center lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l}>
              <p className="text-4xl font-semibold tracking-tight sm:text-6xl">{s.n}</p>
              <p className="mt-3 text-sm text-neutral-400">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid items-end gap-8 lg:grid-cols-2">
          <div>
            <SectionLabel>Shop</SectionLabel>
            <p className="max-w-md leading-7 text-neutral-400">
              Two electrical and two plumbing essentials, chosen for quality and durability.
            </p>
            <Link to="/shop" className={`${btnYellow} mt-8`}>View all products</Link>
          </div>
          <h2 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-right">
            Quality Hardware for Every Job
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <article key={p.name} className="group overflow-hidden rounded-2xl bg-[#1a1a1a]">
              <div className="relative h-56 overflow-hidden bg-white">
                <img
                  src={p.img}
                  alt={p.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-black/80 px-3 py-1.5 text-xs font-semibold" style={{ color: YELLOW }}>
                  {p.tag}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="mt-1 text-sm text-neutral-400">{p.note}</p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="text-lg font-bold">{p.price}</span>
                  <Link
                    to={p.to}
                    className="shrink-0 rounded-full bg-[#F5F02E] px-4 py-2 text-xs font-semibold text-black transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                  >
                    View
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ================= FEATURES + IMAGE ================= */}
      <section className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2">
        <div>
          <SectionLabel>Why choose us</SectionLabel>
          <h2 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            A Smarter Way to Look After Your Home
          </h2>
          <p className="mt-6 max-w-lg leading-7 text-neutral-400">
            Bannu Online Services brings skilled technicians and quality hardware together on one simple platform, so repairs and upgrades never need a long search.
          </p>
          <div className="mt-10 space-y-8">
            {features.map((f) => (
              <div key={f.t} className="flex gap-5">
                <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ background: YELLOW }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={f.icon} />
                  </svg>
                </span>
                <div>
                  <h3 className="font-semibold">{f.t}</h3>
                  <p className="mt-1 max-w-sm text-sm leading-6 text-neutral-400">{f.d}</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/about" className={`${btnYellow} mt-10`}>Read our story</Link>
        </div>
        <img
          src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1100&q=90"
          alt="Professional technician working"
          className="h-[420px] w-full rounded-3xl object-cover sm:h-[560px]"
        />
      </section>

      {/* ================= BOOK A PROFESSIONAL ================= */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid items-end gap-8 lg:grid-cols-2">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Book a Trusted Professional
          </h2>
          <p className="max-w-md leading-7 text-neutral-400 lg:justify-self-end">
            Two electricians and two plumbers, experienced, verified and ready to visit your home.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pros.map((p) => (
            <article key={p.name} className="group overflow-hidden rounded-2xl bg-[#1a1a1a]">
              <div className="relative h-72 overflow-hidden">
                <img
                  src={p.img}
                  alt={p.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-black/80 px-3 py-1.5 text-xs font-semibold" style={{ color: YELLOW }}>
                  {p.tag}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="mt-1 min-h-[40px] text-sm leading-5 text-neutral-400">{p.note}</p>
                <Link
                  to={p.to}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#F5F02E] px-5 py-2.5 text-sm font-semibold text-black transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                >
                  Book now
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <h2 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">How it works</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            ["1", "Choose a service", "Pick a plumber or electrician from our verified professionals."],
            ["2", "Confirm your slot", "Select a date and time that suits you and share your address."],
            ["3", "Relax at home", "Your professional arrives on time and completes the job properly."],
          ].map(([n, t, d]) => (
            <div key={n} className="rounded-2xl bg-[#1a1a1a] p-8">
              <span className="text-5xl font-semibold" style={{ color: YELLOW }}>{n}</span>
              <h3 className="mt-5 text-lg font-semibold">{t}</h3>
              <p className="mt-2 text-sm leading-7 text-neutral-400">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid items-end gap-8 lg:grid-cols-2">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Our Reputation, Backed by Customers
          </h2>
          <p className="max-w-md leading-7 text-neutral-400 lg:justify-self-end">
            Real feedback from homes and shops across Bannu.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <figure key={r.n} className="rounded-2xl bg-[#1a1a1a] p-8">
              <span style={{ color: YELLOW }} aria-label="5 out of 5 stars">★★★★★</span>
              <blockquote className="mt-5 leading-7 text-neutral-200">“{r.q}”</blockquote>
              <figcaption className="mt-6 text-sm">
                <span className="font-semibold">{r.n}</span>
                <span className="text-neutral-500">, {r.p}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
        <h2 className="text-center text-4xl font-semibold tracking-tight sm:text-5xl">Frequently asked questions</h2>
        <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="text-2xl transition-transform group-open:rotate-45" style={{ color: YELLOW }}>+</span>
              </summary>
              <p className="mt-3 pr-8 text-sm leading-7 text-neutral-400">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ================= BIG CTA ================= */}
      <section className="relative isolate overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1800&q=80"
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-black/70" />
        <div className="mx-auto max-w-3xl px-5 py-28 text-center sm:px-8 sm:py-36">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            Your Home Deserves Professional Care
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-7 text-neutral-300">
            Book a visit today or order the products you need. Fast booking, honest prices, reliable work.
          </p>
          <Link to="/booking" className={`${btnYellow} mt-9`}>Book your service</Link>
        </div>
      </section>

      {/* ================= NEWSLETTER ================= */}
      <section className="bg-white text-black">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-14 sm:px-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Get offers and updates</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-neutral-600">
              Receive new product arrivals and service discounts from Bannu Online Services.
            </p>
          </div>
          {subscribed ? (
            <p className="font-semibold">Thanks, you are subscribed.</p>
          ) : (
            <form onSubmit={subscribe} className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-full bg-neutral-200 px-6 py-3.5 text-sm outline-none focus:ring-2 focus:ring-black"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-[#F5F02E] px-7 py-3.5 text-sm font-semibold text-black transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                Subscribe now
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#111]">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg text-xl font-extrabold text-black" style={{ background: YELLOW }}>B</span>
              <h3 className="text-lg font-bold">Bannu Online Services</h3>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-7 text-neutral-400">
              Plumbing, electrical services and hardware products for homes in Bannu. Call us during working hours and our team will be happy to help.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Quick links</h3>
            <div className="mt-5 space-y-3 text-sm text-neutral-400">
              <Link to="/" className="block transition hover:text-white">Home</Link>
              <Link to="/booking" className="block transition hover:text-white">Booking</Link>
              <Link to="/shop" className="block transition hover:text-white">Shop</Link>
              <Link to="/about" className="block transition hover:text-white">About us</Link>
              <Link to="/contact" className="block transition hover:text-white">Contact</Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">Our services</h3>
            <div className="mt-5 space-y-3 text-sm text-neutral-400">
              <p>Plumber booking</p>
              <p>Electrician booking</p>
              <p>Plumbing products</p>
              <p>Electrical products</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">Contact</h3>
            <div className="mt-5 space-y-3 text-sm text-neutral-400">
              <p>info@bannuonlineservices.com</p>
              <p>03365254197</p>
              <p>Bannu, Khyber Pakhtunkhwa, Pakistan</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-5 py-6 text-xs text-neutral-500 sm:px-8 md:flex-row">
            <p>© 2026 Bannu Online Services. All rights reserved.</p>
            <p>Made for Bannu, Pakistan.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;