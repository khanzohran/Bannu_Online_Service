
import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Nawber";

function Contact() {

  let [contact, setcontact]=useState({

custamername:"",
custamernumber:0,
custameremail:"",
custmerservice:"",
custmermassage:"",

  })
   async function contactsumit() {
    let response=await axios.post(import.meta.env.VITE_Backend_base_ULR + "/Contectroute/contactcreate",
  contact
)
console.log(response.data)
   } 
  return (
    <div className="min-h-screen bg-white text-slate-900">
<Navbar/>
      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-200">
              Get In Touch
            </p>

            <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              Contact Us
            </h1>

            <p className="mt-6 text-lg leading-8 text-blue-100">
              Need plumbing or electrical services? Contact Bannu Online
              Services and let us help you with your next project.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CONTACT AREA ================= */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">

        <div className="grid gap-10 lg:grid-cols-5">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2">

            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Contact Information
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Let's Talk About Your Project
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              Whether you need plumbing, electrical work or quality
              products, our team is ready to assist you.
            </p>

            {/* Location */}
            <div className="mt-8 flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xl text-white">
                📍
              </div>

              <div>
                <h3 className="font-bold">Our Location</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Bannu Railway Road
                  <br />
                  Bannu, Khyber Pakhtunkhwa
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="mt-4 flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xl text-white">
                📞
              </div>

              <div>
                <h3 className="font-bold">Phone</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Your Phone Number
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="mt-4 flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xl text-white">
                ✉️
              </div>

              <div>
                <h3 className="font-bold">Email</h3>
                <p className="mt-1 text-sm text-slate-600">
                  info@bannuonlineservices.com
                </p>
              </div>
            </div>

            {/* Working Hours */}
            <div className="mt-4 flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xl text-white">
                🕒
              </div>

              <div>
                <h3 className="font-bold">Working Hours</h3>
                <p className="mt-1 text-sm text-slate-600">
                  
                  <br />
                  9:00 AM - 8:00 PM
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE FORM */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">

              <div className="mb-8">
                <h2 className="text-2xl font-bold sm:text-3xl">
                  Send Us a Message
                </h2>

                <p className="mt-2 text-slate-500">
                  Fill out the form and we'll get back to you.
                </p>
              </div>

              <div className="space-y-5">

                <div className="grid gap-5 sm:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Full Name
                    </label>

                    <input
                     value={contact.custamername}
                    onChange={(event) =>
                      setcontact({
                        ...contact,
                        custamername: event.target.value,
                      })
                    }
                      type="text"
                      placeholder="Enter your name"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-blue-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Phone Number
                    </label>

                    <input
                     value={contact.custamernumber}
                    onChange={(event) =>
                      setcontact({
                        ...contact,
                        custamernumber: event.target.value,
                      })
                    }
                      type="tel"
                      placeholder="03XX XXXXXXX"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-blue-600 focus:bg-white"
                    />
                  </div>

                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Email Address
                  </label>

                  <input
                   value={contact.custameremail}
                    onChange={(event) =>
                      setcontact({
                        ...contact,
                        custameremail: event.target.value,
                      })
                    }
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Service
                  </label>

                  <select
                   value={contact.custmerservice}
                    onChange={(event) =>
                      setcontact({
                        ...contact,
                        custmerservice: event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-blue-600 focus:bg-white"
                  >
                    <option>Select a service</option>
                    <option>Plumbing Service</option>
                    <option>Electrical Service</option>
                    <option>Product Inquiry</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Message
                  </label>

                  <textarea
                   value={contact.custmermassage}
                    onChange={(event) =>
                      setcontact({
                        ...contact,
                        custmermassage: event.target.value,
                      })
                    }
                    rows="5"
                    placeholder="Tell us how we can help..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-blue-600 focus:bg-white"
                  ></textarea>
                </div>

              <button
  type="button"
  onClick={contactsumit}
  className="w-full rounded-xl bg-blue-700 px-6 py-4 font-semibold text-white shadow-lg transition hover:bg-blue-800"
>
  Send Message →
</button>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= SERVICE CTA ================= */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-5xl px-6 text-center">

          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            Bannu Online Services
          </p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Professional Plumbing & Electrical Solutions
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Quality products, reliable services and a professional
            customer experience in Bannu.
          </p>

          <button className="mt-8 rounded-xl bg-blue-700 px-8 py-4 font-semibold text-white shadow-lg transition hover:bg-blue-800">
            Book a Service
          </button>

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

export default Contact;

