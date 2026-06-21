'use client'

import { useState } from 'react'
import { Sparkles, Copy, Check } from 'lucide-react'
import { Lead } from '@/types'

export default function AIMessageDraft({ lead }: { lead: Lead }) {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  async function generateMessage() {
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadName: lead.name,
          tripName: lead.trip?.name || 'their trip',
          vibe: lead.vibe,
          groupType: lead.group_type,
        }),
      })

      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setMessage(data.message)
      }
    } catch {
      setError('Something went wrong. Try again.')
    }
    setLoading(false)
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-xl border border-[#1C1B1A]/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-[#1C1B1A] flex items-center gap-1.5">
          <Sparkles size={14} className="text-[#D55D27]" /> Draft WhatsApp message
        </h2>
        <button
          onClick={generateMessage}
          disabled={loading}
          className="text-sm bg-[#1C1B1A] text-white px-3 py-1.5 rounded-lg hover:bg-[#D55D27] disabled:opacity-50 transition-colors"
        >
          {loading ? 'Drafting...' : message ? 'Regenerate' : 'Generate'}
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {message && (
        <div className="bg-[#FFFBF5] border border-[#1C1B1A]/10 rounded-lg p-4">
          <p className="text-sm text-[#1C1B1A] whitespace-pre-wrap">{message}</p>
          <button
            onClick={copyToClipboard}
            className="mt-3 inline-flex items-center gap-1 text-xs text-[#1C1B1A]/50 hover:text-[#D55D27]"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied' : 'Copy message'}
          </button>
        </div>
      )}

      {!message && !loading && !error && (
        <p className="text-sm text-[#1C1B1A]/40">Generate a warm first message based on what this traveller told you.</p>
      )}
    </div>
  )
}