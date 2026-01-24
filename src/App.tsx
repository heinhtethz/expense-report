import React, { useState, useCallback, useRef } from "react";
import { DocumentData } from "../util/types";
import { INITIAL_DATA, EMPTY_DATA } from "../util/constants";
import { Editor } from "./components/Editor";
import { Preview } from "./components/Preview";

const App: React.FC = () => {
  const [data, setData] = useState<DocumentData>(INITIAL_DATA);
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [showResetMenu, setShowResetMenu] = useState(false);

  const handleDataChange = useCallback((newData: DocumentData) => {
    setData(newData);
  }, []);

  const handleResetToTemplate = () => {
    if (
      confirm(
        "Reset to initial template data? This will overwrite your current changes.",
      )
    ) {
      setData(INITIAL_DATA);
      setShowResetMenu(false);
    }
  };

  const handleClearAll = () => {
    if (
      confirm("Clear all fields and expenses? This action cannot be undone.")
    ) {
      setData(EMPTY_DATA);
      setShowResetMenu(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-slate-100 text-slate-900">
      {/* Mobile Header */}
      <nav className="flex lg:hidden bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <button
          onClick={() => setViewMode("edit")}
          className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${viewMode === "edit" ? "border-b-4 border-indigo-600 text-indigo-600 bg-indigo-50/50" : "text-slate-400"}`}
        >
          Editor
        </button>
        <button
          onClick={() => setViewMode("preview")}
          className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${viewMode === "preview" ? "border-b-4 border-indigo-600 text-indigo-600 bg-indigo-50/50" : "text-slate-400"}`}
        >
          Preview
        </button>
      </nav>

      {/* Editor Panel */}
      <aside
        className={`w-full lg:w-[50%] shrink-0 bg-white lg:border-r border-slate-200 flex flex-col shadow-2xl transition-all h-full ${viewMode === "preview" ? "hidden lg:flex" : "flex"}`}
      >
        <header className="p-2 bg-slate-900 text-white flex items-center justify-between relative">
          <div>
            <h1 className="text-lg font-bold tracking-tight">QuickReceipt</h1>
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em] mt-0.5">
              Professional Studio By Hz
            </p>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowResetMenu(!showResetMenu)}
              className="text-[10px] bg-slate-800 px-4 py-2 rounded-xl text-slate-300 font-bold hover:text-white transition-all border border-slate-700 flex items-center gap-2"
            >
              RESET
              <svg
                className={`w-3 h-3 transition-transform ${showResetMenu ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showResetMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-100">
                <button
                  onClick={handleResetToTemplate}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Reset to Template
                </button>
                <button
                  onClick={handleClearAll}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                >
                  Clear All Data
                </button>
              </div>
            )}
          </div>
        </header>

        <Editor data={data} onChange={handleDataChange} />
      </aside>

      {/* Main Preview Container */}

      <Preview data={data} />
    </div>
  );
};

export default App;
