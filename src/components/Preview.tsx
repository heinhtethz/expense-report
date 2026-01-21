import React, { forwardRef } from "react";
import { DocumentData, Expense } from "../../util/types";

export const Preview = forwardRef<HTMLDivElement, { data: DocumentData }>(
  ({ data }, ref) => {
    const calculateTotal = () => {
      return data.expenses.reduce((acc, curr) => {
        if (curr.type === "job") {
          const subTotal = curr.subExpenses.reduce((s, c) => s + c.amount, 0);
          return acc + curr.baseAmount + subTotal;
        }
        if (curr.type === "simple") {
          return acc + curr.amount;
        }
        return acc;
      }, 0);
    };

    const total = calculateTotal();
    const balance = data.advanceAmount - total;

    const formatDate = (dateStr: string) => {
      if (!dateStr) return "";
      try {
        const date = new Date(dateStr);
        return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear().toString().slice(-2)}`;
      } catch (e) {
        return dateStr;
      }
    };

    /**
     * Precise Pagination Logic
     * A4 height: 297mm
     * Vertical Padding: 40mm (20mm top + 20mm bottom)
     * Usable area: 257mm
     */
    const chunkExpenses = () => {
      const USABLE_HEIGHT_MM = 290; // Safety buffer

      // Estimates in mm
      const HEADER_HEIGHT = 45;
      const FOOTER_HEIGHT = 60;
      const GAP_HEIGHT = 8;

      const pages: Expense[][] = [[]];
      let currentPageHeight = HEADER_HEIGHT;

      data.expenses.forEach((expense, index) => {
        let itemHeight = 12; // Base height for a line
        if (expense.type === "job") {
          itemHeight += expense.subExpenses.length * 8; // Sub-items
        }

        const isLast = index === data.expenses.length - 1;
        const spaceNeeded =
          itemHeight + (isLast ? FOOTER_HEIGHT : 0) + GAP_HEIGHT;

        if (
          currentPageHeight + spaceNeeded > USABLE_HEIGHT_MM &&
          pages[pages.length - 1].length > 0
        ) {
          pages.push([expense]);
          currentPageHeight = itemHeight + GAP_HEIGHT; // New page doesn't have the main doc header
        } else {
          pages[pages.length - 1].push(expense);
          currentPageHeight += itemHeight + GAP_HEIGHT;
        }
      });

      return pages;
    };

    const pages = chunkExpenses();

    return (
      <div ref={ref} id="receipt-content">
        {pages.map((pageExpenses, pageIdx) => (
          <React.Fragment key={pageIdx}>
            <div
              className={`a4-container text-black shadow-2xl print:shadow-none ${
                pageIdx < pages.length - 1 ? "html2pdf__page-break" : ""
              }`}
            >
              {/* Header - Page 1 Only */}
              {pageIdx === 0 && (
                <div className="mb-10">
                  <div className="flex justify-between items-baseline font-bold text-3xl mb-8">
                    <span className="underline decoration-black decoration-2 underline-offset-[14px]">
                      {data.headerTitle}
                    </span>
                    <span className="underline decoration-black decoration-2 underline-offset-[14px]">
                      {data.name}
                    </span>
                    <span className="underline decoration-black decoration-2 underline-offset-[14px]">
                      {formatDate(data.date)}
                    </span>
                  </div>
                  <div className="flex flex-col text-center font-bold text-2xl py-2 border-y-2 border-slate-100">
                    <span>Adv - {data.advanceAmount.toLocaleString()}/-</span>
                    {data.advanceDate && (
                      <span>({formatDate(data.advanceDate)})</span>
                    )}
                  </div>
                </div>
              )}

              {/* List Content */}
              <div className={`flex-1 ${pageIdx > 0 ? "pt-4" : ""}`}>
                <div className="flex flex-col gap-6">
                  {pageExpenses.map((expense) => {
                    const globalIdx = data.expenses.findIndex(
                      (e) => e.id === expense.id,
                    );
                    return (
                      <div key={expense.id} className="flex flex-col">
                        {expense.type === "job" ? (
                          <div className="space-y-2">
                            <div className="flex justify-between items-baseline font-bold text-xl leading-tight">
                              <div className="flex-1 flex items-baseline gap-2">
                                <span className="flex-shrink-0 min-w-[20px]">
                                  {globalIdx + 1}.
                                </span>
                                <div className="flex-1">
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: expense.title,
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="amount-col tabular-nums text-right">
                                {expense.baseAmount.toLocaleString()}
                              </div>
                            </div>
                            {expense.subExpenses.map((sub) => (
                              <div
                                key={sub.id}
                                className="flex justify-between items-baseline ml-7 text-lg"
                              >
                                <div className="flex-1 myanmar-font text-slate-800">
                                  {sub.label}
                                </div>
                                <div className="amount-col tabular-nums text-slate-800 text-right">
                                  {sub.amount.toLocaleString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex justify-between items-baseline font-bold text-xl leading-tight">
                            <div className="flex-1 flex items-baseline gap-2">
                              <span className="flex-shrink-0 min-w-[20px]">
                                {globalIdx + 1}.
                              </span>
                              <div className="flex-1">
                                <span
                                  className="myanmar-font"
                                  dangerouslySetInnerHTML={{
                                    __html: expense.label,
                                  }}
                                />
                                {expense.date && (
                                  <span className="ml-2 font-normal text-base text-slate-600 whitespace-nowrap">
                                    ({formatDate(expense.date)})
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="amount-col tabular-nums text-right">
                              {expense.amount.toLocaleString()}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer - Final Page Only */}
              {pageIdx === pages.length - 1 && (
                <div className="mt-auto pt-10 border-t-2 border-slate-100 flex justify-end">
                  <div className="w-full max-w-[340px]">
                    <div className="flex justify-between items-baseline py-2 text-xl font-semibold text-slate-500">
                      <span className="text-sm uppercase tracking-widest">
                        Total
                      </span>
                      <span className="tabular-nums">
                        {total.toLocaleString()}/-
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline py-2 text-xl font-semibold text-slate-500">
                      <span className="text-sm uppercase tracking-widest">
                        Adv
                      </span>
                      <span className="tabular-nums">
                        {data.advanceAmount.toLocaleString()}/-
                      </span>
                    </div>
                    <div className="border-t-[5px] border-double border-black mt-4 pt-5 flex justify-between items-center">
                      <span className="font-bold text-3xl myanmar-font leading-none">
                        {data.balanceLabel}
                      </span>
                      <span className="font-bold text-3xl leading-none tabular-nums">
                        {balance < 0
                          ? `(${Math.abs(balance).toLocaleString()})`
                          : balance.toLocaleString()}
                        /-
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Web Visual Separation */}
            {pageIdx < pages.length - 1 && (
              <div className="h-16 w-full no-print flex items-center justify-center opacity-20">
                <div className="w-48 h-px bg-slate-900" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  },
);
