import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const EBO = () => {
  const [Allplumber, setAllplumber] = useState([]);
  const navigate = useNavigate();

  async function plumbersumit() {
    try {
      let response = await axios.get(
        import.meta.env.VITE_Backend_base_ULR + "/Plumber/Pbookfindapi"
      );

      console.log(response.data);
      setAllplumber(response.data.plumberfind || []);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    plumbersumit();
  }, []);

 

 return (
  <div className="min-h-screen bg-slate-50 flex">

    {/* ================= SIDEBAR ================= */}
    <div className="shrink-0">
      <AdminSidebar />
    </div>

    {/* ================= MAIN CONTENT ================= */}
    <main className="flex-1 min-w-0 p-6 sm:p-8">

      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider">
          Bannu Online Services
        </p>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
          Plumber Bookings
        </h1>

        <p className="text-slate-500 mt-2">
          Manage all plumber service bookings.
        </p>
      </div>

      {/* ================= BOOKINGS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {Allplumber.map((eachData) => (
          <div
            key={eachData._id}
            className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden"
          >

            {/* ================= CARD HEADER ================= */}
            <div className="bg-blue-600 px-6 py-5">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-blue-100 text-xs uppercase tracking-wider">
                    Customer
                  </p>

                  <h2 className="text-xl font-bold text-white mt-1">
                    {eachData.Name}
                  </h2>
                </div>

                <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    E
                  </span>
                </div>

              </div>
            </div>

            {/* ================= CARD BODY ================= */}
            <div className="p-6">

              <div className="space-y-4">

                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">
                    Phone Number
                  </p>
                  <p className="text-slate-800 font-medium mt-1">
                    {eachData.usernumber}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">
                    Location
                  </p>
                  <p className="text-slate-800 font-medium mt-1">
                    {eachData.location}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">
                    Problem
                  </p>
                  <p className="text-slate-800 font-medium mt-1">
                    {eachData.Problem}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase">
                      Date
                    </p>
                    <p className="text-slate-800 font-medium mt-1">
                      {eachData.Date}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase">
                      Time
                    </p>
                    <p className="text-slate-800 font-medium mt-1">
                      {eachData.Time}
                    </p>
                  </div>

                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">
                    Description
                  </p>

                  <p className="text-slate-600 text-sm mt-1 leading-6">
                    {eachData.Description}
                  </p>
                </div>

              </div>

              {/* ================= BUTTONS ================= */}
              <div className="flex gap-3 mt-6 pt-5 border-t border-slate-100">

                <button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition"
                >
                  Update
                </button>

                <button
                onClick={async function () {
                  let response=await axios.post( import.meta.env.VITE_Backend_base_ULR +"/Plumber/deleteapi",
                    {  id:eachData._id}
                  );
                  console.log(response)
                  if(response.data.success==true){
                    plumbersumit() 
                  }
                  
                }}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl transition"
                >
                  Delete
                </button>

              </div>

            </div>
          </div>
        ))}

      </div>

    </main>
  </div>




);
};

export default EBO;