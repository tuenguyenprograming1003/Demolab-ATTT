import React, { useState } from 'react';
import TheoryTab from './tabs/TheoryTab';
import ExerciseTab from './tabs/ExerciseTab';
import ToolTab from './tabs/ToolTab';
import Tab from './components/Tab';

export default function App() {
  const [tab, setTab] = useState('theory');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        <header className="border-b px-6 py-4">
          <h1 className="text-2xl font-bold">Discrete Log & Diffie–Hellman Demo</h1>
          <p className="text-slate-600 text-sm mt-1">
            Interactive learning tool for modern cryptography
          </p>
        </header>

        <nav className="flex gap-2 px-6 py-3 bg-slate-50 border-b">
          <Tab label="Lý thuyết" active={tab==='theory'} onClick={()=>setTab('theory')} />
          <Tab label="Bài tập học thuật" active={tab==='exercises'} onClick={()=>setTab('exercises')} />
          <Tab label="Công cụ mã hóa" active={tab==='tools'} onClick={()=>setTab('tools')} />
        </nav>

        <main className="p-6">
          <div className="transition-panel">
            {tab === 'theory' && <TheoryTab />}
            {tab === 'exercises' && <ExerciseTab />}
            {tab === 'tools' && <ToolTab />}
          </div>
        </main>
      </div>
    </div>
  );
}
