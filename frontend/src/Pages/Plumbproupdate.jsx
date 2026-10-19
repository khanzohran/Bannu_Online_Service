import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";

const Plumbproupdate = () => {
  const navigate = useNavigate();
  let Params = useParams();

  const [plumbupdate, setplumbupdate] = useState({
    ProductName: "",
    Brand: "",
    Imageurl: "",
    price: 0,
    Discount: "",
    Description: "",
  });

  async function plumbingproupdate() {
    let response = await axios.post(
      import.meta.env.VITE_Backend_base_ULR + "/PPcreate/PPfindoneApi",
      { id: Params.Allfindoneobj }
    );
    let plumbUpdateproduct = response.data.Allfindoneobj;
    console.log(plumbUpdateproduct, "The product update data");

    setplumbupdate({
      ...plumbupdate,
      ProductName: plumbUpdateproduct.ProductName,
      Brand: plumbUpdateproduct.Brand,
      Imageurl: plumbUpdateproduct.Imageurl,
      price: plumbUpdateproduct.price,
      Discount: plumbUpdateproduct.Discount,
      Description: plumbUpdateproduct.Description,
    });
  }

  useEffect(() => {
    plumbingproupdate();
  }, []);

  async function pproupdataSumit() {
    let response = await axios.post(
      import.meta.env.VITE_Backend_base_ULR + "/PPcreate/PPupdateApi",
      {
        ...plumbupdate,
        id: Params.Allfindoneobjid,
      }
    );
    console.log(response.data);

    if (response.data.success === true) {
      navigate("/Allplumbingproduct");
    }
  }

  return (
    <div className="flex min-h-dvh w-full flex-col bg-white md:flex-row">
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* CONTENT */}
      <main className="min-w-0 w-full flex-1 px-4 py-8 sm:px-6 lg:px-10">
        {/* HEADER */}
        <div className="mx-auto mb-8 max-w-5xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
            Admin Panel
          </p>

          <h1 className="text-3xl font-bold text-blue-950 sm:text-4xl">
            Electrical Product Create
          </h1>

          <p className="mt-2 text-gray-500">
            Add a new electrical product to your shop.
          </p>
        </div>

        {/* FORM CARD */}
        <div className="mx-auto max-w-5xl rounded-2xl border border-blue-100 bg-white p-6 shadow-lg sm:p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* PRODUCT NAME */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-blue-950">
                Product Name
              </label>

              <input
                value={plumbupdate.ProductName}
                onChange={(event) =>
                  setplumbupdate({
                    ...plumbupdate,
                    ProductName: event.target.value,
                  })
                }
                type="text"
                placeholder="Enter product name"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* BRAND */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-blue-950">
                Brand Name
              </label>

              <input
                value={plumbupdate.Brand}
                onChange={(event) =>
                  setplumbupdate({
                    ...plumbupdate,
                    Brand: event.target.value,
                  })
                }
                type="text"
                placeholder="Enter brand name"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* IMAGE URL */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-blue-950">
                Image URL
              </label>

              <input
                value={plumbupdate.Imageurl}
                onChange={(event) =>
                  setplumbupdate({
                    ...plumbupdate,
                    Imageurl: event.target.value,
                  })
                }
                type="url"
                placeholder="https://example.com/product-image.jpg"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

          

            {/* PRICE */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-blue-950">
                Price
              </label>

              <input
                value={plumbupdate.price}
                onChange={(event) =>
                  setplumbupdate({
                    ...plumbupdate,
                    price: event.target.value,
                  })
                }
                type="number"
                placeholder="Enter product price"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* DISCOUNT */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-blue-950">
                Discount (%)
              </label>

              <input
                value={plumbupdate.Discount}
                onChange={(event) =>
                  setplumbupdate({
                    ...plumbupdate,
                    Discount: event.target.value,
                  })
                }
                type="number"
                placeholder="Enter discount"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-blue-950">
                Product Description
              </label>

              <textarea
                value={plumbupdate.Description}
                onChange={(event) =>
                  setplumbupdate({
                    ...plumbupdate,
                    Description: event.target.value,
                  })
                }
                rows="5"
                placeholder="Write product description..."
                className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              ></textarea>
            </div>
          </div>

          {/* UPDATE BUTTON */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={pproupdataSumit}
              type="button"
              className="rounded-xl bg-blue-700 px-8 py-3 font-semibold text-white shadow-md transition hover:bg-blue-800 hover:shadow-lg"
            >
              Product Update
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Plumbproupdate;