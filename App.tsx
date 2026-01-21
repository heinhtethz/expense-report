import React, { useState, useCallback } from 'react';
import { DocumentData } from './types';
import { INITIAL_DATA, EMPTY_DATA } from './constants';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';

const App: React.FC = () => {
  const [data, setData] = useState<DocumentData>(INITIAL_DATA);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [isExporting, setIsExporting] = useState(false);
  const [showResetMenu, setShowResetMenu] = useState(false);

  const handleDataChange = useCallback((newData: DocumentData) => {
    setData(newData);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleResetToTemplate = () => {
    if (confirm('Reset to initial template data? This will overwrite your current changes.')) {
      setData(INITIAL_DATA);
      setShowResetMenu(false);
    }
  };

  const handleClearAll = () => {
    if (confirm('Clear all fields and expenses? This action cannot be undone.')) {
      setData(EMPTY_DATA);
      setShowResetMenu(false);
    }
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('receipt-content');
    if (!element) return;
    
    setIsExporting(true);
    
    // Create an off-screen container to render the content at 100% scale
    // This avoids issues where the preview scaling affects the PDF output
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '-9999px';
    container.style.left = '0';
    container.style.width = '210mm'; // Force exact A4 width context
    container.appendChild(element.cloneNode(true));
    document.body.appendChild(container);
    
    const opt = {
      margin: 0,
      filename: `Receipt_${data.name.replace(/\s+/g, '_') || 'doc'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        logging: false,
        scrollY: 0,
        windowWidth: 794 // 210mm @ 96dpi
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait', 
        compress: true 
      },
      pagebreak: { mode: ['css', 'legacy'] }
    };

    try {
      // @ts-ignore
      await window.html2pdf().set(opt).from(container.firstChild).save();
    } catch (err: any) {
      console.error('PDF generation error:', err);
    } finally {
      document.body.removeChild(container);
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-slate-100 text-slate-900">
      {/* Mobile Header */}
      <nav className="no-print lg:hidden flex bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <button 
          onClick={() => setViewMode('edit')} 
          className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'edit' ? 'border-b-4 border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'text-slate-400'}`}
        >
          Editor
        </button>
        <button 
          onClick={() => setViewMode('preview')} 
          className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'preview' ? 'border-b-4 border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'text-slate-400'}`}
        >
          Preview
        </button>
      </nav>

      {/* Editor Panel */}
      <aside className={`no-print w-full lg:w-[440px] flex-shrink-0 bg-white lg:border-r border-slate-200 flex flex-col shadow-2xl transition-all h-full ${viewMode === 'preview' ? 'hidden lg:flex' : 'flex'}`}>
        <header className="p-6 bg-slate-900 text-white flex items-center justify-between relative">
          <div>
            <h1 className="text-xl font-bold tracking-tight">QuickReceipt</h1>
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em] mt-0.5">Professional Studio</p>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowResetMenu(!showResetMenu)}
              className="text-[10px] bg-slate-800 px-4 py-2 rounded-xl text-slate-300 font-bold hover:text-white transition-all border border-slate-700 flex items-center gap-2"
            >
              RESET
              <svg className={`w-3 h-3 transition-transform ${showResetMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            
            {showResetMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-[100]">
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
        
        <footer className="p-6 border-t border-slate-100 bg-slate-50 grid grid-cols-2 gap-4 mb-10">
          <button 
            onClick={handlePrint} 
            className="flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-100 py-4 rounded-2xl text-sm font-bold transition-all shadow-sm active:scale-95"
          >
            Print
          </button>
          <button 
            onClick={handleExportPDF} 
            disabled={isExporting} 
            className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl text-sm font-bold disabled:opacity-50 transition-all shadow-indigo-200 shadow-2xl active:scale-95"
          >
            {isExporting ? 'Creating PDF...' : 'Download PDF'}
          </button>
        </footer>
      </aside>

      {/* Main Preview Container */}
      <main className={`flex-1 overflow-y-auto bg-slate-200 lg:p-12 p-4 flex flex-col items-center hide-scrollbar ${viewMode === 'edit' ? 'hidden lg:flex' : 'flex'}`}>
        <div className="origin-top scale-[0.35] sm:scale-[0.5] md:scale-[0.7] lg:scale-[0.85] xl:scale-100 transition-all duration-500 ease-in-out">
           <Preview data={data} />
        </div>
        <div className="h-32 no-print lg:hidden" />
      </main>
    </div>
  );
};

export default App;