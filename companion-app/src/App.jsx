import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { 
  CheckSquare, Mic, Camera, MessageSquare, 
  Calendar, Brain, ArrowLeft, Plus, MoreHorizontal,
  BatteryMedium, Wifi, Zap, Activity, Folder, ChevronRight, Terminal,
  Cpu, HardDrive
} from 'lucide-react';

const SUPABASE_URL = 'https://pvavybczlrhwagasriwu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2YXZ5YmN6bHJod2FnYXNyaXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMzUyMzIsImV4cCI6MjA3MDgxMTIzMn0.Y0vL36TCuE8QYFpEbVBKzLYazowtYneUpOkSTk3RkZg';

// --- DATA ---
const MENU_ITEMS = [
  { id: 'inputs', label: 'SYS_INPUTS', desc: 'Capture external data' },
  { id: 'schedule', label: 'TIMELINE', desc: 'Temporal alignment' },
  { id: 'tasks', label: 'EXECUTABLES', desc: 'Active directives' },
  { id: 'cortex', label: 'CORTEX_LOG', desc: 'Neural memory bank' },
  { id: 'system', label: 'TELEMETRY', desc: 'Hardware status' }
];

const MOCK_SCHEDULE = [
  { time: '08:00', title: 'Daily Sync', type: 'meeting' },
  { time: '10:30', title: 'Studio Session', type: 'creative' },
  { time: '14:00', title: 'Content Review', type: 'work' },
  { time: '16:45', title: 'Release Call', type: 'meeting' }
];

const MOCK_CORTEX = [
  { time: '10m ago', text: 'Voice note: Need more 808s on the drop.' },
  { time: '2h ago', text: 'Idea: Modular physical cartridges for albums.' },
  { time: '5h ago', text: 'Photo: Stage lighting reference saved.' }
];

// --- ANIMATION VARIANTS ---
const containerVars = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVars = {
  hidden: { opacity: 0, y: 15, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 400, damping: 25 } }
};

// --- MICRO-COMPONENTS ---
const Crosshair = ({ className = '' }) => (
  <svg width="10" height="10" viewBox="0 0 10 10" className={`absolute text-black/30 pointer-events-none z-20 ${className}`} fill="none" stroke="currentColor" strokeWidth="1">
    <path d="M5 0v10M0 5h10" />
  </svg>
);

const MagneticInkBackground = () => {
  // Generate 25 distinct blobs to simulate liquid clumping and pulling apart
  const blobs = useMemo(() => Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    size: Math.random() * 70 + 40, // Random sizes between 40px and 110px
    x: [Math.random() * 260 - 130, Math.random() * 260 - 130, Math.random() * 260 - 130],
    y: [Math.random() * 340 - 170, Math.random() * 340 - 170, Math.random() * 340 - 170],
    duration: Math.random() * 12 + 15,
    delay: Math.random() * -20,
    color: i % 3 === 0 ? '#000000' : i % 3 === 1 ? '#111111' : '#222222'
  })), []);

  if (false) {
    // Startup removed
  }
  
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#dcdcd8] pointer-events-none">
      {/* SVG Filter for the "Gooey" Ferrofluid Effect */}
      <svg className="hidden">
        <defs>
          <filter id="magnetic-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -12" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      
      {/* The Liquid Layer */}
      <div className="absolute inset-0 opacity-80 mix-blend-multiply" style={{ filter: "url('#magnetic-goo')" }}>
        <div className="absolute top-1/2 left-1/2 w-0 h-0">
          {blobs.map(blob => (
            <motion.div
              key={blob.id}
              className="absolute rounded-full"
              style={{ 
                width: blob.size, 
                height: blob.size, 
                backgroundColor: blob.color, 
                marginLeft: -blob.size/2, 
                marginTop: -blob.size/2 
              }}
              animate={{ x: blob.x, y: blob.y, scale: [1, 1.2, 0.8, 1.1, 1] }}
              transition={{ duration: blob.duration, repeat: Infinity, ease: "easeInOut", delay: blob.delay }}
            />
          ))}
        </div>
      </div>
      
      {/* Texture grain overlay */}
      <div className="absolute inset-0 opacity-[0.25]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`, mixBlendMode: 'overlay' }} />
    </div>
  );
};

const TacticalLobster = ({ className = '', isMoving = false, isTyping = false }) => {
  const leftClawRot = isTyping ? [-35, 0, -35] : (isMoving ? [-20, 0, -20] : 0);
  const rightClawRot = isTyping ? [35, 0, 35] : (isMoving ? [20, 0, 20] : 0);
  const animDuration = isTyping ? 0.1 : 0.3;

  if (false) {
    // Startup removed
  }
  
  return (
    <svg viewBox="0 0 24 36" className={className} fill="none">
      <motion.path d="M 6 12 C 0 8 0 0 6 4 C 12 6 8 12 8 14 Z" fill="currentColor" animate={{ rotate: leftClawRot }} transition={{ repeat: Infinity, duration: animDuration }} style={{ originX: '8px', originY: '14px' }} />
      <motion.path d="M 18 12 C 24 8 24 0 18 4 C 12 6 16 12 16 14 Z" fill="currentColor" animate={{ rotate: rightClawRot }} transition={{ repeat: Infinity, duration: animDuration }} style={{ originX: '16px', originY: '14px' }} />
      <motion.path d="M 10 10 L 8 4 M 14 10 L 16 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" animate={{ rotate: isTyping ? [-10, 10, -10] : 0 }} transition={{ repeat: Infinity, duration: 0.1 }} style={{ originY: '10px' }} />
      <rect x="8" y="12" width="8" height="14" rx="3" fill="currentColor" />
      <path d="M 8 16 L 16 16 M 8 20 L 16 20" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" />
      <motion.path d="M 8 25 L 5 32 L 12 30 L 19 32 L 16 25 Z" fill="currentColor" strokeLinejoin="round" />
      <motion.g animate={{ y: isMoving ? [-1, 1, -1] : 0 }} transition={{ repeat: Infinity, duration: 0.2 }}>
        <line x1="8" y1="15" x2="4" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="16" y1="15" x2="20" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="8" y1="21" x2="4" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="16" y1="21" x2="20" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </motion.g>
    </svg>
  );
};

