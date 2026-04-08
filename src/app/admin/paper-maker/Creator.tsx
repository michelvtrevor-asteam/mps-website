"use client";

import { useState } from "react";
import { 
  Plus, 
  GripVertical, 
  Trash2, 
  Type, 
  Grid3X3, 
  ArrowLeftRight, 
  ImageIcon, 
  CircleDot,
  Save,
  Printer,
  ChevronRight,
  Monitor
} from "lucide-react";
import { Results } from "./Results";

type BlockType = 'text' | 'grid' | 'matching' | 'picture' | 'circle';

interface QuestionBlock {
  id: string;
  type: BlockType;
  title: string;
  marks: number;
  data: any;
}

export function Creator() {
  const [blocks, setBlocks] = useState<QuestionBlock[]>([]);
  const [activeTab, setActiveTab] = useState<'build' | 'preview'>('build');
  const [header, setHeader] = useState({
    subject: "English",
    semester: "1st Semester",
    className: "JR KG",
    marks: 80,
    date: ""
  });

  const addBlock = (type: BlockType) => {
    const newBlock: QuestionBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title: type === 'text' ? "Write the Capital letters A to Z." : 
             type === 'grid' ? "Write the letters." :
             type === 'matching' ? "Match the following." :
             type === 'picture' ? "Identify the picture and write its name." :
             "Circle the correct picture.",
      marks: 10,
      data: type === 'grid' ? { rows: 5, cols: 5 } : 
            type === 'matching' ? { pairs: [{ left: 'A', right: 'a' }] } :
            type === 'picture' ? { items: [{ id: '1', label: '' }, { id: '2', label: '' }] } :
            type === 'circle' ? { rows: [{ id: '1', target: 'A', options: ['', '', ''] }] } :
            {}
    };
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const updateBlock = (id: string, updates: Partial<QuestionBlock>) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  return (
    <div className="space-y-8">
      {/* Builder Navigation */}
      <div className="flex items-center justify-between rounded-3xl bg-white p-3 shadow-xl shadow-zinc-200/50">
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('build')}
            className={`flex items-center gap-2 rounded-2xl px-6 py-3 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'build' ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:bg-zinc-50'}`}
          >
            <Plus className="h-4 w-4" /> Builder
          </button>
          <button 
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 rounded-2xl px-6 py-3 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'preview' ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:bg-zinc-50'}`}
          >
            <Monitor className="h-4 w-4" /> Final Preview
          </button>
        </div>

        <button className="flex items-center gap-2 rounded-2xl bg-brand-sky px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-brand-sky/20 transition-all hover:scale-105 active:scale-95">
          <Printer className="h-4 w-4" /> Print PDF
        </button>
      </div>

      {activeTab === 'build' ? (
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Header & Controls */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-[2.5rem] border border-zinc-100 bg-white p-8 shadow-xl shadow-zinc-200/50">
              <h3 className="mb-6 font-display text-xl font-bold text-zinc-900">Paper Details</h3>
              <div className="space-y-4">
                {['subject', 'semester', 'className', 'marks'].map((field) => (
                  <div key={field} className="space-y-1.5">
                    <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-zinc-400">{field}</label>
                    <input 
                      value={(header as any)[field]}
                      onChange={(e) => setHeader({...header, [field]: e.target.value})}
                      className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm font-black text-zinc-900 outline-none focus:bg-white focus:ring-4 focus:ring-zinc-100" 
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2.5rem] bg-zinc-900 p-8 text-white shadow-2xl">
              <h3 className="mb-6 font-display text-lg font-bold">Add Question Block</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { type: 'text', icon: Type, label: 'Standard' },
                  { type: 'grid', icon: Grid3X3, label: 'Grid/Lines' },
                  { type: 'matching', icon: ArrowLeftRight, label: 'Matching' },
                  { type: 'picture', icon: ImageIcon, label: 'Picture ID' },
                  { type: 'circle', icon: CircleDot, label: 'Circle Choice' },
                ].map((btn) => (
                  <button 
                    key={btn.type}
                    onClick={() => addBlock(btn.type as BlockType)}
                    className="flex flex-col items-center gap-2 rounded-2xl bg-white/10 p-4 transition-all hover:bg-white/20 active:scale-95"
                  >
                    <btn.icon className="h-5 w-5 text-brand-sky" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{btn.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Builder Canvas */}
          <div className="lg:col-span-8 space-y-4">
            {blocks.length === 0 ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[3rem] border-4 border-dashed border-zinc-100 bg-zinc-50/50 p-12 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-zinc-200 shadow-sm">
                  <Plus className="h-10 w-10" />
                </div>
                <h3 className="font-display text-xl font-bold text-zinc-400">Empty Builder</h3>
                <p className="mt-2 text-sm font-medium text-zinc-300">Choose a block type from the sidebar to start creating your paper.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {blocks.map((block, index) => (
                  <div key={block.id} className="group relative rounded-[2.5rem] border border-zinc-100 bg-white p-6 transition-all hover:border-brand-sky/20 hover:shadow-xl hover:shadow-zinc-200/30">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-1 items-start gap-4">
                        <div className="mt-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-50 text-[10px] font-black text-zinc-400">
                          Q{index + 1}
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center gap-4">
                            <input 
                              value={block.title}
                              onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                              className="flex-1 bg-transparent font-display text-lg font-bold text-zinc-900 outline-none"
                              placeholder="Type question instruction here..."
                            />
                            <div className="flex items-center gap-2 rounded-xl bg-zinc-50 px-3 py-1.5">
                              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Marks:</span>
                              <input 
                                type="number"
                                value={block.marks}
                                onChange={(e) => updateBlock(block.id, { marks: parseInt(e.target.value) })}
                                className="w-12 bg-transparent text-center text-xs font-black text-zinc-900 outline-none"
                              />
                            </div>
                          </div>

                          {/* Block Specific Editors */}
                          <div className="rounded-[2.5rem] border border-zinc-100 bg-zinc-50/50 p-8 shadow-inner shadow-zinc-100/50">
                            {block.type === 'grid' && (
                              <div className="flex flex-wrap gap-8">
                                <div className="space-y-1.5">
                                  <label className="ml-1 text-[9px] font-black uppercase tracking-widest text-zinc-400 font-display">Rows</label>
                                  <input 
                                    type="number" 
                                    value={block.data.rows || 5} 
                                    onChange={(e) => updateBlock(block.id, { data: { ...block.data, rows: parseInt(e.target.value) } })}
                                    className="w-20 rounded-xl border border-zinc-100 bg-white p-3 text-xs font-black shadow-sm outline-none focus:ring-4 focus:ring-zinc-100" 
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="ml-1 text-[9px] font-black uppercase tracking-widest text-zinc-400 font-display">Columns</label>
                                  <input 
                                    type="number" 
                                    value={block.data.cols || 5} 
                                    onChange={(e) => updateBlock(block.id, { data: { ...block.data, cols: parseInt(e.target.value) } })}
                                    className="w-20 rounded-xl border border-zinc-100 bg-white p-3 text-xs font-black shadow-sm outline-none focus:ring-4 focus:ring-zinc-100" 
                                  />
                                </div>
                                <div className="flex-1 flex items-center gap-4 bg-white/50 p-4 rounded-2xl border border-zinc-100">
                                   <Grid3X3 className="h-6 w-6 text-brand-sky opacity-40" />
                                   <p className="text-[10px] font-bold text-zinc-400 leading-tight">This will generate a table with specialized handwriting lines for letter practice.</p>
                                </div>
                              </div>
                            )}

                            {block.type === 'matching' && (
                              <div className="space-y-4">
                                <div className="flex items-center justify-between mb-4">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Manage Pairs</p>
                                  <button 
                                    onClick={() => updateBlock(block.id, { data: { ...block.data, pairs: [...(block.data.pairs || []), { left: '', right: '' }] } })}
                                    className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-white shadow-xl shadow-zinc-200 transition-all hover:scale-105"
                                  >
                                    <Plus className="h-3 w-3" /> Add Pair
                                  </button>
                                </div>
                                <div className="space-y-3">
                                  {(block.data.pairs || [{ left: 'A', right: 'a' }]).map((pair: any, pIdx: number) => (
                                    <div key={pIdx} className="flex items-center gap-4 group/pair">
                                      <input 
                                        value={pair.left} 
                                        onChange={(e) => {
                                          const newPairs = [...(block.data.pairs || [])];
                                          newPairs[pIdx] = { ...pair, left: e.target.value };
                                          updateBlock(block.id, { data: { ...block.data, pairs: newPairs } });
                                        }}
                                        className="flex-1 rounded-xl border border-zinc-100 bg-white p-3 text-xs font-black shadow-sm transition-all focus:ring-4 focus:ring-zinc-100 outline-none" 
                                        placeholder="Left (e.g. A)"
                                      />
                                      <ArrowLeftRight className="h-4 w-4 text-zinc-200" />
                                      <input 
                                        value={pair.right} 
                                        onChange={(e) => {
                                          const newPairs = [...(block.data.pairs || [])];
                                          newPairs[pIdx] = { ...pair, right: e.target.value };
                                          updateBlock(block.id, { data: { ...block.data, pairs: newPairs } });
                                        }}
                                        className="flex-1 rounded-xl border border-zinc-100 bg-white p-3 text-xs font-black shadow-sm transition-all focus:ring-4 focus:ring-zinc-100 outline-none" 
                                        placeholder="Right (e.g. a)"
                                      />
                                      <button 
                                        onClick={() => {
                                          const newPairs = block.data.pairs.filter((_: any, i: number) => i !== pIdx);
                                          updateBlock(block.id, { data: { ...block.data, pairs: newPairs } });
                                        }}
                                        className="h-8 w-8 rounded-lg bg-white text-zinc-300 transition-all hover:bg-rose-50 hover:text-rose-500 opacity-0 group-hover/pair:opacity-100 flex items-center justify-center border border-zinc-100 shadow-sm"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {block.type === 'picture' && (
                              <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Manage Pictures</p>
                                  <button 
                                    onClick={() => updateBlock(block.id, { data: { ...block.data, items: [...(block.data.items || []), { id: Math.random().toString(), label: '', image: null }] } })}
                                    className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-white shadow-xl shadow-zinc-200 transition-all hover:scale-105"
                                  >
                                    <Plus className="h-3 w-3" /> Add Item
                                  </button>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                   {(block.data.items || []).map((item: any, i: number) => (
                                      <div key={i} className="group/item relative rounded-3xl border border-zinc-100 bg-white p-4 shadow-sm transition-all hover:border-brand-sky/20">
                                         <button 
                                            onClick={() => {
                                                const newItems = block.data.items.filter((_: any, idx: number) => idx !== i);
                                                updateBlock(block.id, { data: { ...block.data, items: newItems } });
                                            }}
                                            className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg opacity-0 transition-all group-hover/item:opacity-100 scale-75 hover:scale-100"
                                         >
                                            <Trash2 className="h-4 w-4" />
                                         </button>
                                         <div className="relative flex h-32 w-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-zinc-50 border-2 border-dashed border-zinc-100 text-zinc-300">
                                            {item.image ? (
                                                <img src={item.image} className="h-full w-full object-contain" />
                                            ) : (
                                                <>
                                                    <ImageIcon className="h-8 w-8 opacity-20" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest opacity-40 mt-2 text-center px-4">Click to Upload</span>
                                                </>
                                            )}
                                            <input 
                                                type="file" 
                                                accept="image/*"
                                                className="absolute inset-0 cursor-pointer opacity-0"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            const newItems = [...(block.data.items || [])];
                                                            newItems[i] = { ...item, image: reader.result as string };
                                                            updateBlock(block.id, { data: { ...block.data, items: newItems } });
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                         </div>
                                         <div className="mt-4 space-y-2">
                                            <div className="h-1 w-full bg-zinc-50 rounded-full" />
                                            <div className="h-1 w-3/4 bg-zinc-50 rounded-full" />
                                            <div className="h-1.5 w-full bg-zinc-900 rounded-lg" />
                                         </div>
                                      </div>
                                   ))}
                                </div>
                              </div>
                            )}

                            {block.type === 'circle' && (
                               <div className="space-y-6">
                                  <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Manage Rows</p>
                                    <button 
                                        onClick={() => updateBlock(block.id, { data: { ...block.data, rows: [...(block.data.rows || []), { id: Math.random().toString(), target: 'A', options: ['', '', ''] }] } })}
                                        className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-white shadow-xl shadow-zinc-200 transition-all hover:scale-105"
                                    >
                                        <Plus className="h-3 w-3" /> Add Row
                                    </button>
                                  </div>
                                  <div className="grid gap-4">
                                     {(block.data.rows || []).map((row: any, i: number) => (
                                        <div key={i} className="group/row relative flex items-center gap-4 bg-white p-4 rounded-3xl border border-zinc-100 shadow-sm transition-all hover:border-brand-sky/20">
                                           <div className="w-20 h-12 flex flex-col items-center justify-center border-r border-zinc-100 pr-4">
                                              <label className="text-[8px] font-black text-zinc-300 uppercase mb-1">Target</label>
                                              <input 
                                                value={row.target}
                                                onChange={(e) => {
                                                    const newRows = [...block.data.rows];
                                                    newRows[i] = { ...row, target: e.target.value };
                                                    updateBlock(block.id, { data: { ...block.data, rows: newRows } });
                                                }}
                                                className="w-full bg-zinc-50 rounded-lg p-2 text-center text-xs font-black outline-none border border-zinc-100" 
                                              />
                                           </div>
                                           <div className="flex gap-4 flex-1">
                                              {[0, 1, 2].map(cIdx => (
                                                 <div key={cIdx} className="relative h-12 w-12 rounded-full border-2 border-dashed border-zinc-100 flex items-center justify-center text-zinc-200 hover:border-brand-sky/40 hover:bg-zinc-50 transition-all cursor-pointer">
                                                    {row.options[cIdx] ? (
                                                        <img src={row.options[cIdx]} className="h-full w-full rounded-full object-cover" />
                                                    ) : (
                                                        <ImageIcon className="h-4 w-4" />
                                                    )}
                                                    <input 
                                                        type="file" 
                                                        accept="image/*"
                                                        className="absolute inset-0 cursor-pointer opacity-0"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onloadend = () => {
                                                                    const newRows = [...block.data.rows];
                                                                    const newOptions = [...row.options];
                                                                    newOptions[cIdx] = reader.result as string;
                                                                    newRows[i] = { ...row, options: newOptions };
                                                                    updateBlock(block.id, { data: { ...block.data, rows: newRows } });
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                    />
                                                 </div>
                                              ))}
                                           </div>
                                           <button 
                                                onClick={() => {
                                                    const newRows = block.data.rows.filter((_: any, idx: number) => idx !== i);
                                                    updateBlock(block.id, { data: { ...block.data, rows: newRows } });
                                                }}
                                                className="h-10 w-10 flex items-center justify-center text-zinc-200 hover:text-rose-500 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                           </button>
                                        </div>
                                     ))}
                                  </div>
                               </div>
                            )}

                            {block.type === 'text' && <p className="text-[11px] font-bold text-zinc-400 italic font-display">Title ONLY block. Perfect for general instructions or essay questions.</p>}
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => removeBlock(block.id)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-50 text-zinc-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <Results header={header} blocks={blocks} />
      )}
    </div>
  );
}
