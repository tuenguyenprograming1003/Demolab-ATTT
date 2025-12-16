import React from 'react'

export function PageLayout({ title, children }){
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">{title}</h1>

        {/* Important: do not constrain children with max-width here — tools and dashboards need full width */}
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  )
}