// --- INTERNAL OS VIEWS ---

const InputsView = () => {
  const [status, setStatus] = useState(null);
  const [text, setText] = useState('');

  const showStatus = (type, message) => {
    setStatus({ type, message });
    setTimeout(() => setStatus(null), 3000);
  };
  const [activeTab, setActiveTab] = useState('VOICE');
  
  // Mic states
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  
  // Camera states  
  const [cameraActive, setCameraActive] = useState(false);
  const [photoData, setPhotoData] = useState(null);
  const [videoEl, setVideoEl] = useState(null);
  const [saving, setSaving] = useState(false);

  // Mic functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      recorder.ondataavailable = e => chunks.push(e.data);
      recorder.onstop = () => { setAudioBlob(new Blob(chunks, { type: 'audio/webm' })); };
      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch(e) { console.error(e); showStatus('error', 'Mic access denied'); }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      // Tracks are stopped in onstop callback
    }
    setRecording(false);
  };

  const saveAudio = async () => {
    if (!audioBlob) {
      showStatus('error', 'No recording to save');
      return;
    }
    setSaving(true);
    showStatus('success', 'Saving...');
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result.split(',')[1];
      try {
        const resAudio = await fetch(SUPABASE_URL + '/rest/v1/lifeos_cortex', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json', 
            'apikey': SUPABASE_KEY, 
            'Authorization': 'Bearer ' + SUPABASE_KEY, 
            'Prefer': 'return=minimal' 
          },
          body: JSON.stringify({ 
            title: '🎤 Voice ' + new Date().toLocaleString(), 
            content: '[Voice note - ' + Math.round(audioBlob.size/1024) + 'KB]', 
            section: 'voice-notes', 
            category: 'audio', 
            metadata: { audio: base64, duration: 'unknown' } 
          })
        });
        
        if (resAudio.ok) {
          setAudioBlob(null);
          showStatus('success', '✓ Voice saved to Cortex!');
        } else {
          showStatus('error', 'Failed to save - try again');
        }
      } catch(e) { 
        console.error(e);
        showStatus('error', 'Error saving voice');
      }
      setSaving(false);
    };
    reader.onerror = () => {
      showStatus('error', 'Failed to process audio');
      setSaving(false);
    };
    reader.readAsDataURL(audioBlob);
  };

  // Camera functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoEl) videoEl.srcObject = stream;
      setCameraActive(true);
    } catch(e) { console.error(e); showStatus('error', 'Camera access denied'); }
  };

  const stopCamera = () => {
    if (videoEl && videoEl.srcObject) videoEl.srcObject.getTracks().forEach(t => t.stop());
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoEl || !cameraActive) return;
    
    // Ensure video has dimensions
    if (videoEl.videoWidth === 0 || videoEl.videoHeight === 0) {
      showStatus('error', 'Camera not ready - wait a moment');
      return;
    }
    
    const c = document.createElement('canvas');
    c.width = videoEl.videoWidth;
    c.height = videoEl.videoHeight;
    c.getContext('2d').drawImage(videoEl, 0, 0);
    
    // Compress for mobile
    const dataUrl = c.toDataURL('image/jpeg', 0.7);
    setPhotoData(dataUrl);
    
    // Stop camera
    if (videoEl.srcObject) {
      videoEl.srcObject.getTracks().forEach(t => t.stop());
    }
    setCameraActive(false);
    showStatus('success', 'Photo captured!');
  };

  const savePhoto = async () => {
    if (!photoData) return;
    setSaving(true);
    const base64 = photoData.split(',')[1];
    try {
      const resAudio = await fetch(SUPABASE_URL + '/rest/v1/lifeos_cortex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ title: '📷 Photo ' + new Date().toLocaleString(), content: '[Captured photo]', section: 'all_spark', category: 'visual', metadata: { image: base64 } })
      });
      setPhotoData(null);
      showStatus('success', 'Photo saved to Cortex!');
    } catch(e) { console.error(e); }
    setSaving(false);
  };

  if (false) {
    // Startup removed
  }
  
  const dailySchedule = [
    { time: '06:00', title: '☀️ Wake Up', type: 'routine' },
    { time: '07:00', title: '🍳 Breakfast', type: 'routine' },
    { time: '08:00', title: '💪 Work Out', type: 'routine' },
    { time: '10:00', title: '🎵 Music Time', type: 'creative' },
    { time: '12:00', title: '📱 Content', type: 'work' },
    { time: '14:00', title: '🎥 Stream Prep', type: 'content' },
    { time: '18:00', title: '📺 Live Stream', type: 'stream' },
    { time: '21:00', title: '🍽️ Dinner', type: 'routine' },
    { time: '22:00', title: '🎧 Wind Down', type: 'routine' },
  ];

  return (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="h-full flex flex-col bg-[#f4f4f5] p-4 font-space-mono text-black relative z-10 pt-10">
      <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />
      <Crosshair className="top-2 left-2" />
      <Crosshair className="top-2 right-2" />
      
      <motion.div variants={itemVars} className="flex justify-between items-end border-b-2 border-black pb-2 mb-4 relative z-10">
        <h2 className="text-[12px] font-bold uppercase tracking-widest flex items-center gap-2">
          <Zap size={14} className="text-[#ff4500]" /> SYS_IN
        </h2>
        {status && (
          <div className={`absolute top-12 left-0 right-0 mx-2 px-3 py-2 rounded-lg text-[10px] font-bold text-center z-50 ${status.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            {status.message}
          </div>
        )}
        <div className="flex gap-1.5">
          {['voice', 'cam', 'txt'].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`text-[8px] font-bold px-2 py-0.5 rounded uppercase transition-colors tracking-widest ${activeTab === t ? 'bg-black text-white shadow-[inset_0_0_5px_rgba(255,255,255,0.5)]' : 'bg-black/10 text-black/50 hover:bg-black/20'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </motion.div>
      
      <div className="flex-1 relative z-10 overflow-hidden pb-4">
        <AnimatePresence mode="wait">
          {activeTab === 'txt' && (
            <motion.div key="txt" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="h-full flex flex-col gap-3">
              <div className="text-[8px] uppercase tracking-widest text-black/50 flex items-center gap-2">
                <CheckSquare size={10} /> Append Data Node
              </div>
              <textarea value={text} onChange={e => setText(e.target.value)} className="flex-1 w-full bg-white border-2 border-black rounded-xl p-3 text-[10px] resize-none focus:outline-none focus:border-[#ff4500] shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]" placeholder="Initialize thought sequence..." />
              <button onClick={async () => {
          if (!text.trim()) { showStatus('error', 'Enter some text first'); return; }
          setSaving(true);
          try {
            const res = await fetch(SUPABASE_URL + '/rest/v1/lifeos_cortex', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Prefer': 'return=minimal' },
              body: JSON.stringify({ title: text.slice(0,60), content: text, section: 'all_spark', category: 'idea' })
            });
            if (res.ok) { setText(''); showStatus('success', 'Saved to Cortex!'); }
            else { showStatus('error', 'Failed to save'); }
          } catch(e) { showStatus('error', 'Error: ' + e.message); }
          setSaving(false);
        }} className="w-full bg-black text-white py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-[#ff4500] transition-colors shadow-md active:scale-95" disabled={saving}>{saving ? 'Saving...' : 'Commit Entry'}</button>
            </motion.div>
          )}
          {activeTab === 'voice' && (
            <motion.div key="VOICE" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center gap-4 bg-white border-2 border-black rounded-xl p-4">
              {!audioBlob ? (
                <>
                  <div className="text-[8px] uppercase tracking-widest text-[#ff4500] font-bold flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${recording ? 'bg-[#ff4500] animate-pulse' : 'bg-black/30'}`} />
                    {recording ? 'Recording...' : 'Ready to Record'}
                  </div>
                  <div onClick={recording ? stopRecording : startRecording} className="w-20 h-20 bg-black rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-lg">
                    <div className={`absolute inset-0 rounded-full ${recording ? 'bg-red-500/30 scale-110 animate-ping' : ''}`} />
                    <Mic size={28} className={`${recording ? 'text-red-500' : 'text-white'}`} />
                  </div>
                  <div className="flex gap-1 h-8 items-center">
                    {[...Array(14)].map((_, i) => (
                      <motion.div key={i} animate={{ height: recording ? [4, Math.random()*24+4, 4] : 4 }} transition={{ duration: 0.5, repeat: Infinity, delay: i*0.1 }} className={`w-1.5 rounded-full ${recording ? 'bg-black' : 'bg-black/30'}`} />
                    ))}
                  </div>
                  <div className="text-[7px] text-black/50">{recording ? 'Tap to stop' : 'Tap to record'}</div>
                </>
              ) : (
                <>
                  <div className="text-[8px] uppercase tracking-widest text-green-600 font-bold">Recording Ready!</div>
                  <audio src={URL.createObjectURL(audioBlob)} controls className="w-full h-10" />
                  <div className="flex gap-2 w-full">
                    <button onClick={() => setAudioBlob(null)} className="flex-1 py-2 bg-black/10 rounded text-[8px] font-bold">Discard</button>
                    <button onClick={saveAudio} disabled={saving} className="flex-1 py-2 bg-[#ff4500] text-white rounded text-[8px] font-bold">{saving ? 'Saving...' : 'Save'}</button>
                  </div>
                </>
              )}
            </motion.div>
          )}
          {activeTab === 'cam' && (
            <motion.div key="cam" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col gap-3">
              <div className="flex-1 bg-black rounded-xl relative overflow-hidden border-2 border-black">
                {!photoData ? (
                  <>
                    <video ref={e => setVideoEl(e)} autoPlay playsInline className={`absolute inset-0 w-full h-full object-cover ${cameraActive ? '' : 'hidden'}`} />
                    {!cameraActive && <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white/50 text-[8px]">Camera off</div>
                    </div>}
                    <Crosshair className="top-4 left-4 text-white z-10" />
                    <Crosshair className="bottom-4 right-4 text-white z-10" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white/50 rounded-full z-10" />
                  </>
                ) : (
                  <img src={photoData} alt="Captured" className="absolute inset-0 w-full h-full object-cover" />
                )}
              </div>
              <div className="flex gap-2">
                {!photoData ? (
                  <>
                    <button onClick={cameraActive ? stopCamera : startCamera} className="flex-1 py-2 bg-black text-white rounded text-[8px] font-bold">
                      {cameraActive ? 'Stop Camera' : 'Start Camera'}
                    </button>
                    <button onClick={capturePhoto} disabled={!cameraActive} className="flex-1 py-2 bg-[#ff4500] text-white rounded text-[8px] font-bold disabled:opacity-50">
                      <Camera size={10} className="inline mr-1" /> Capture
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setPhotoData(null)} className="flex-1 py-2 bg-black/10 text-black rounded text-[8px] font-bold">Retake</button>
                    <button onClick={savePhoto} disabled={saving} className="flex-1 py-2 bg-[#ff4500] text-white rounded text-[8px] font-bold">{saving ? 'Saving...' : 'Save Photo'}</button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const ScheduleView = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(SUPABASE_URL + '/rest/v1/lifeos_cortex?order=created_at.desc&limit=20', {
      headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY }
    }).then(r => r.json()).then(d => {
      setEvents(d || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);
  
  return (
  <motion.div variants={containerVars} initial="hidden" animate="show" className="h-full flex flex-col bg-[#f4f4f5] p-4 font-space-mono text-black relative z-10 pt-12">
    <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />
    <motion.div variants={itemVars} className="flex justify-between items-end border-b-2 border-black pb-2 mb-4 relative z-10">
      <h2 className="text-[12px] font-bold uppercase tracking-widest flex items-center gap-2">
        <Calendar size={14} /> TIMELINE
      </h2>
      <span className="text-[8px] bg-black text-white px-2 py-0.5 rounded font-bold tracking-widest shadow-[inset_0_0_5px_rgba(255,255,255,0.5)]">MAR_07</span>
    </motion.div>
    
    <div className="flex-1 overflow-y-auto p-2 space-y-2">
      {dailySchedule.map((item, i) => (
        <div key={i} className="text-[10px] p-1 border-b border-gray-200">{item.time} - {item.title}</div>
      ))}
      {events.map((item, i) => (
        <motion.div variants={itemVars} key={i} className="relative group">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + (i * 0.1), type: 'spring' }} className="absolute -left-[21px] top-2 w-2.5 h-2.5 bg-black rounded-full border-2 border-[#f4f4f5] shadow-[0_0_0_1px_black] group-hover:bg-[#ff4500] group-hover:shadow-[0_0_8px_#ff4500] transition-colors" />
          <div className="text-[8px] font-bold opacity-50 mb-1 flex items-center gap-2">
             {item.created_at?.slice(11,16) || 'TBD'} {i === 1 && <span className="w-1 h-1 bg-[#ff4500] rounded-full animate-pulse" />}
          </div>
          <div className="bg-white border-2 border-black rounded-lg p-2.5 shadow-[3px_3px_0_0_rgba(0,0,0,0.2)] group-hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-shadow">
            <div className="text-[10px] font-bold uppercase tracking-wider text-black">{item.displayTitle}</div>
            <div className="text-[7px] uppercase mt-1 opacity-60 font-bold text-black/60">// {item.category || item.section || 'event'}</div>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);
}

const TasksView = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(SUPABASE_URL + "/rest/v1/lifeos_tasks?select=*&order=created_at.desc", {
      headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY }
    }).then(r => r.json()).then(data => {
      setTasks(data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);
  
  const toggleTask = async (id, currentDone) => {
    const newDone = !currentDone;
    await fetch(SUPABASE_URL + '/rest/v1/lifeos_tasks?id=eq.' + id, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY, 
        'Authorization': 'Bearer ' + SUPABASE_KEY 
      },
      body: JSON.stringify({ status: newDone ? 'completed' : 'pending' })
    });
    setTasks(tasks.map(t => t.id === id ? { ...t, done: newDone } : t));
  };

  const completed = tasks.filter(t => t.status !== 'completed').length;
  const progress = Math.round((completed / tasks.length) * 100);

  if (false) {
    // Startup removed
  }
  
  const dailySchedule = [
    { time: '06:00', title: '☀️ Wake Up', type: 'routine' },
    { time: '07:00', title: '🍳 Breakfast', type: 'routine' },
    { time: '08:00', title: '💪 Work Out', type: 'routine' },
    { time: '10:00', title: '🎵 Music Time', type: 'creative' },
    { time: '12:00', title: '📱 Content', type: 'work' },
    { time: '14:00', title: '🎥 Stream Prep', type: 'content' },
    { time: '18:00', title: '📺 Live Stream', type: 'stream' },
    { time: '21:00', title: '🍽️ Dinner', type: 'routine' },
    { time: '22:00', title: '🎧 Wind Down', type: 'routine' },
  ];

  return (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="h-full flex flex-col bg-[#0a0a0a] p-4 font-space-mono text-white relative z-10 pt-6 overflow-hidden screen-phosphor">
      <div className="absolute inset-0 bg-tech-grid opacity-10 pointer-events-none invert" />
      
      <motion.div variants={itemVars} className="border border-white/10 p-1 mb-2 relative z-10 bg-[#00ff41]/5 flex gap-1">
        <div className="flex justify-between items-center">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#00ff41] flex items-center gap-2">
             <Terminal size={10} /> SYS_TASKS
          </h2>
          <span className="text-[8px] text-[#00ff41] font-bold">{progress}%</span>
        </div>
        <div className="text-[8px] text-white/30 tracking-widest flex items-center">
          [
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5, type: 'spring' }} className="h-2 bg-[#00ff41] text-[#0a0a0a] overflow-hidden whitespace-nowrap flex items-center shadow-[0_0_10px_rgba(0,255,65,0.8)]">
            ██████████
          </motion.div>
          <span className="flex-1 opacity-50">----------</span>
          ]
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide pb-4 relative z-10">
        {tasks.map((task) => (
          <motion.div 
            variants={itemVars} 
            key={task.id} 
            onClick={() => toggleTask(task.id)}
            className="flex items-start gap-3 p-2.5 border-b border-dashed border-white/20 group cursor-pointer hover:bg-white/10 transition-colors"
          >
            <div className={`mt-0.5 w-3 h-3 border flex items-center justify-center shrink-0 transition-colors ${task.done ? 'bg-[#00ff41] border-[#00ff41] text-black shadow-[0_0_8px_rgba(0,255,65,0.6)]' : 'border-white/50 text-transparent group-hover:border-white'}`}>
              <AnimatePresence>
                {task.done && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><CheckSquare size={8} /></motion.div>}
              </AnimatePresence>
            </div>
            <span className={`text-[9px] leading-snug tracking-wide transition-all ${task.done ? 'line-through opacity-50 text-[#00ff41]' : 'opacity-100'}`}>
              {task.title}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const CortexView = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(SUPABASE_URL + '/rest/v1/lifeos_cortex?order=created_at.desc&limit=20', {
      headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY }
    }).then(r => r.json()).then(d => {
      setItems(d || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);
  
  return (
  <motion.div variants={containerVars} initial="hidden" animate="show" className="h-full flex flex-col bg-[#ff4500] p-4 font-space-mono text-black relative z-10 pt-6 overflow-hidden">
    {/* Animated background rings */}
    <motion.div initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute top-0 right-0 w-40 h-40 border-2 border-dashed border-black/20 rounded-full translate-x-1/4 -translate-y-1/4 pointer-events-none" />
    <motion.div initial={{ rotate: 360 }} animate={{ rotate: 0 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute top-0 right-0 w-56 h-56 border-4 border-black/10 rounded-full translate-x-1/4 -translate-y-1/4 pointer-events-none flex items-center justify-center">
       <div className="w-1 h-full bg-black/10" />
    </motion.div>
    
    <motion.div variants={itemVars} className="flex justify-between items-end border-b-2 border-black pb-1 mb-2 relative z-10">
      <h2 className="text-[14px] font-bold uppercase tracking-tighter flex items-center gap-1">
        <Brain size={16} className="text-black fill-black" /> CORTEX_MEM
      </h2>
      <span className="text-[8px] bg-black text-[#ff4500] px-2 py-0.5 uppercase tracking-widest font-bold shadow-[2px_2px_0_0_rgba(0,0,0,0.5)] flex items-center gap-1">
        <div className="w-1 h-1 bg-[#ff4500] rounded-full animate-ping" /> SYNCED
      </span>
    </motion.div>

    <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide pb-4 relative z-10">
      {(items || []).map((item, i) => (
        <motion.div variants={itemVars} key={i} className="bg-black text-[#ff4500] p-3 border-l-4 border-white shadow-[4px_4px_0_0_rgba(0,0,0,0.3)]">
          <div className="text-[7px] uppercase tracking-widest mb-1 text-white opacity-80 border-b border-white/20 pb-1 w-max">{item.created_at?.slice(11,16) || 'TBD'}</div>
          <div className="text-[9px] leading-relaxed font-bold tracking-wide mt-1 screen-phosphor">{item.displayText}</div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);
}

const SystemView = () => (
  <motion.div variants={containerVars} initial="hidden" animate="show" className="h-full flex flex-col bg-black p-4 font-space-mono text-[#00ff41] relative z-10 pt-6 overflow-hidden screen-phosphor">
    <motion.div variants={itemVars} className="flex justify-between items-center border-b border-[#00ff41]/50 pb-2 mb-4 relative z-10">
      <span className="text-[10px] font-bold tracking-widest flex items-center gap-2">
        <Cpu size={12} /> TELEMETRY_DUMP
      </span>
      <div className="w-1.5 h-3 bg-[#00ff41] animate-pulse shadow-[0_0_8px_rgba(0,255,65,0.8)]" />
    </motion.div>
    
    <motion.div variants={itemVars} className="flex-1 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black z-10 pointer-events-none" />
      <motion.div 
        animate={{ y: [0, -400] }} 
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="text-[7px] leading-relaxed tracking-widest opacity-80 flex flex-col gap-1.5"
      >
        {[...Array(60)].map((_, i) => (
          <div key={i} className="flex gap-4 border-b border-[#00ff41]/10 pb-0.5">
            <span className="opacity-50">0x{Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase()}</span>
            <span className="opacity-70">{Math.random() > 0.85 ? 'ERR_BUFFER_OVERFLOW' : 'MEM_ALLOC_OK'}</span>
            <span className="ml-auto opacity-40">{Math.floor(Math.random() * 99)}ms</span>
          </div>
        ))}
      </motion.div>
    </motion.div>
    
    <motion.div variants={itemVars} className="mt-auto pt-3 border-t border-[#00ff41]/50 flex flex-col gap-2 relative z-10">
      <div className="flex items-center gap-2">
        <span className="text-[8px] w-8">CPU</span>
        <div className="flex-1 flex gap-0.5 h-3 items-end">
          {[...Array(15)].map((_, i) => (
            <motion.div key={i} animate={{ height: [Math.random()*12, Math.random()*12, Math.random()*12] }} transition={{ duration: 0.2, repeat: Infinity }} className="flex-1 bg-[#00ff41]/80" />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[8px] w-8">RAM</span>
        <div className="flex-1 bg-white/10 h-2 border border-[#00ff41]/30">
          <motion.div className="h-full bg-[#00ff41]" animate={{ width: ['80%', '85%', '78%', '82%'] }} transition={{ duration: 2, repeat: Infinity }} />
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// --- MAIN DEVICE COMPONENT ---

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  
  // Auto-start after 10 seconds no matter what
  
  const [currentView, setCurrentView] = useState('menu'); 
  const [time, setTime] = useState('12:00');
  const [date, setDate] = useState('MAR 07');
  const [pressedKey, setPressedKey] = useState(null);

  // 3D Parallax State
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  // Mouse Parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Calculate rotation based on cursor position (-8 to +8 degrees)
      const x = (e.clientX / window.innerWidth - 0.5) * 16;
      const y = (e.clientY / window.innerHeight - 0.5) * -16;
      setRotateX(y);
      setRotateY(x);
    };
    
    const handleMouseLeave = () => {
      setRotateX(0);
      setRotateY(0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    
    if (false) {
    // Startup removed
  }
  
  return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Clock simulation
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    if (false) {
    // Startup removed
  }
  
  return () => clearInterval(interval);
  }, []);
  
  // Hardware controls mapping
  const scrollUp = () => {
    setPressedKey('up');
    setTimeout(() => setPressedKey(null), 150);
    if (currentView === 'menu') setActiveIndex((prev) => Math.max(0, prev - 1));
  };

  const scrollDown = () => {
    setPressedKey('down');
    setTimeout(() => setPressedKey(null), 150);
    if (currentView === 'menu') setActiveIndex((prev) => Math.min(MENU_ITEMS.length - 1, prev + 1));
  };

  const enterView = () => {
    setPressedKey('center');
    setTimeout(() => setPressedKey(null), 150);
    if (currentView === 'menu') setCurrentView(MENU_ITEMS[activeIndex].id);
  };

  const goBack = () => {
    setPressedKey('left');
    setTimeout(() => setPressedKey(null), 150);
    setCurrentView('menu');
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') scrollUp();
      if (e.key === 'ArrowDown') scrollDown();
      if (e.key === 'Enter') enterView();
      if (e.key === 'Escape' || e.key === 'ArrowLeft') goBack();
    };
    window.addEventListener('keydown', handleKeyDown);
    if (false) {
    // Startup removed
  }
  
  return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, activeIndex]);

  // DynaVOICE LED Color based on View
  const ledColor = useMemo(() => {
    switch (currentView) {
      case 'inputs': return '#ff4500'; // Orange
      case 'schedule': return '#3b82f6'; // Blue
      case 'tasks': return '#00ff41'; // Matrix Green
      case 'cortex': return '#eab308'; // Yellow
      case 'system': return '#00ff41'; // Matrix Green
      default: return '#9ca3af'; // Default Grey
    }
  }, [currentView]);

  const renderScreenContent = () => {
    switch (currentView) {
      case 'inputs': return <InputsView />;
      case 'schedule': return <ScheduleView />;
      case 'tasks': return <TasksView />;
      case 'cortex': return <CortexView />;
      case 'system': return <SystemView />;
      default:
        // HOME MENU
        if (false) {
    // Startup removed
  }
  
  return (
          <div className="w-full h-full relative bg-[#e5e5e5] flex items-center justify-start overflow-hidden">
            <MagneticInkBackground />
            
            <Crosshair className="top-4 left-4" />
            <Crosshair className="bottom-4 right-4" />

            {/* Shifted Menu Container */}
            <div className="absolute inset-0 z-20 flex items-center justify-start pl-8 pointer-events-none" style={{ transform: 'rotate(-8deg)' }}>
              <div className="relative flex flex-col gap-4 w-full">
                
                {/* The Lobster Target Indicator */}
                <motion.div 
                  className="absolute -left-5 z-30 text-[#ff4500] drop-shadow-[0_0_10px_rgba(255,69,0,0.8)] w-8 h-8 pointer-events-none"
                  initial={false}
                  animate={{ y: activeIndex * 64 + 8 }} // 48px item + 16px gap = 64px step. +8px offset to center the lobster vertically next to the active item
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  <TacticalLobster className="w-full h-full rotate-90" isMoving={pressedKey === 'up' || pressedKey === 'down'} isTyping={pressedKey === 'center'} />
                </motion.div>

                {/* Animated Curved Menu Items */}
                {MENU_ITEMS.map((item, i) => {
                  const isActive = i === activeIndex;
                  const offset = Math.abs(activeIndex - i);
                  const curve = offset * offset * 5; // Creates the parabolic bulge
                  
                  if (false) {
    // Startup removed
  }
  
  return (
                    <motion.div 
                      key={item.id} 
                      className="flex items-center gap-3 h-12 pointer-events-auto cursor-pointer"
                      animate={{ 
                        x: curve,
                        opacity: Math.max(0.2, 1 - offset * 0.3),
                        scale: isActive ? 1.05 : 0.95
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      onPointerDown={(e) => {
                        e.preventDefault();
                        if (isActive) enterView();
                        else setActiveIndex(i);
                      }}
                    >
                      <div className={`w-2 h-2 rounded-full transition-colors duration-300 shrink-0 ${isActive ? 'bg-[#ff4500] shadow-[0_0_10px_#ff4500]' : 'bg-black/30'}`} />
                      <div className={`py-2 px-4 flex flex-col justify-center border-2 rounded-2xl transition-all duration-300 w-44 ${isActive ? 'bg-black text-white border-[#ff4500] shadow-[4px_4px_0_0_#ff4500]' : 'bg-white/70 backdrop-blur-sm text-black border-black/20 hover:border-black/50'}`}>
                        <span className="font-bold text-[12px] font-space-mono tracking-widest uppercase leading-none">{item.label}</span>
                        {isActive && <span className="text-[7px] text-[#ff4500] mt-1.5 uppercase tracking-wider block">{item.desc}</span>}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        );
    }
  };

  const getDPadTransform = () => {
    switch(pressedKey) {
      case 'up': return 'rotateX(15deg) translateY(-4px)';
      case 'down': return 'rotateX(-15deg) translateY(4px)';
      case 'left': return 'rotateY(-15deg) translateX(-4px)';
      case 'right': return 'rotateY(15deg) translateX(4px)';
      case 'center': return 'scale(0.94) translateZ(-6px)';
      default: return 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
    }
  };

  if (false) {
    // Startup removed
  }
  
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&family=Space+Mono:wght@400;700&display=swap');
        body { 
          background: transparent; 
          margin: 0; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          min-height: 100vh;
          font-family: 'Space Grotesk', sans-serif;
          perspective: 1200px;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scanlines {
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.15));
          background-size: 100% 4px;
        }
        .bg-tech-grid {
          background-image: linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px);
          background-size: 15px 15px; 
        }
        .screen-phosphor {
          text-shadow: 0 0 8px currentColor;
        }
      `}} />

      {/* --- PHYSICAL DEVICE SHELL WITH 3D PARALLAX TILT --- */}
      <motion.div 
        className="relative w-[340px] h-[680px] touch-none"
        animate={{ rotateX, rotateY }}
        transition={{ type: "spring", stiffness: 150, damping: 20, mass: 0.5 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        
        {/* DynaVOICE Drop Shadow (Reacts to tilt) */}
        <motion.div 
          className="absolute inset-0 bg-black/40 rounded-[3.5rem] blur-2xl -z-10"
          animate={{ x: -rotateY * 2, y: rotateX * 2 }}
        />

        {/* Top Right Metallic Loop */}
        <div className="absolute top-[-15px] right-[25px] w-14 h-14 rounded-full border-[6px] device-handle bg-transparent shadow-[0_4px_10px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.9)] z-0" style={{ transform: 'translateZ(-10px)' }} />

        {/* Main Body */}
        <div className="absolute inset-0 device-body rounded-[3.5rem] shadow-[inset_3px_6px_12px_rgba(255,255,255,1),inset_-6px_-8px_20px_rgba(0,0,0,0.15),0_10px_30px_rgba(0,0,0,0.2)] border border-[#d1d1cc] overflow-hidden z-10 flex flex-col relative">
          
          {/* Top Edge Detail & DynaVOICE LED */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-2 bg-[#ff4500] rounded-b-md shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]" />
          <div className="absolute top-5 left-6 flex items-center gap-2">
            <div 
              className={`w-2.5 h-2.5 rounded-full border border-black/20 transition-all duration-500 ${currentView !== 'menu' ? 'animate-pulse' : ''}`}
              style={{ backgroundColor: ledColor, boxShadow: `0 0 12px ${ledColor}` }} 
            />
          </div>

          {/* Device Shell Engraved Lobsters */}
          <div className="absolute top-4 right-6 text-black/10 pointer-events-none">
            <TacticalLobster className="w-4 h-4" />
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-black/10 pointer-events-none">
            <TacticalLobster className="w-6 h-6" />
          </div>

          {/* THE SCREEN ASSEMBLY */}
          <div className="w-[88%] mx-auto mt-12 h-[360px] device-screen-border rounded-[1.5rem] border-[10px] border-[#1a1a1a] shadow-[inset_0_5px_25px_rgba(0,0,0,1),0_8px_20px_rgba(0,0,0,0.15)] relative overflow-hidden flex flex-col">
            
            {/* Screen Inner Bezel Shadow */}
            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] pointer-events-none z-40" />
            
            {/* OS Status Bar (Floating Pills) */}
            <div className="absolute top-2 left-0 right-0 z-30 flex items-center justify-between px-3 text-[7px] font-space-mono font-bold tracking-widest text-white/80 pointer-events-none">
               <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1 rounded-full shadow-lg">
                 <Wifi size={8} className="text-[#00ff41]" />
                 <span>LINK</span>
               </div>
               <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1 rounded-full shadow-lg screen-phosphor">
                 {time}
               </div>
               <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1 rounded-full shadow-lg text-white">
                 {date}
               </div>
            </div>

            {/* View Header Back Button */}
            <AnimatePresence>
              {currentView !== 'menu' && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute top-9 left-3 z-30">
                  <button onClick={goBack} className="w-7 h-7 bg-black/80 backdrop-blur-md border-2 border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors shadow-lg active:scale-90">
                    <ArrowLeft size={12} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Screen Content Wrapper with Glitch Transition */}
            <div className="flex-1 relative w-full h-full bg-[#111] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentView}
                  initial={{ opacity: 0, scale: 1.05, filter: 'blur(10px)', x: 10, y: Math.random() * 10 - 5 }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', x: 0, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)', x: -10, transition: { duration: 0.15 } }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-full h-full"
                >
                  {renderScreenContent()}
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Screen Realism Overlays (Scanlines & Gloss) */}
            <div className="absolute inset-0 scanlines pointer-events-none z-40 mix-blend-overlay" />
            <motion.div 
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none z-50 mix-blend-screen"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </div>

          {/* SPEAKER GRILL */}
          <div className="w-full flex justify-center gap-1.5 mt-5 px-12 opacity-40">
            {[...Array(14)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-black/80 shadow-[inset_0_1px_3px_rgba(0,0,0,1),0_1px_1px_rgba(255,255,255,0.8)]" />
            ))}
          </div>

          {/* LOWER CONTROL PAD AREA */}
          <div className="flex-1 flex items-center justify-center relative perspective-1000 mt-2">
            {/* The Large Circular D-Pad Outer Ring */}
            <div className="w-[230px] h-[230px] rounded-full device-dpad shadow-[inset_0_8px_15px_rgba(255,255,255,1),inset_0_-8px_20px_rgba(0,0,0,0.1),0_12px_25px_rgba(0,0,0,0.2)] relative flex items-center justify-center border border-[#d1d1cc]">
              
              {/* The Inner Moving D-Pad */}
              <motion.div 
                className="w-[210px] h-[210px] rounded-full bg-[#9CA3AF] shadow-[inset_0_15px_25px_rgba(0,0,0,0.15),inset_0_-4px_10px_rgba(255,255,255,0.7),0_8px_20px_rgba(0,0,0,0.4)] relative flex items-center justify-center border border-[#888] overflow-hidden"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ transform: getDPadTransform() }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                {/* D-Pad Texture / Grip Rings */}
                <div className="absolute inset-0 rounded-full border-[20px] border-[#8e95a1] opacity-40 pointer-events-none" />
                <div className="absolute inset-0 rounded-full border-[40px] border-[#939ba6] opacity-40 pointer-events-none" />
                
                {/* Inner cross indent lines */}
                <div className="absolute w-[170px] h-[8px] bg-[#888] rounded-full shadow-[inset_0_3px_6px_rgba(0,0,0,0.5),0_1px_2px_rgba(255,255,255,0.6)] pointer-events-none" />
                <div className="absolute w-[8px] h-[170px] bg-[#888] rounded-full shadow-[inset_0_3px_6px_rgba(0,0,0,0.5),0_1px_2px_rgba(255,255,255,0.6)] pointer-events-none" />
                
                {/* Center indent bowl */}
                <div className="absolute w-[28px] h-[28px] rounded-full bg-[#777] shadow-[inset_0_5px_10px_rgba(0,0,0,0.7),0_2px_4px_rgba(255,255,255,0.7)] pointer-events-none" />

                {/* Functional Invisible Click Zones overlaid on the D-Pad */}
                <div className="absolute inset-0 flex flex-col z-20 touch-none">
                  <button onPointerDown={(e) => { e.preventDefault(); scrollUp(); }} className="h-1/3 w-full rounded-t-full outline-none cursor-pointer" title="Up" />
                  <div className="h-1/3 w-full flex">
                    <button onPointerDown={(e) => { e.preventDefault(); goBack(); }} className="w-1/3 h-full rounded-l-full outline-none cursor-pointer" title="Back" />
                    <button onPointerDown={(e) => { e.preventDefault(); enterView(); }} className="w-1/3 h-full rounded-full outline-none cursor-pointer" title="Select" />
                    <button onPointerDown={(e) => { e.preventDefault(); setPressedKey('right'); setTimeout(() => setPressedKey(null), 150); }} className="w-1/3 h-full rounded-r-full outline-none cursor-pointer" title="Forward" />
                  </div>
                  <button onPointerDown={(e) => { e.preventDefault(); scrollDown(); }} className="h-1/3 w-full rounded-b-full outline-none cursor-pointer" title="Down" />
                </div>
              </motion.div>
            </div>
          </div>
          
        </div>
      </motion.div>
    </>
  );
}