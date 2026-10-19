import React from "react";
import AdminSideber from "../components/AdminSidebar"

function Products() {

  return (
    <div>
                <AdminSideber/>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>

        <button className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700">
          + Add Product
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-left">
          <thead className="bg-zinc-50">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t">
              <td className="p-4">Water Pump</td>
              <td className="p-4">Plumbing</td>
              <td className="p-4">Rs. 8,500</td>
              <td className="p-4">20</td>
              <td className="p-4">
                <button className="mr-2 text-blue-600">Update</button>
                <button className="text-red-600">Delete</button>
              </td>
            </tr>

            <tr className="border-t">
              <td className="p-4">Electrical Wire</td>
              <td className="p-4">Electrical</td>
              <td className="p-4">Rs. 2,500</td>
              <td className="p-4">50</td>
              <td className="p-4">
                <button className="mr-2 text-blue-600">Update</button>
                <button className="text-red-600">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Products;