import React, { useState } from 'react';
import TheoryTab from './tabs/TheoryTab';
import TheoryPage from './pages/Theory/TheoryPage';
import { PageLayout } from './components/layout/PageLayout';
import { Card } from './components/ui/Card';
import ExerciseTab from './tabs/ExerciseTab';
import ToolTab from './tabs/ToolTab';
import Tab from './components/Tab';

export default function App() {
  const [tab, setTab] = useState('theory');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto card-clean overflow-hidden">
        <header className="app-header border-b px-6 py-6">
          <h1 className="text-2xl font-bold">Discrete Log & Diffie–Hellman Demo</h1>
          <p className="text-slate-600 text-sm mt-1">
            Interactive learning tool for modern cryptography
          </p>
        </header>

        <nav className="tabs-bar flex gap-3 px-6 py-4 border-b">
          <Tab label="Lý thuyết" active={tab==='theory'} onClick={()=>setTab('theory')} />
          <Tab label="Bài tập học thuật" active={tab==='exercises'} onClick={()=>setTab('exercises')} />
          <Tab label="Công cụ mã hóa" active={tab==='tools'} onClick={()=>setTab('tools')} />
        </nav>

        <main className="p-6">
          {/* simple CSS transition fallback */}
          <div className="transition-panel">
            {tab === 'theory' && (
              <PageLayout title="📘 Diffie–Hellman Theory">
                <Card>
                  <TheoryPage />
                </Card>
              </PageLayout>
            )}
            {tab === 'exercises' && <ExerciseTab />}
            {tab === 'tools' && <ToolTab />}
          </div>
        </main>
      </div>
    </div>
  );
}
