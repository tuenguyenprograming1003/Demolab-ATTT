import React from 'react'

export function Card({ children }){
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      {children}
    </div>
  )
}
