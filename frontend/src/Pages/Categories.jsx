import AdminSideber from "../components/AdminSidebar"

function Categories() {
  return (
    <div>
                <AdminSideber/>

      <h1 className="text-3xl font-bold">Categories</h1>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-6">
          <h2 className="text-xl font-semibold">Plumbing</h2>
          <p className="mt-2 text-zinc-500">
            Pipes, taps, pumps, valves and plumbing tools.
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h2 className="text-xl font-semibold">Electrical</h2>
          <p className="mt-2 text-zinc-500">
            Wires, switches, sockets, bulbs and electrical tools.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Categories;