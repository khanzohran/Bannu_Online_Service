
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";

const API = import.meta.env.VITE_Backend_base_ULR;

const ENDPOINTS = {
  electricalProducts: "/EPcreate/MyEpfindApi",
  plumbingProducts: "/PPcreate/MyPpfindApi",
  electricalOrders: "/Electerorder/myOrdersApi",
  plumbingOrders: "/plumborder/myOrdersApi",
  electricianWorkers: "/workerroute/MyElectritionFindApi",
  plumberWorkers: "/workerroute/MyPlumberFindApi",
};

const REQUESTS = [
  {
    name: "Electrical Products",
    url: ENDPOINTS.electricalProducts,
    type: "product",
    category: "Electrical",
    keys: ["findobj", "products"],
  },
  {
    name: "Plumbing Products",
    url: ENDPOINTS.plumbingProducts,
    type: "product",
    category: "Plumbing",
    keys: ["findobj", "products"],
  },
  {
    name: "Electrical Orders",
    url: ENDPOINTS.electricalOrders,
    type: "order",
    category: "Electrical",
    keys: ["orderfindobj", "orders"],
  },
  {
    name: "Plumbing Orders",
    url: ENDPOINTS.plumbingOrders,
    type: "order",
    category: "Plumbing",
    keys: ["orderfindobj", "orders"],
  },
  {
    name: "Electricians",
    url: ENDPOINTS.electricianWorkers,
    type: "worker",
    category: "Electrician",
    keys: ["workers", "findobj", "Efind", "ebooking"],
  },
  {
    name: "Plumbers",
    url: ENDPOINTS.plumberWorkers,
    type: "worker",
    category: "Plumber",
    keys: ["workers", "findobj", "plumbers"],
  },
];

const money = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-PK")}`;

function getArray(data, keys) {
  if (Array.isArray(data)) return data;

  for (const key of keys) {
    if (Array.isArray(data?.[key])) {
      return data[key];
    }
  }

  return [];
}

