import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Mic, Camera, Calendar, Brain, Terminal, Cpu, Wifi, Zap } from 'lucide-react';

const MENU_ITEMS = [
  { id: 'inputs', label: 'SYS_INPUTS', desc: 'Capture data' },
  { id: 'schedule', label: 'TIMELINE', desc: 'Schedule' },
  { id: 'tasks', label: 'EXECUTABLES', desc: 'Tasks' },
  { id: 'cortex', label: 'CORTEX_LOG', desc: 'Memory' },
  { id: 'system', label: 'TELEMETRY', desc: 'Status' }
];

const containerVars = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVars = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 400 } } };

const TacticalLobster = ({ className = '', isMoving = false }) => (
  <svg viewBox="0 0 24 36" className={className} fill="none">
    <motion.path d="M 6 12 C 0 8 0 0 6 4 C 12 6 8 12 8 14 Z" fill="currentColor" animate={{ rotate: isMoving ? [-20, 0, -20] : 0 }} transition={{ repeat: Infinity, duration: 0.3 }} style={{ originX: '8px', originY: '14px' }} />
    <motion.path d="M 18 12 C 24 8 24 0 18 4 C 12 6 16 12 16 14 Z" fill="currentColor" animate={{ rotate: isMoving ? [20, 0, 20] : 0 }} transition={{ repeat: Infinity, duration: 0.3 }} style={{ originX: '16px', originY: '14px' }} />
    <rect x="8" y="12" width="8" height="14" rx="3" fill="currentColor" />
    <path d="M 8 25 L 5 32 L 12 30 L 19 32 L 16 25 Z" fill="currentColor" />
  </svg>
);

function InputsView() {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState('txt');

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setSending(true);
    try {
      await fetch('/api/cortex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: text.slice(0,50), content: text, section: 'all_spark', category: 'idea' })
      });
      setText('');
      alert('Saved to Cortex!');
    } catch(e) { console.error(e); }
    setSending(false);
  };

  return (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="h-full flex flex-col bg-[#f4f4f5] p-4 font-mono text-black pt-10">
      <motion.div variants={itemVars} className="flex justify-between items-end border-b-2 border-black pb-2 mb-4">
        <h2 className="text-[12px] font-bold uppercase flex items-center gap-2"><Zap size={14} className="text-[#ff4500]" /> SYS_IN</h2>
        <div className="flex gap-1">
          {['txt','mic','cam'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`text-[8px] px-2 py-0.5 rounded font-bold uppercase ${activeTab===t ? 'bg-black text-white' : 'bg-black/10'}`}>{t}</button>
          ))}
        </div>
      </motion.div>
      <div className="flex-1 flex flex-col gap-3">
        {activeTab==='txt' && (<>
          <textarea value={text} onChange={(e)=>setText(e.target.value)} className="flex-1 bg-white border-2 border-black rounded-xl p-3 text-[10px] resize-none" placeholder="Thought sequence..." />
          <button onClick={handleSubmit} disabled={sending} className="bg-black text-white py-3 rounded-xl text-[9px] font-bold uppercase">{sending?'Sending...':'Commit'}</button>
        </>)}
        {activeTab==='mic' && <div className="flex-1 flex items-center justify-center bg-white border-2 border-black rounded-xl"><div className="w-16 h-16 bg-black rounded-full flex items-center justify-center"><Mic size={20} className="text-white"/></div></div>}
        {activeTab==='cam' && <div className="flex-1 bg-black rounded-xl border-2 border-black flex items-center justify-center"><Camera size={32} className="text-white/50"/></div>}
      </div>
    </motion.div>
  );
}

