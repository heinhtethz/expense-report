import React, { useRef, useState } from "react";
import {
  DocumentData,
  Expense,
  JobExpense,
  SimpleExpense,
} from "../../util/types";
import {
  newExportExamJob,
  newExportJob,
  newImportExamJob,
  newImportJob,
} from "../../util/constants";

interface EditorProps {
  data: DocumentData;
  onChange: (data: DocumentData) => void;
}

export const Editor: React.FC<EditorProps> = ({ data, onChange }) => {
  const [showJobTemplate, setShowJobTemplate] = useState(false);
  const updateField = (field: keyof DocumentData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const addJob = (index: number) => {
    const jobTemplate = [
      newImportJob,
      newExportJob,
      newImportExamJob,
      newExportExamJob,
    ];

    const template = jobTemplate[index];
    const job = {
      ...template,
      id: crypto.randomUUID(),
    };
    onChange({ ...data, expenses: [...data.expenses, job] });
    setShowJobTemplate(false);
  };

  const addSimple = () => {
    const newSimple: SimpleExpense = {
      id: crypto.randomUUID(),
      type: "simple",
      label: "Misc Expense",
      amount: 0,
    };
    onChange({ ...data, expenses: [...data.expenses, newSimple] });
  };

  const clearAllExpenses = () => {
    if (confirm("Remove all current expenses from the list?")) {
      onChange({ ...data, expenses: [] });
    }
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    const newExpenses = data.expenses.map((e) =>
      e.id === id ? ({ ...e, ...updates } as Expense) : e,
    );
    onChange({ ...data, expenses: newExpenses });
  };

  const removeExpense = (id: string) => {
    onChange({ ...data, expenses: data.expenses.filter((e) => e.id !== id) });
  };

  const addSubExpense = (jobId: string) => {
    const newExpenses = data.expenses.map((e) => {
      if (e.id === jobId && e.type === "job") {
        return {
          ...e,
          subExpenses: [
            ...(e.subExpenses ?? []),
            { id: crypto.randomUUID(), label: "New Item", amount: 0 },
          ],
        };
      }
      return e;
    });
    onChange({ ...data, expenses: newExpenses as Expense[] });
  };

  const removeSubExpense = (jobId: string, subId: string) => {
    const newExpenses = data.expenses.map((e) => {
      if (e.id === jobId && e.type === "job") {
        return {
          ...e,
          subExpenses: e.subExpenses.filter((s) => s.id !== subId),
        };
      }
      return e;
    });
    onChange({ ...data, expenses: newExpenses as Expense[] });
  };

  return (
    <div className="flex-1 flex flex-col gap-6 p-6 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
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

      <div className="space-y-4">
        <div className="flex flex-col gap-3 border-b pb-2">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">Expenses</h2>
            <button
              onClick={clearAllExpenses}
              className="text-[10px] font-bold text-red-500 hover:text-red-700 uppercase tracking-tighter"
            >
              Clear All
            </button>
          </div>
          <div className="relative flex gap-2">
            <button
              onClick={() => setShowJobTemplate(!showJobTemplate)}
              className="flex-1 text-xs bg-indigo-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-indigo-700 transition shadow-sm"
            >
              + Add Job
            </button>

            {showJobTemplate && (
              <div className="absolute left-0 top-10 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-100">
                <button
                  onClick={() => addJob(0)}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-400 transition-colors"
                >
                  Add Import Job
                </button>
                <button
                  onClick={() => addJob(1)}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-400 transition-colors"
                >
                  Add Export Job
                </button>
                <button
                  onClick={() => addJob(2)}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-400 transition-colors"
                >
                  Add Import Exam Job
                </button>
                <button
                  onClick={() => addJob(3)}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-400 transition-colors"
                >
                  Add Export Exam Job
                </button>
              </div>
            )}

            <button
              onClick={addSimple}
              className="flex-1 text-xs bg-slate-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-slate-700 transition shadow-sm"
            >
              + Add Expense
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {data.expenses.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
              <p className="text-sm text-slate-400 font-medium italic">
                No expenses added yet.
              </p>
            </div>
          ) : (
            data.expenses.map((expense, idx) => (
              <div
                key={idx}
                className="relative p-4 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition"
              >
                <button
                  onClick={() => removeExpense(expense.id)}
                  className="absolute top-3 right-3 text-slate-300 hover:text-red-500 p-1 transition-colors"
                  title="Remove item"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-xs font-bold bg-indigo-50 text-indigo-600 w-6 h-6 flex items-center justify-center rounded-full">
                    {idx + 1}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${expense.type === "job" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"}`}
                  >
                    {expense.type}
                  </span>
                </div>
                {expense.type === "job" ? (
                  <div className="space-y-4">
                    <textarea
                      value={expense.title}
                      placeholder="Job Title"
                      onChange={(e) =>
                        updateExpense(expense.id, {
                          title: e.target.value.toUpperCase(),
                        })
                      }
                      className="w-full font-bold text-lg border-b border-transparent focus:border-slate-200 p-1 outline-none"
                    />
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap">
                        Base Fee:
                      </span>
                      <input
                        type="number"
                        onWheel={(e) => e.currentTarget.blur()}
                        value={expense.baseAmount || ""}
                        onChange={(e) =>
                          updateExpense(expense.id, {
                            baseAmount: Number(e.target.value),
                          })
                        }
                        className="w-full text-sm border p-2 rounded-lg bg-slate-50 border-slate-200 focus:bg-white transition-all outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="lg:ml-4 space-y-3 pt-2 border-l-2 border-slate-100 lg:pl-4">
                      {expense.subExpenses?.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex lg:gap-2 items-center"
                        >
                          <input
                            type="text"
                            value={sub.label}
                            onChange={(e) => {
                              const subs = expense.subExpenses.map((s) =>
                                s.id === sub.id
                                  ? {
                                      ...s,
                                      label: e.target.value.toUpperCase(),
                                    }
                                  : s,
                              );
                              updateExpense(expense.id, { subExpenses: subs });
                            }}
                            className="flex-1 text-sm border p-2 rounded-lg border-slate-100 outline-none focus:ring-1 focus:ring-indigo-500 myanmar-font bg-white"
                            placeholder="Label"
                          />
                          <input
                            type="number"
                            onWheel={(e) => e.currentTarget.blur()}
                            value={sub.amount || ""}
                            onChange={(e) => {
                              const subs = expense.subExpenses.map((s) =>
                                s.id === sub.id
                                  ? { ...s, amount: Number(e.target.value) }
                                  : s,
                              );
                              updateExpense(expense.id, { subExpenses: subs });
                            }}
                            className="w-24 text-sm border p-2 rounded-lg bg-slate-50 border-slate-200 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500"
                            placeholder="0"
                          />
                          <button
                            onClick={() => removeSubExpense(expense.id, sub.id)}
                            className="text-slate-300 hover:text-red-400 p-1 transition-colors"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addSubExpense(expense.id)}
                        className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest hover:text-indigo-800 transition"
                      >
                        + Add Row
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <input
                        value={expense.label}
                        placeholder="Description"
                        onChange={(e) =>
                          updateExpense(expense.id, {
                            label: e.target.value.toUpperCase(),
                          })
                        }
                        className="w-full border border-slate-200 p-2 rounded-lg bg-slate-50 myanmar-font focus:ring-1 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <input
                      type="number"
                      onWheel={(e) => e.currentTarget.blur()}
                      value={expense.amount || ""}
                      onChange={(e) =>
                        updateExpense(expense.id, {
                          amount: Number(e.target.value),
                        })
                      }
                      className="w-full border p-2 rounded-lg border-slate-200  bg-slate-50 focus:bg-white transition-all outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="Amount"
                    />
                    <input
                      type="date"
                      value={expense.date || ""}
                      onChange={(e) =>
                        updateExpense(expense.id, { date: e.target.value })
                      }
                      className="w-full border border-slate-200 p-2 rounded-lg bg-slate-50 focus:bg-white transition-all outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="space-y-4 pt-4 pb-20">
        <h2 className="text-xl font-bold text-slate-800 border-b pb-2">
          Footer Customization
        </h2>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
            Balance Label
          </label>
          <input
            type="text"
            value={data.balanceLabel}
            onChange={(e) =>
              updateField("balanceLabel", e.target.value.toUpperCase())
            }
            className="mt-1 block w-full rounded-xl border-slate-200 shadow-sm p-3 border myanmar-font bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
        </div>
      </div>
    </div>
  );
};