function Shopdashbord() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [search, setSearch] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setErrors([]);

    try {
      const results = await Promise.allSettled(
        REQUESTS.map((request) =>
          axios.get(`${API}${request.url}`, {
            withCredentials: true,
          })
        )
      );

      const nextProducts = [];
      const nextOrders = [];
      const nextWorkers = [];
      const nextErrors = [];

      results.forEach((result, index) => {
        const request = REQUESTS[index];

        if (result.status === "rejected") {
          console.error(
            `${request.name} error:`,
            result.reason?.response?.data ||
              result.reason?.message
          );

          nextErrors.push(
            `${request.name} load nahi hua. API route aur login check karein.`
          );
          return;
        }

        const response = result.value.data;

        if (response?.success === false) {
          nextErrors.push(`${request.name}: API request successful nahi hui.`);
          return;
        }

        const list = getArray(response, request.keys);

        if (request.type === "product") {
          nextProducts.push(
            ...list.map((item) => ({
              ...item,
              _category: request.category,
            }))
          );
        } else if (request.type === "order") {
          nextOrders.push(
            ...list.map((item) => ({
              ...item,
              _category: request.category,
            }))
          );
        } else {
          nextWorkers.push(
            ...list.map((item) => ({
              ...item,
              _workerType: request.category,
            }))
          );
        }
      });

      // Order mein productId se product details match karein.
      const productMap = new Map(
        nextProducts.map((product) => [
          String(product._id),
          product,
        ])
      );

      const enrichedOrders = nextOrders.map((order) => {
        const productId =
          typeof order.productId === "object"
            ? order.productId?._id
            : order.productId;

        const product = productMap.get(String(productId));

        if (!product) return order;

        return {
          ...product,
          ...order,
          ProductName: order.ProductName || product.ProductName,
          Brand: order.Brand || product.Brand,
          Imageurl: order.Imageurl || product.Imageurl,
          price: order.price ?? product.price,
        };
      });

      setProducts(nextProducts);
      setOrders(enrichedOrders);
      setWorkers(nextWorkers);
      setErrors(nextErrors);
    } catch (error) {
      console.error("Dashboard error:", error);
      setErrors(["Dashboard load nahi hua. Backend aur login check karein."]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const query = search.trim().toLowerCase();

  const filteredProducts = useMemo(
    () =>
      products.filter((item) =>
        `${item.ProductName || ""} ${item.Brand || ""} ${item._category}`
          .toLowerCase()
          .includes(query)
      ),
    [products, query]
  );

  const filteredOrders = useMemo(
    () =>
      orders.filter((item) =>
        `${item.ProductName || ""} ${item.Name || ""} ${
          item.phonenumber || ""
        } ${item.Location || ""} ${item._category}`
          .toLowerCase()
          .includes(query)
      ),
    [orders, query]
  );

  const filteredWorkers = useMemo(
    () =>
      workers.filter((item) =>
        `${item.Name || ""} ${item.Yourname || ""} ${
          item.name || ""
        } ${item.ContactNumber || ""} ${
          item.phonenumber || ""
        } ${item.PhoneNumber || ""} ${item._workerType}`
          .toLowerCase()
          .includes(query)
      ),
    [workers, query]
  );

  const electricalCount = products.filter(
    (item) => item._category === "Electrical"
  ).length;

  const plumbingCount = products.filter(
    (item) => item._category === "Plumbing"
  ).length;

  return (
    <div className="min-h-screen bg-[#eef3f9] md:flex">
      <AdminSidebar />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        {/* HEADER */}
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Bannu Online Services
            </p>

            <h1 className="mt-1 text-2xl font-extrabold text-blue-950 sm:text-3xl">
              Shop Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Apne products, orders aur service team manage karein.
            </p>
          </div>

          <button
            type="button"
            onClick={loadDashboard}
            disabled={loading}
            className="rounded-xl bg-blue-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh Dashboard"}
          </button>
        </header>

        {/* SUMMARY CARDS */}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            icon="📦"
            title="Total Products"
            count={products.length}
            hint={`${electricalCount} Electrical · ${plumbingCount} Plumbing`}
          />

          <SummaryCard
            icon="🛒"
            title="Total Orders"
            count={orders.length}
          />

          <SummaryCard
            icon="🔧"
            title="Total Workers"
            count={workers.length}
          />
        </section>

        {/* SEARCH */}
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Products, orders ya workers search karein..."
          aria-label="Search dashboard"
          className="mb-6 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />

        {/* ERRORS */}
        {errors.length > 0 && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
          >
            <p className="font-bold">Kuch data load nahi hua:</p>

            <ul className="mt-2 list-inside list-disc space-y-1">
              {errors.map((error, index) => (
                <li key={`${error}-${index}`} className="break-words">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* PRODUCTS */}
        <DashboardSection
          title="All Products"
          count={filteredProducts.length}
          loading={loading}
          empty="Koi product nahi mila."
        >
          {filteredProducts.map((item, index) => (
            <article
              key={`${item._category}-${item._id || index}`}
              className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-blue-300 sm:gap-4 sm:px-4"
            >
              <Thumb
                src={item.Imageurl}
                fallback="📦"
                alt={item.ProductName}
              />

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-bold text-slate-800">
                  {item.ProductName || "Unnamed Product"}
                </h3>

                <Tag>{item._category}</Tag>

                <p className="mt-1 break-words text-xs text-slate-500">
                  Brand: {item.Brand || "N/A"} · Discount:{" "}
                  {item.Discount ?? 0}%
                </p>
              </div>

              <p className="shrink-0 text-right text-sm font-extrabold text-blue-700">
                {money(item.price)}
              </p>
            </article>
          ))}
        </DashboardSection>

        {/* ORDERS */}
        <DashboardSection
          title="All Orders"
          count={filteredOrders.length}
          loading={loading}
          empty="Koi order nahi mila."
        >
          {filteredOrders.map((item, index) => (
            <article
              key={`${item._category}-${item._id || index}`}
              className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-blue-300 sm:gap-4 sm:px-4"
            >
              <Thumb
                src={item.Imageurl}
                fallback="🛒"
                alt={item.ProductName}
              />

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-bold text-slate-800">
                  {item.ProductName || "Product Order"}
                </h3>

                <Tag>{item._category}</Tag>

                <p className="mt-1 break-words text-xs text-slate-600">
                  Customer: {item.Name || "N/A"} · Phone:{" "}
                  {item.phonenumber || "N/A"}
                </p>

                <p className="mt-1 break-words text-xs text-slate-500">
                  Location: {item.Location || "N/A"} · Quantity:{" "}
                  {item.stock ?? 1}
                </p>
              </div>

              <p className="shrink-0 text-right text-sm font-extrabold text-blue-700">
                {money(item.price)}
              </p>
            </article>
          ))}
        </DashboardSection>

        {/* WORKERS WITH IMAGES */}
        <DashboardSection
          title="Service Team"
          count={filteredWorkers.length}
          loading={loading}
          empty="Koi electrician ya plumber nahi mila."
        >
          {filteredWorkers.map((item, index) => (
            <WorkerRow
              key={`${item._workerType}-${item._id || index}`}
              worker={item}
            />
          ))}
        </DashboardSection>

        <footer className="py-4 text-center text-xs text-slate-400">
          Bannu Online Services · Shop Dashboard
        </footer>
      </main>
    </div>
  );
}

function DashboardSection({ title, count, loading, empty, children }) {
  const items = React.Children.toArray(children);

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center gap-3">
        <h2 className="text-lg font-extrabold text-blue-950 sm:text-xl">
          {title}
        </h2>

        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-sm">
          {count}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {loading ? (
          <p className="py-8 text-sm text-slate-500">
            Loading data...
          </p>
        ) : items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
            {empty}
          </p>
        ) : (
          items
        )}
      </div>
    </section>
  );
}

function SummaryCard({ icon, title, count, hint }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-2xl">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-extrabold text-blue-950">
          {count}
        </p>
        {hint && (
          <p className="text-xs text-slate-400">{hint}</p>
        )}
      </div>
    </div>
  );
}

