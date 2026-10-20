import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Admin2ndsidebar from "../components/Admin2ndsidebar.jsx";

const API = import.meta.env.VITE_Backend_base_ULR;

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [deleteError, setDeleteError] = useState("");

  // Fetch all registered customers
  const fetchCustomers = useCallback(async () => {
    if (!API) {
      setError("Backend URL .env file mein set nahi hai.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${API}/Login/AllCustomers`,
        { withCredentials: true }
      );

      if (response.data.success === true) {
        setCustomers(
          Array.isArray(response.data.customers)
            ? response.data.customers
            : []
        );
      } else {
        setError(
          response.data.msg || "Customers load nahi huay."
        );
      }
    } catch (err) {
      console.error(
        "Customers fetch error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.msg ||
          "Customers load nahi huay. Backend aur login check karein."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Delete customer
  const handleDelete = async (customer) => {
    const confirmed = window.confirm(
      `Kya aap "${customer.Name || "this customer"}" ko delete karna chahte hain?`
    );

    if (!confirmed) return;

    setDeletingId(customer._id);
    setDeleteError("");

    try {
      const response = await axios.delete(
        `${API}/Login/DeleteCustomer/${customer._id}`,
        { withCredentials: true }
      );

      if (response.data.success === true) {
        setCustomers((previous) =>
          previous.filter((item) => item._id !== customer._id)
        );
      } else {
        setDeleteError(
          response.data.msg || "Customer delete nahi hua."
        );
      }
    } catch (err) {
      console.error(
        "Customer delete error:",
        err.response?.data || err.message
      );

      setDeleteError(
        err.response?.data?.msg ||
          "Customer delete nahi hua. Backend check karein."
      );
    } finally {
      setDeletingId("");
    }
  };

  // Search customers
  const query = search.toLowerCase().trim();

  const filteredCustomers = customers.filter((customer) => {
    return (
      (customer.Name || "").toLowerCase().includes(query) ||
      (customer.Email || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex min-h-dvh w-full flex-col bg-white md:flex-row">
      {/* Sidebar */}
      <Admin2ndsidebar />

      {/* Main Content: desktop sidebar width = 16rem */}
      <main className="min-w-0 w-full flex-1 px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-[1600px] min-w-0">

          {/* Header */}
          <section className="mb-5 flex min-w-0 flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mb-6 sm:flex-row sm:items-center sm:p-6">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                Bannu Online Services
              </p>

              <h1 className="mt-2 break-words text-2xl font-extrabold text-slate-900 sm:text-3xl">
                Customers
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                All registered customer accounts manage karein.
              </p>
            </div>

           
          </section>

          {/* Statistics */}
          <section className="mb-5 grid grid-cols-1 gap-4 sm:mb-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 h-27">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                  👥
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-slate-500">
                    Total Customers
                  </p>

                  <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
                    {customers.length}
                  </h2>
                </div>
              </div>
            </div>
 {/* Search */}
          <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:mb-6 sm:p-4">
            <label
              htmlFor="customer-search"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Search customers
            </label>

            <input
              id="customer-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </section>
           
          </section>

         

          {/* Errors */}
          {(error || deleteError) && (
            <div
              role="alert"
              className="mb-5 break-words rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
            >
              {error || deleteError}
            </div>
          )}

          {/* Customers Table */}
          <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-4 sm:p-5">
              <h2 className="text-lg font-bold text-slate-900">
                Registered Customers
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Customer name, email aur account management.
              </p>
            </div>

            {loading ? (
              <div className="p-10 text-center sm:p-14">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-800" />

                <p className="mt-4 text-sm text-slate-500">
                  Customers load ho rahe hain...
                </p>
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="px-4 py-12 text-center sm:px-6 sm:py-16">
                <div className="text-4xl sm:text-5xl">👥</div>

                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  No Customers Found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  {customers.length === 0
                    ? "Abhi koi registered User nahi mila."
                    : "Search mein koi customer match nahi hua."}
                </p>

                {error && (
                  <button
                    type="button"
                    onClick={fetchCustomers}
                    className="mt-4 rounded-lg bg-blue-950 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                  >
                    Try Again
                  </button>
                )}
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[650px] text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="whitespace-nowrap px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 sm:px-5">
                        #
                      </th>

                      <th className="whitespace-nowrap px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 sm:px-5">
                        Customer
                      </th>

                      <th className="whitespace-nowrap px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 sm:px-5">
                        Email Address
                      </th>

                      <th className="whitespace-nowrap px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 sm:px-5">
                        Role
                      </th>

                      <th className="whitespace-nowrap px-4 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500 sm:px-5">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredCustomers.map((customer, index) => (
                      <tr
                        key={customer._id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-4 py-4 text-sm text-slate-500 sm:px-5">
                          {index + 1}
                        </td>

                        <td className="px-4 py-4 sm:px-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-800">
                              {(customer.Name || "U")
                                .trim()
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <span className="font-semibold text-slate-900">
                              {customer.Name || "Name not available"}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600 sm:px-5">
                          {customer.Email || "Email not available"}
                        </td>

                        <td className="px-4 py-4 sm:px-5">
                          <span className="whitespace-nowrap rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-800">
                            {customer.Role || "User"}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-right sm:px-5">
                          <button
                            type="button"
                            onClick={() => handleDelete(customer)}
                            disabled={deletingId === customer._id}
                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
                          >
                            {deletingId === customer._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Footer */}
          <footer className="py-6 text-center text-xs text-slate-400">
            Bannu Online Services · Customer Management
          </footer>
        </div>
      </main>
    </div>
  );
}

export default Customers;
