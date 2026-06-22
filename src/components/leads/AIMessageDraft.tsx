'use client'

import { useState } from 'react'
import { Sparkles, Copy, Check } from 'lucide-react'
import { Lead, CallLog } from '@/types'

function AISection({
  title,
  onGenerate,
  placeholder,
}: {
  title: string
  onGenerate: () => Promise<string>
  placeholder: string
}) {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  async function handleGenerate() {
    setLoading(true)
    setError('')
    try {
      const message = await onGenerate()
      setResult(message)
    } catch {
      setError('Something went wrong. Try again.')
    }
    setLoading(false)
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border-t border-[#1C1B1A]/10 pt-4 first:border-0 first:pt-0">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-[#1C1B1A]/60">{title}</p>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="text-xs bg-[#1C1B1A] text-white px-3 py-1.5 rounded-lg hover:bg-[#D55D27] disabled:opacity-50 transition-colors"
        >
          {loading ? 'Thinking...' : result ? 'Regenerate' : 'Generate'}
        </button>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {!result && !loading && !error && (
        <p className="text-xs text-[#1C1B1A]/30">{placeholder}</p>
      )}

      {result && (
        <div className="bg-[#FFFBF5] border border-[#1C1B1A]/10 rounded-lg p-3">
          <p className="text-sm text-[#1C1B1A]">{result}</p>
          <button
            onClick={copyToClipboard}
            className="mt-2 inline-flex items-center gap-1 text-xs text-[#1C1B1A]/40 hover:text-[#D55D27]"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  )
}

export default function AIMessageDraft({ lead, callLogs }: { lead: Lead; callLogs: CallLog[] }) {
  async function callAI(action: string, extra?: Record<string, string>) {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        leadName: lead.name,
        tripName: lead.trip?.name || 'their trip',
        vibe: lead.vibe || '',
        groupType: lead.group_type,
        ...extra,
      }),
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error)
    return data.message
  }

  return (
    <div className="bg-white rounded-xl border border-[#1C1B1A]/10 p-6">
      <div className="flex items-start justify-between mb-4">
  <h2 className="text-sm font-semibold text-[#1C1B1A] flex items-center gap-1.5">
    <Sparkles size={14} className="text-[#D55D27]" /> AI assist
  </h2>
  <p className="text-xs text-[#1C1B1A]/30 text-right max-w-[180px]">Generate one at a time. Allow a few seconds between each.</p>
</div>

      <div className="space-y-4">
        <AISection
          title="Draft WhatsApp message"
          placeholder="A warm first message based on what this traveller shared."
          onGenerate={() => callAI('whatsapp')}
        />

        <AISection
          title="Call log summary"
          placeholder="A one-line summary of where this lead stands and what to do next."
          onGenerate={() => callAI('summary', {
            callLogs: callLogs.length > 0
              ? callLogs.map((l) => `- ${l.note}${l.next_action ? ` (next: ${l.next_action})` : ''}`).join('\n')
              : 'No call notes yet.'
          })}
        />

        <AISection
          title="Vibe fit"
          placeholder="A quick read on whether this traveller fits Nomichi's slow travel style."
          onGenerate={() => callAI('vibefit')}
        />
      </div>
    </div>
  )
}