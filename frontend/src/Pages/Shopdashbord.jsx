import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";

const API = import.meta.env.VITE_Backend_base_ULR;

const ENDPOINTS = {
  electricalProducts: "/EPcreate/EpfindApi",
  plumbingProducts: "/PPcreate/PPfindApi",
  electricalOrders: "/Electerorder/orderfindApi",
  plumbingOrders: "/plumborder/orderfindApi",
  electricianWorkers: "/workerroute/MyElectritionFindApi",
  plumberWorkers: "/workerroute/MyPlumberFindApi",
};

const REQUESTS = [
  { name: "Electrical Products", url: ENDPOINTS.electricalProducts, type: "product", category: "Electrical", keys: ["findobj", "products"] },
  { name: "Plumbing Products", url: ENDPOINTS.plumbingProducts, type: "product", category: "Plumbing", keys: ["findobj", "products"] },
  { name: "Electrical Orders", url: ENDPOINTS.electricalOrders, type: "order", category: "Electrical", keys: ["orderfindobj", "orders"] },
  { name: "Plumbing Orders", url: ENDPOINTS.plumbingOrders, type: "order", category: "Plumbing", keys: ["orderfindobj", "orders"] },
  { name: "Electricians", url: ENDPOINTS.electricianWorkers, type: "worker", category: "Electrician", keys: ["workers"] },
  { name: "Plumbers", url: ENDPOINTS.plumberWorkers, type: "worker", category: "Plumber", keys: ["workers"] },
];

// ================= HELPERS =================

const money = (v) => "Rs. " + Number(v || 0).toLocaleString("en-PK");

// Pehle diye gaye keys dekhta hai, na mile to response ki pehli array utha leta hai
function getArray(data, keys) {
  if (Array.isArray(data)) return data;
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  if (data && typeof data === "object") {
    const firstArray = Object.values(data).find((v) => Array.isArray(v));
    if (firstArray) return firstArray;
  }
  return [];
}

const getShopName = (w) => {
  const shop = w.BelongsToShop;
  if (typeof shop === "string" && shop) return shop;
  return (
    shop?.Shopname ||
    shop?.ShopName ||
    w.OurShop?.Shopname ||
    w.OurShop?.ShopName ||
    w.OurShop?.name ||
    "N/A"
  );
};

const getShopLocation = (w) =>
  w.ShopLocation ||
  w.OurShop?.shoplocation ||
  w.OurShop?.ShopLocation ||
  w.OurShop?.PhysicalShopLocation ||
  "N/A";

const matches = (text, q) => text.toLowerCase().includes(q.trim().toLowerCase());

// ================= PAGE =================

