"use client";

import { useRef } from "react";
import { 
  Printer, 
  ArrowLeft,
  Sparkles,
  User,
  Hash,
  Calendar
} from "lucide-react";

interface QuestionBlock {
  id: string;
  type: string;
  title: string;
  marks: number;
  data: any;
}

interface PaperHeader {
  subject: string;
  semester: string;
  className: string;
  marks: number;
  date: string;
}

export function Results({ header, blocks }: { header: PaperHeader, blocks: QuestionBlock[] }) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      {/* Preview Tooltip */}
      <div className="flex items-center justify-between rounded-2xl bg-brand-sky/10 border border-brand-sky/20 p-4 px-6">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-brand-sky" />
          <p className="text-xs font-bold text-zinc-900 uppercase tracking-widest">A4 Print Mode Preview</p>
        </div>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:scale-105 active:scale-95 shadow-xl shadow-zinc-200"
        >
          <Printer className="h-3.5 w-3.5" /> Start Printing
        </button>
      </div>

      {/* Actual Paper Layout */}
      <div 
        ref={printRef}
        className="mx-auto w-full max-w-[210mm] bg-white p-[20mm] shadow-2xl print:m-0 print:p-[15mm] print:shadow-none min-h-[297mm]"
        id="printable-paper"
      >
        {/* School Header */}
        <div className="text-center mb-8 border-b-2 border-black pb-6">
          <h1 className="font-display text-4xl font-black uppercase tracking-widest text-black mb-1">maanvi's preschool</h1>
          <div className="flex items-center justify-between mt-6 text-sm font-bold border-t border-black pt-4">
            <div className="text-left space-y-1">
              <p>Subject: {header.subject}</p>
              <p>Date: {header.date || '____________'}</p>
              <p>Name of the student: ____________________________________</p>
              <p>Roll No. ___________</p>
            </div>
            <div className="text-right space-y-1 flex flex-col justify-between h-full">
              <p className="text-lg font-black">{header.semester}</p>
              <p>Class: {header.className}</p>
              <p>Marks-{header.marks}</p>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {blocks.map((block, idx) => (
            <div key={block.id} className="space-y-4">
              <div className="flex justify-between items-start font-bold">
                <p className="text-base">Q{idx + 1}: {block.title}</p>
                <p className="border-b border-black text-sm">(Marks {block.marks})</p>
              </div>

              {/* Render Block Content */}
              <div className="pl-4">
                {block.type === 'grid' && (
                  <div className="grid grid-cols-5 border-l border-t border-black">
                    {Array.from({ length: (block.data.rows || 5) * (block.data.cols || 5) }).map((_, i) => (
                      <div key={i} className="h-20 border-r border-b border-black flex flex-col items-center justify-center p-2">
                        <div className="w-full border-t border-black border-dashed mt-auto mb-2 opacity-50"></div>
                        <div className="w-full border-t-2 border-black mb-2"></div>
                      </div>
                    ))}
                  </div>
                )}

                {block.type === 'matching' && (
                  <div className="flex justify-between items-center max-w-lg mx-auto pt-8">
                    <div className="space-y-12">
                      {(block.data.pairs || []).map((pair: any, i: number) => (
                        <div key={i} className="flex items-center gap-6 text-2xl font-bold">
                          {pair.left} <div className="h-2.5 w-2.5 rounded-full bg-black"></div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-12">
                      {(block.data.pairs || []).sort(() => Math.random() - 0.5).map((pair: any, i: number) => (
                        <div key={i} className="flex items-center gap-6 text-2xl font-bold">
                           <div className="h-2.5 w-2.5 rounded-full bg-black"></div> {pair.right}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {block.type === 'picture' && (
                  <div className="grid grid-cols-2 gap-x-16 gap-y-12 pt-6">
                    {(block.data.items || []).map((item: any, i: number) => (
                      <div key={i} className="space-y-4">
                        <div className="h-40 w-full border-2 border-zinc-200 flex items-center justify-center rounded-2xl bg-zinc-50 italic text-zinc-400 text-xs">
                          {item.image ? <img src={item.image} className="h-full w-full object-contain" /> : '[ Picture Slot ]'}
                        </div>
                        <div className="space-y-2">
                          <div className="h-[1px] w-full bg-black/20"></div>
                          <div className="h-[1px] w-full bg-black/20"></div>
                          <div className="h-[1.5px] w-full bg-black"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {block.type === 'circle' && (
                   <div className="space-y-10 pt-6">
                      {(block.data.rows || []).map((row: any, i: number) => (
                        <div key={i} className="flex items-center gap-12 text-3xl font-bold">
                           <span className="min-w-[4rem]">{row.target}</span>
                           <div className="flex gap-12 border-2 border-dashed border-zinc-100 p-6 rounded-[2.5rem]">
                             {(row.options || ['', '', '']).map((opt: string, oi: number) => (
                               <div key={oi} className="h-20 w-20 bg-zinc-50 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-300 text-[10px] italic">
                                  Img
                               </div>
                             ))}
                           </div>
                        </div>
                      ))}
                   </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Print Styles */}
        <style jsx global>{`
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-paper, #printable-paper * {
              visibility: visible;
            }
            #printable-paper {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 0 !important;
            }
            @page {
              size: A4;
              margin: 15mm;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