function ScheduleView() {
  const [events,setEvents]=useState([]);
  useEffect(()=>{fetch('/api/streams/upcoming').then(r=>r.json()).then(d=>setEvents(d.streams||[])).catch(()=>{});},[]);
  return (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="h-full flex flex-col bg-[#f4f4f5] p-4 font-mono text-black pt-12">
      <motion.div variants={itemVars} className="flex justify-between border-b-2 border-black pb-2 mb-4"><h2 className="text-[12px] font-bold uppercase"><Calendar size={14}/> TIMELINE</h2><span className="text-[8px] bg-black text-white px-2 py-0.5 rounded">MAR_07</span></motion.div>
      <div className="flex-1 overflow-y-auto space-y-3">
        {events.length===0 && <div className="text-[10px] opacity-50">No streams</div>}
        {events.map((e,i)=>(
          <motion.div variants={itemVars} key={i} className="bg-white border-2 border-black p-2 rounded-lg">
            <div className="text-[10px] font-bold">{e.title||e.activity||'Stream'}</div>
            <div className="text-[7px] opacity-50">{e.scheduled_for?.slice(0,16)}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function TasksView() {
  const [tasks,setTasks]=useState([]);
  useEffect(()=>{fetch('/api/tasks').then(r=>r.json()).then(d=>setTasks(d.tasks||[])).catch(()=>{});},[]);
  const toggle = async(id,done)=>{await fetch(`/api/tasks/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({completed:!done})});setTasks(tasks.map(t=>t.id===id?{...t,completed:!done}:t));};
  const done=tasks.filter(t=>t.completed).length;
  const pct=tasks.length?Math.round(done/tasks.length*100):0;
  return (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="h-full flex flex-col bg-black p-4 font-mono text-white pt-12">
      <motion.div variants={itemVars} className="border border-[#00ff41] p-2 mb-4">
        <div className="flex justify-between text-[#00ff41] text-[10px] font-bold"><Terminal size={10}/> TASKS <span>{pct}%</span></div>
        <div className="h-1 bg-[#00ff41]" style={{width:`${pct}%`}}/>
      </motion.div>
      <div className="flex-1 overflow-y-auto space-y-2">
        {tasks.map(t=>(
          <motion.div variants={itemVars} key={t.id} onClick={()=>toggle(t.id,t.completed)} className="flex gap-2 cursor-pointer p-2 border-b border-dashed border-white/20">
            <div className={`w-3 h-3 border ${t.completed?'bg-[#00ff41]':''}`}/>
            <span className={`text-[9px] ${t.completed?'line-through opacity-50':''}`}>{t.title}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function CortexView() {
  const [items,setItems]=useState([]);
  useEffect(()=>{fetch('/api/cortex').then(r=>r.json()).then(d=>setItems(d.entries?.slice(0,10)||[])).catch(()=>{});},[]);
  return (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="h-full flex flex-col bg-[#ff4500] p-4 font-mono text-black pt-12">
      <motion.div variants={itemVars} className="flex justify-between border-b-4 border-black pb-2 mb-4"><h2 className="text-[14px] font-bold uppercase"><Brain/> CORTEX</h2><span className="text-[8px] bg-black text-[#ff4500] px-2 py-0.5">SYNCED</span></motion.div>
      <div className="flex-1 overflow-y-auto space-y-3">
        {items.map((i,idx)=>(
          <motion.div variants={itemVars} key={i.id||idx} className="bg-black text-[#ff4500] p-3 border-l-4">
            <div className="text-[7px] text-white/50">{new Date(i.created_at).toLocaleTimeString()}</div>
            <div className="text-[9px] font-bold">{i.title}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function SystemView() {
  return (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="h-full flex flex-col bg-black p-4 font-mono text-[#00ff41] pt-12">
      <motion.div variants={itemVars} className="flex justify-between border-b border-[#00ff41]/50 pb-2 mb-4"><span className="text-[10px] font-bold"><Cpu/> TELEMETRY</span><div className="w-2 h-2 bg-[#00ff41] rounded-full animate-pulse"/></motion.div>
      <div className="flex-1 font-[7px] opacity-70 leading-relaxed">
        {[...Array(30)].map((_,i)=><div key={i} className="flex gap-4"><span>0x{Math.floor(Math.random()*16777215).toString(16).toUpperCase()}</span><span>{Math.random()>0.9?'ERR':'OK'}</span></div>)}
      </div>
    </motion.div>
  );
}

export default function App() {
  const [idx,setIdx]=useState(0);
  const [view,setView]=useState('menu');
  const [time,setTime]=useState('12:00');
  const [led,setLed]=useState('#9ca3af');
  const [pressed,setPressed]=useState(null);

  useEffect(()=>{setInterval(()=>setTime(new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})),1000);},[]);
  useEffect(()=>{setLed(view==='inputs'?'#ff4500':view==='schedule'?'#3b82f6':view==='tasks'?'#00ff41':view==='cortex'?'#eab308':'#00ff41');},[view]);

  const up=()=>{setPressed('up');setTimeout(()=>setPressed(null),150);if(view==='menu')setIdx(i=>Math.max(0,i-1));};
  const down=()=>{setPressed('down');setTimeout(()=>setPressed(null),150);if(view==='menu')setIdx(i=>Math.min(MENU_ITEMS.length-1,i+1));};
  const enter=()=>{setPressed('center');setTimeout(()=>setPressed(null),150);if(view==='menu')setView(MENU_ITEMS[idx].id);};
  const back=()=>{setPressed('left');setTimeout(()=>setPressed(null),150);setView('menu');};
  useEffect(()=>{const k=e=>{if(e.key==='ArrowUp')up();if(e.key==='ArrowDown')down();if(e.key==='Enter')enter();if(e.key==='Escape'||e.key==='ArrowLeft')back();};window.addEventListener('keydown',k);return()=>window.removeEventListener('keydown',k);},[view,idx]);

  const content=view==='inputs'?InputsView:view==='schedule'?ScheduleView:view==='tasks'?TasksView:view==='cortex'?CortexView:SystemView;

  return (
    <div className="w-[320px] h-[640px] mx-auto mt-4 relative">
      <div className="absolute inset-0 bg-black/30 blur-2xl rounded-[3rem]"/>
      <div className="absolute inset-0 bg-[#EFEFEA] rounded-[3rem] shadow-[inset_3px_6px_12px_#fff,inset_-6px_-8px_20px_rgba(0,0,0,0.15),0_10px_30px_rgba(0,0,0,0.2)] border border-[#d1d1cc] overflow-hidden flex flex-col">
        <div className="absolute top-[-2] left-1/2 -translate-x-1/2 w-20 h-1.5 bg-[#ff4500] rounded-b-md"/>
        <div className="absolute top-4 left-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{backgroundColor:led,boxShadow:`0 0 10px ${led}`}}/></div>
        
        <div className="w-[85%] mx-auto mt-10 h-[320px] bg-black rounded-xl border-8 border-[#1a1a1a] overflow-hidden flex flex-col">
          <div className="absolute top-2 left-0 right-0 flex justify-between px-2 text-[7px] text-white/60 font-mono"><div className="flex gap-1"><Wifi size={8} className="text-[#00ff41]"/><span>LINK</span></div><div>{time}</div></div>
          <AnimatePresence mode="wait">
            <motion.div key={view} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex-1 overflow-hidden">{React.createElement(content)}</motion.div>
          </AnimatePresence>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-[200px] h-[200px] rounded-full bg-[#9CA3AF] shadow-[inset_0_15px_25px_rgba(0,0,0,0.15),inset_0_-4px_10px_#fff,0_8px_20px_rgba(0,0,0,0.4)] relative flex items-center justify-center">
            <div className="absolute inset-0 border-[30px] border-[#8e95a1] rounded-full opacity-30"/>
            <div className="absolute w-[160px] h-1.5 bg-[#888] rounded-full"/>
            <div className="absolute h-[160px] w-1.5 bg-[#888] rounded-full"/>
            <div className="absolute w-5 h-5 bg-[#777] rounded-full"/>
            <div className="absolute inset-0 flex flex-col">
              <button onPointerDown={up} className="h-1/3 w-full rounded-t-full outline-none"/>
              <div className="h-1/3 flex"><button onPointerDown={back} className="w-1/3 h-full rounded-l-full"/><button onPointerDown={enter} className="w-1/3 h-full"/><div className="w-1/3 h-full rounded-r-full"/></div>
              <button onPointerDown={down} className="h-1/3 w-full rounded-b-full outline-none"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
