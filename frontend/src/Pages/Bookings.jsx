import React from "react"; 
import Navbar from "../components/Nawber"; 
import { useNavigate } from "react-router-dom"; 
 
function Booking() { 
         let navigate = useNavigate(); 
   
  return ( 
    <div className="min-h-screen bg-slate-50 text-slate-900"> 
<Navbar/> 
      {/* ================= HERO ================= */} 
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700"> 
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8"> 
 
          <div className="max-w-3xl"> 
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-blue-200"> 
              Bannu Online Services 
            </p> 
 
            <h1 className="mt-5 text-5xl font-black leading-tight text-white sm:text-6xl"> 
              Book a 
              <span className="block text-blue-200"> 
                Professional Service 
              </span> 
            </h1> 
 
            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100"> 
              Need a plumber or electrician? Choose your service, 
              select a convenient time and send your booking request. 
            </p> 
          </div> 
 
        </div> 
 
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10"></div> 
        <div className="absolute -bottom-40 right-20 h-96 w-96 rounded-full bg-blue-400/10"></div> 
      </section> 
 {/* ================= CATEGORIES ================= */} 
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8"> 
 
        <div className="text-center"> 
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600"> 
            Booking Form 
          </p> 
 
          <h2 className="mt-3 text-3xl font-black sm:text-4xl"> 
            Book your service 
          </h2> 
 
          
        </div> 
 
 
        <div className="mt-12 grid gap-8 md:grid-cols-2"> 
 
          {/* ELECTRICIAN */} 
          <div className="group relative min-h-[360px] overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 to-blue-500 p-8 shadow-2xl"> 
 
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-500/20"></div> 
 
            <div className="relative z-10 flex h-full flex-col justify-between"> 
 
              <div> 
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-xl"> 
                  ⚡ 
                </div> 
 
                <p className="mt-8 text-sm font-bold uppercase tracking-widest text-blue-300"> 
                    Electrical Service 
                </p> 
 
                <h3 className="mt-2 text-3xl font-black text-white"> 
                    Electrician Booking 
                </h3> 
 
                <p className="mt-4 max-w-md leading-7 text-blue-100"> 
                  Wiring, switches, lights, electrical repairs, 
                installation and maintenance services. 
                </p> 
              </div> 
 
              <button 
              onClick={() => navigate("/Userelectri")} 
              className="mt-8 w-fit rounded-xl bg-white px-6 py-3 font-bold text-blue-900 transition hover:bg-blue-100"> 
                Book New → 
              </button> 
 
            </div> 
          </div> 
 
 
          {/* PLUMBER */} 
          <div className="group relative min-h-[360px] overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 to-blue-700 p-8 shadow-2xl"> 
 
            <div className="absolute -bottom-20 -right-10 h-56 w-56 rounded-full bg-white/10"></div> 
 
            <div className="relative z-10 flex h-full flex-col justify-between"> 
 
              <div> 
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-xl"> 
                  🔧 
                </div> 
 
                <p className="mt-8 text-sm font-bold uppercase tracking-widest text-blue-200"> 
                 Plumbing Service 
                </p> 
 
                <h3 className="mt-2 text-3xl font-black text-white"> 
                  Plumber Booking 
                </h3> 
 
                <p className="mt-4 max-w-md leading-7 text-blue-100"> 
                 Pipe repair, water leakage, taps, bathroom fittings, 
                installation and other plumbing services. 
                </p> 
              </div> 
 
              <button
               onClick={() => navigate("/UserAllPlumberworker")}
              className="mt-8 w-fit rounded-xl bg-white px-6 py-3 font-bold text-blue-900 transition hover:bg-blue-50"> 
                Book Now → 
              </button> 
 
            </div> 
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
 
export default Booking;