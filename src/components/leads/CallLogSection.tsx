'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CallLog } from '@/types'

export default function CallLogSection({
  leadId,
  callLogs,
  onLogAdded,
}: {
  leadId: string
  callLogs: CallLog[]
  onLogAdded: () => void
}) {
  const [note, setNote] = useState('')
  const [nextAction, setNextAction] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleAdd() {
    if (!note.trim()) return
    setSubmitting(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    await supabase.from('call_logs').insert({
      lead_id: leadId,
      note,
      next_action: nextAction || null,
      created_by: user?.id,
    })

    setNote('')
    setNextAction('')
    setSubmitting(false)
    onLogAdded()
  }

  return (
    <div className="bg-white rounded-xl border border-[#1C1B1A]/10 p-6">
      <h2 className="text-sm font-semibold text-[#1C1B1A] mb-4">Call log</h2>

      <div className="space-y-2 mb-4">
        <textarea
          placeholder="What was said?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="w-full border border-[#1C1B1A]/15 rounded-lg px-3 py-2 text-sm text-[#1C1B1A] focus:outline-none focus:border-[#D55D27] resize-none"
        />
        <input
          placeholder="Next action (optional)"
          value={nextAction}
          onChange={(e) => setNextAction(e.target.value)}
          className="w-full border border-[#1C1B1A]/15 rounded-lg px-3 py-2 text-sm text-[#1C1B1A] focus:outline-none focus:border-[#D55D27]"
        />
        <button
          onClick={handleAdd}
          disabled={submitting || !note.trim()}
          className="bg-[#1C1B1A] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#D55D27] disabled:opacity-40 transition-colors"
        >
          {submitting ? 'Adding...' : 'Add note'}
        </button>
      </div>

      {callLogs.length === 0 && (
        <p className="text-sm text-[#1C1B1A]/40">No notes yet.</p>
      )}

      <div className="space-y-3">
        {callLogs.map((log) => (
          <div key={log.id} className="border-t border-[#1C1B1A]/10 pt-3">
            <p className="text-sm text-[#1C1B1A]">{log.note}</p>
            {log.next_action && (
              <p className="text-xs text-[#D55D27] mt-1">Next: {log.next_action}</p>
            )}
            <p className="text-xs text-[#1C1B1A]/40 mt-1">
              {new Date(log.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}