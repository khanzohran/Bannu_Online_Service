import React from "react";
import AdminSideber from "../components/AdminSidebar"


function Customers() {
  return (
    <div>
                <AdminSideber/>

      <h1 className="text-3xl font-bold">Customers</h1>

      <div className="mt-8 rounded-xl border bg-white p-6">
        <p className="text-zinc-500">
          All registered customers will appear here.
        </p>
      </div>
    </div>
  );
}

export default Customers;