const Shopdashbord = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [search, setSearch] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setErrors([]);

    const results = await Promise.allSettled(
      REQUESTS.map((r) => axios.get(API + r.url, { withCredentials: true }))
    );

    const productList = [];
    let orderList = [];
    let workerList = [];
    const problems = [];

    results.forEach((result, i) => {
      const req = REQUESTS[i];

      if (result.status === "rejected") {
        const status = result.reason?.response?.status;
        console.error(req.name, "error:", result.reason?.response?.data || result.reason?.message);
        problems.push(
          `${req.name} load nahi hua (${status ? "status " + status : "network/CORS error"}) - ${req.url}`
        );
        return;
      }

      const data = result.value.data;
      console.log(req.name, "response:", data);
      const list = getArray(data, req.keys);

      if (req.type === "product") {
        productList.push(...list.map((x) => ({ ...x, _category: req.category })));
      } else if (req.type === "order") {
        orderList.push(...list.map((x) => ({ ...x, _category: req.category })));
      } else {
        workerList.push(...list.map((x) => ({ ...x, _workerType: req.category })));
      }
    });

    // Orders mein product ka naam/price/image productId se jod do
    const productMap = {};
    productList.forEach((p) => (productMap[p._id] = p));

    orderList = orderList.map((o) => {
      const p = productMap[o.productId];
      if (!p) return o;
      return {
        ProductName: p.ProductName,
        Brand: p.Brand,
        Imageurl: p.Imageurl,
        price: p.price,
        ...o,
      };
    });

    setProducts(productList);
    setOrders(orderList);
    setWorkers(workerList);
    setErrors(problems);
    setLoading(false);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const electricalCount = useMemo(
    () => products.filter((p) => p._category === "Electrical").length,
    [products]
  );
  const plumbingCount = products.length - electricalCount;

  const q = search;
  const filteredProducts = products.filter((p) =>
    matches(`${p.ProductName || ""} ${p.Brand || ""} ${p._category}`, q)
  );
  const filteredOrders = orders.filter((o) =>
    matches(`${o.ProductName || ""} ${o.Name || ""} ${o.phonenumber || ""} ${o._category}`, q)
  );
  const filteredWorkers = workers.filter((w) =>
    matches(
      `${w.Name || ""} ${w.ContactNumber || ""} ${w._workerType} ${getShopName(w)} ${getShopLocation(w)}`,
      q
    )
  );

  return (
    <div className="min-h-screen bg-[#eef3f9] md:flex">
      <AdminSidebar />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        {/* ========== HEADER ========== */}
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">Bannu Online Services</p>
            <h1 className="mt-1 text-2xl font-extrabold text-blue-950 sm:text-3xl">
              Shop Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Products, orders aur service team ek jagah.
            </p>
          </div>
        </header>

        {/* ========== SUMMARY ========== */}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard icon="📦" title="Total Products" count={products.length} hint={`${electricalCount} Electrical · ${plumbingCount} Plumbing`} />
          <SummaryCard icon="🛒" title="Total Orders" count={orders.length} />
          <SummaryCard icon="🔧" title="Total Workers" count={workers.length} />
        </section>

        {/* ========== SEARCH ========== */}
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Products, orders, workers search karein"
          aria-label="Search"
          className="mb-6 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />

        {/* ========== ERRORS ========== */}
        {errors.length > 0 && (
          <div role="alert" className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-bold">Kuch data load nahi hua:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              {errors.map((e, i) => (
                <li key={i} className="break-words">{e}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ========== PRODUCTS (full width rows) ========== */}
        <Row list title="All Products" count={filteredProducts.length} loading={loading} empty="Koi product nahi mila.">
          {filteredProducts.map((p, i) => (
            <ProductRow key={`${p._category}-${p._id || i}`} product={p} />
          ))}
        </Row>

        {/* ========== ORDERS (full width rows) ========== */}
        <Row list title="All Orders" count={filteredOrders.length} loading={loading} empty="Koi order nahi mila.">
          {filteredOrders.map((o, i) => (
            <OrderRow key={`${o._category}-${o._id || i}`} order={o} />
          ))}
        </Row>

        {/* ========== WORKERS (full width, kam height wali rows) ========== */}
        <Row list title="Workers" count={filteredWorkers.length} loading={loading} empty="Koi worker nahi mila.">
          {filteredWorkers.map((w) => (
            <WorkerRow key={`${w._workerType}-${w._id}`} worker={w} />
          ))}
        </Row>

        <footer className="py-4 text-center text-xs text-slate-400">
          Bannu Online Services · Shop Dashboard
        </footer>
      </main>
    </div>
  );
};

// ================= SMALL COMPONENTS =================

// Har section: title + seedhi horizontal row (koi wrapper box nahi)
function Row({ title, count, loading, empty, list, children }) {
  const items = React.Children.toArray(children);

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center gap-3">
        <h2 className="text-lg font-extrabold text-blue-950 sm:text-xl">{title}</h2>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-sm">
          {count}
        </span>
      </div>

      {loading ? (
        <p className="py-8 text-sm text-slate-500">Loading data...</p>
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
          {empty}
        </p>
      ) : (
        list ? (
        <div className="flex flex-col gap-2">{items}</div>
      ) : (
        <div className="flex snap-x gap-4 overflow-x-auto pb-3">{items}</div>
      )
      )}
    </section>
  );
}

