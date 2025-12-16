import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import theory from '../../content/theory/diffie-hellman.md?raw'

export default function TheoryPage(){
  return (
    <div className="max-w-4xl mx-auto p-8">
      <article className="prose prose-lg prose-blue">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{theory}</ReactMarkdown>
      </article>
    </div>
  )
}
