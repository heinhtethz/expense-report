import React from "react";

const Header = ({ data, updateField }: any) => {
  return (
    <div>
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 border-b pb-2">
          Header Information
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700">
              Port
            </label>
            <input
              type="text"
              value={data.port}
              onChange={(e) =>
                updateField("port", e.target.value.toUpperCase())
              }
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm p-2 border bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              type="text"
              value={data.name}
              onChange={(e) =>
                updateField("name", e.target.value.toUpperCase())
              }
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm p-2 border bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Date
            </label>
            <input
              type="date"
              value={data.date}
              onChange={(e) => updateField("date", e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm outline-none focus:ring-1 focus:ring-indigo-500sm:text-sm p-2 border bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Balance Amount
            </label>
            <input
              type="number"
              onWheel={(e) => e.currentTarget.blur()}
              value={
                data.balanceAmount === 0 || data.balanceAmount < 0
                  ? ""
                  : data.balanceAmount
              }
              onChange={(e) =>
                updateField(
                  "balanceAmount",
                  e.target.value === "" ? 0 : Number(e.target.value),
                )
              }
              className="mt-1 w-full rounded-md border-slate-300 shadow-sm outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm p-2 border bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Balance Date
            </label>
            <input
              type="date"
              value={data.balanceDate ? data.balanceDate : ""}
              onChange={(e) => updateField("balanceDate", e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm p-2 border bg-white"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">
              Advance Amount
            </label>
            <input
              type="number"
              onWheel={(e) => e.currentTarget.blur()}
              value={
                data.advanceAmount === 0 || data.advanceAmount < 0
                  ? ""
                  : data.advanceAmount
              }
              onChange={(e) =>
                updateField(
                  "advanceAmount",
                  e.target.value === "" ? 0 : Number(e.target.value),
                )
              }
              className="mt-1 w-full rounded-md border-slate-300 shadow-sm outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm p-2 border bg-white"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">
              Advance Date
            </label>
            <input
              type="date"
              value={data.advanceDate ? data.advanceDate : ""}
              onChange={(e) => updateField("advanceDate", e.target.value)}
              className="mt-1 w-full rounded-md border-slate-300 shadow-sm outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm p-2 border bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
