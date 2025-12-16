import React from 'react'

export function Tabs({ tabs, active, onChange }){
  return (
    <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit">
      {tabs.map(t => (
        <button key={t} onClick={() => onChange(t)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${active === t ? 'bg-white text-blue-600 shadow' : 'text-slate-500 hover:text-blue-600'}`}>
          {t}
        </button>
      ))}
    </div>
  )
}
