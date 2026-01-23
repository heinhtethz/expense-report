import React, { useRef } from "react";
import {
  DocumentData,
  Expense,
  JobExpense,
  SimpleExpense,
  SubExpense,
} from "../../util/types";

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  placeholder?: string;
  isTextArea?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  className,
  placeholder,
  isTextArea,
}) => {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const applyFormat = (tag: string) => {
    const input = inputRef.current;
    if (!input) return;

    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const selection = input.value.substring(start, end);

    const before = input.value.substring(0, start);
    const after = input.value.substring(end);
    const newValue = `${before}<${tag}>${selection}</${tag}>${after}`;
    onChange(newValue);

    setTimeout(() => {
      input.focus();
      if (selection) {
        const newStart = start;
        const newEnd = start + (tag.length * 2 + 5) + selection.length;
        input.setSelectionRange(newStart, newEnd);
      } else {
        const cursorPosition = start + tag.length + 2;
        input.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 0);
  };

  return (
    <div className="flex flex-col gap-1 group">
      <div className="flex gap-1 opacity-0 group-focus-within:opacity-100 transition-opacity">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            applyFormat("b");
          }}
          className="w-6 h-6 flex items-center justify-center text-[10px] font-bold border rounded bg-white hover:bg-slate-50 shadow-sm border-slate-300"
          title="Bold (<b>)"
        >
          B
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            applyFormat("i");
          }}
          className="w-6 h-6 flex items-center justify-center text-[10px] italic border rounded bg-white hover:bg-slate-50 shadow-sm border-slate-300"
          title="Italic (<i>)"
        >
          I
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            applyFormat("u");
          }}
          className="w-6 h-6 flex items-center justify-center text-[10px] underline border rounded bg-white hover:bg-slate-50 shadow-sm border-slate-300"
          title="Underline (<u>)"
        >
          U
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            applyFormat("s");
          }}
          className="w-6 h-6 flex items-center justify-center text-[10px] line-through border rounded bg-white hover:bg-slate-50 shadow-sm border-slate-300"
          title="Strikethrough (<s>)"
        >
          S
        </button>
      </div>
      {isTextArea ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${className} min-h-[80px] bg-white`}
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${className} bg-white`}
        />
      )}
    </div>
  );
};

interface EditorProps {
  data: DocumentData;
  onChange: (data: DocumentData) => void;
}

export const Editor: React.FC<EditorProps> = ({ data, onChange }) => {
  const updateField = (field: keyof DocumentData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const addJob = () => {
    const newJob: JobExpense = {
      id: crypto.randomUUID(),
      type: "job",
      title: "New Import Job",
      baseAmount: 0,
      subExpenses: [],
    };
    onChange({ ...data, expenses: [...data.expenses, newJob] });
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
            ...e.subExpenses,
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
              value={data.headerTitle}
              onChange={(e) => updateField("headerTitle", e.target.value)}
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
              onChange={(e) => updateField("name", e.target.value)}
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
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700">
              Balance Amount (Bal)
            </label>
            <input
              type="number"
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
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm p-2 border bg-white"
            />
            <input
              type="date"
              value={data.balanceDate ? data.balanceDate : ""}
              onChange={(e) => updateField("balanceDate", e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm p-2 border bg-white"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700">
              Advance Amount (Adv)
            </label>
            <input
              type="number"
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
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm p-2 border bg-white"
            />
            <input
              type="date"
              value={data.advanceDate ? data.advanceDate : ""}
              onChange={(e) => updateField("advanceDate", e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm p-2 border bg-white"
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
          <div className="flex gap-2">
            <button
              onClick={addJob}
              className="flex-1 text-xs bg-indigo-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-indigo-700 transition shadow-sm"
            >
              + Add Job
            </button>
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
                key={expense.id}
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
                    <RichTextEditor
                      value={expense.title}
                      placeholder="Job Title"
                      onChange={(val) =>
                        updateExpense(expense.id, { title: val })
                      }
                      className="w-full font-bold text-lg border-b border-transparent focus:border-slate-200 p-1 outline-none"
                    />
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap">
                        Base Fee:
                      </span>
                      <input
                        type="number"
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
                                  ? { ...s, label: e.target.value }
                                  : s,
                              );
                              updateExpense(expense.id, { subExpenses: subs });
                            }}
                            className="flex-1 text-sm border p-2 rounded-lg border-slate-100 outline-none focus:ring-1 focus:ring-indigo-500 myanmar-font bg-white"
                            placeholder="Label"
                          />
                          <input
                            type="number"
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
                      <RichTextEditor
                        value={expense.label}
                        placeholder="Description"
                        onChange={(val) =>
                          updateExpense(expense.id, { label: val })
                        }
                        className="w-full border border-slate-200 p-2 rounded-lg bg-slate-50 myanmar-font focus:ring-1 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <input
                      type="number"
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

      <div className="space-y-4 pt-4 pb-12">
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
            onChange={(e) => updateField("balanceLabel", e.target.value)}
            className="mt-1 block w-full rounded-xl border-slate-200 shadow-sm p-3 border myanmar-font bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
        </div>
      </div>
    </div>
  );
};