function Thumb({ src, fallback, alt }) {
  const [failed, setFailed] = useState(false);
  const url = typeof src === "string" ? src.trim() : "";

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-50 text-xl">
      {url && !failed ? (
        <img
          src={url}
          alt={alt || ""}
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

// Row ke andar ek column: chota label + value
function Cell({ label, children, className = "" }) {
  return (
    <div className={"min-w-0 " + className}>
      <p className="text-slate-400">{label}</p>
      <div className="truncate font-semibold text-slate-700">{children || "N/A"}</div>
    </div>
  );
}

function ProductRow({ product: p }) {
  return (
    <article className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm transition hover:border-blue-200 sm:gap-4 sm:px-4">
      <Thumb src={p.Imageurl} fallback="📦" alt={p.ProductName} />

      <div className="min-w-0 flex-1 sm:w-56 sm:flex-none">
        <h3 className="truncate text-sm font-extrabold text-slate-800">{p.ProductName || "Unnamed Product"}</h3>
        <Tag>{p._category}</Tag>
      </div>

      <div className="hidden min-w-0 flex-1 grid-cols-3 gap-4 text-xs sm:grid">
        <Cell label="Brand">{p.Brand}</Cell>
        <Cell label="Discount">{p.Discount}</Cell>
        <Cell label="Stock">{p.stock}</Cell>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-[11px] text-slate-400">Price</p>
        <p className="text-sm font-extrabold text-blue-700 sm:text-base">{money(p.price)}</p>
      </div>
    </article>
  );
}

function OrderRow({ order: o }) {
  const qty = Number(o.stock ?? 1);

  return (
    <article className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm transition hover:border-blue-200 sm:gap-4 sm:px-4">
      <Thumb src={o.Imageurl} fallback="🛒" alt={o.ProductName} />

      <div className="min-w-0 flex-1 sm:w-56 sm:flex-none">
        <h3 className="truncate text-sm font-extrabold text-slate-800">{o.ProductName || "Product Order"}</h3>
        <Tag>{o._category}</Tag>
      </div>

      <div className="hidden min-w-0 flex-1 grid-cols-4 gap-4 text-xs sm:grid">
        <Cell label="Customer">{o.Name}</Cell>
        <Cell label="Phone">
          {o.phonenumber && (
            <a href={`tel:${o.phonenumber}`} className="hover:text-blue-700">
              {o.phonenumber}
            </a>
          )}
        </Cell>
        <Cell label="Location">{o.Location}</Cell>
        <Cell label="Quantity">{qty}</Cell>
      </div>

      <div className="shrink-0 text-right">
        <p className="max-w-[7rem] truncate text-[11px] text-slate-500 sm:hidden">{o.Name || "N/A"}</p>
        <p className="text-[11px] text-slate-400">Price</p>
        <p className="text-sm font-extrabold text-blue-700 sm:text-base">{money(o.price)}</p>
      </div>
    </article>
  );
}

function WorkerRow({ worker: w }) {
  const [imgFailed, setImgFailed] = useState(false);
  const img = typeof w.Image === "string" ? w.Image.trim() : "";
  const isElectrician = w._workerType === "Electrician";

  return (
    <article className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm transition hover:border-blue-200 sm:gap-4 sm:px-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-50 text-xl">
        {img && !imgFailed ? (
          <img
            src={img}
            alt={w.Name || w._workerType}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span aria-hidden="true">{isElectrician ? "⚡" : "🔧"}</span>
        )}
      </div>

      <div className="min-w-0 flex-1 sm:w-48 sm:flex-none">
        <h3 className="truncate text-sm font-extrabold text-slate-800">{w.Name || w._workerType}</h3>
        <Tag>{w._workerType}</Tag>
      </div>

      <div className="hidden min-w-0 flex-1 grid-cols-3 gap-4 text-xs sm:grid">
        <div className="min-w-0">
          <p className="text-slate-400">Phone</p>
          {w.ContactNumber ? (
            <a href={`tel:${w.ContactNumber}`} className="block truncate font-semibold text-slate-700 hover:text-blue-700">
              {w.ContactNumber}
            </a>
          ) : (
            <p className="font-semibold text-slate-500">N/A</p>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-slate-400">Shop</p>
          <p className="truncate font-semibold text-slate-700">{getShopName(w)}</p>
        </div>
        <div className="min-w-0">
          <p className="text-slate-400">Location</p>
          <p className="truncate font-semibold text-slate-700">{getShopLocation(w)}</p>
        </div>
      </div>

      {/* Mobile: chhoti screen par details neeche ek line mein */}
      <div className="min-w-0 text-right text-xs sm:hidden">
        {w.ContactNumber && (
          <a href={`tel:${w.ContactNumber}`} className="block font-semibold text-blue-700">
            {w.ContactNumber}
          </a>
        )}
        <p className="truncate text-slate-500">{getShopName(w)}</p>
      </div>
    </article>
  );
}

function SummaryCard({ icon, title, count, hint }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-2xl" aria-hidden="true">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-extrabold text-blue-950">{count}</p>
        {hint && <p className="truncate text-xs text-slate-400">{hint}</p>}
      </div>
    </div>
  );
}

function Tag({ children }) {
  return (
    <span className="shrink-0 rounded-md bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-700">
      {children}
    </span>
  );
}

function Line({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3 text-xs">
      <span className="shrink-0 text-slate-500">{label}</span>
      <span className="break-words text-right font-semibold text-slate-700">{value || "N/A"}</span>
    </div>
  );
}

export default Shopdashbord;