function Thumb({ src, fallback, alt = "" }) {
  const [failed, setFailed] = useState(false);
  const url = typeof src === "string" ? src.trim() : "";

  useEffect(() => {
    setFailed(false);
  }, [url]);

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-50 text-xl">
      {url && !failed ? (
        <img
          src={url}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain"
        />
      ) : (
        <span aria-hidden="true">{fallback}</span>
      )}
    </div>
  );
}

function WorkerRow({ worker }) {
  const [imageFailed, setImageFailed] = useState(false);

  // Common image fields; the field used by your model must match one of these.
  const image =
    worker.Image ||
    worker.Imageurl ||
    worker.image ||
    worker.imageUrl ||
    worker.UserImg ||
    worker.ProfileImage ||
    worker.ProfileImageUrl ||
    worker.Photo ||
    worker.photo ||
    worker.YourImage ||
    worker.WorkerImage ||
    worker.imageURL ||
    "";

  const workerName =
    worker.Name ||
    worker.Yourname ||
    worker.name ||
    worker.FullName ||
    worker.YourName ||
    "Service Provider";

  const phone =
    worker.ContactNumber ||
    worker.phonenumber ||
    worker.PhoneNumber ||
    worker.usernumber ||
    worker.Phone ||
    "N/A";

  const location =
    worker.ShopLocation ||
    worker.shoplocation ||
    worker.location ||
    worker.PhysicalShopLocation ||
    worker.Location ||
    "N/A";

  const isElectrician = worker._workerType === "Electrician";

  useEffect(() => {
    setImageFailed(false);
  }, [image]);

  return (
    <article className="flex w-full min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-blue-300 hover:shadow-md sm:gap-5 sm:px-4">
      {/* WORKER IMAGE */}
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-blue-50 sm:h-20 sm:w-20">
        {image && !imageFailed ? (
          <img
            src={image}
            alt={workerName}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-3xl" aria-label={worker._workerType}>
            {isElectrician ? "⚡" : "🔧"}
          </span>
        )}
      </div>

      {/* WORKER DETAILS */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-extrabold text-slate-800 sm:text-base">
          {workerName}
        </h3>

        <Tag>{worker._workerType}</Tag>

        <p className="mt-2 break-words text-xs text-slate-500 sm:text-sm">
          <span className="font-semibold text-slate-700">Phone:</span>{" "}
          {phone}
        </p>

        <p className="mt-1 break-words text-xs text-slate-500 sm:text-sm">
          <span className="font-semibold text-slate-700">Location:</span>{" "}
          {location}
        </p>
      </div>

      <div className="hidden shrink-0 rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 sm:block">
        {isElectrician ? "Electrician" : "Plumber"}
      </div>
    </article>
  );
}

function Tag({ children }) {
  return (
    <span className="mt-1 inline-block rounded-md bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-700">
      {children}
    </span>
  );
}

export default Shopdashbord;
