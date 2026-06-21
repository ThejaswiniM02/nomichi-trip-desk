'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Lead, LeadStatus, CallLog } from '@/types'
import { ArrowLeft } from 'lucide-react'
import CallLogSection from '@/components/leads/CallLogSection'

const STATUSES: LeadStatus[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'VIBE_CHECK_SENT', 'CONFIRMED', 'NOT_A_FIT']

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [lead, setLead] = useState<Lead | null>(null)
  const [callLogs, setCallLogs] = useState<CallLog[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchLead()
    fetchCallLogs()
  }, [id])

  async function fetchLead() {
    const supabase = createClient()
    const { data } = await supabase
      .from('leads')
      .select('*, trip:trips(*)')
      .eq('id', id)
      .single()

    setLead(data)
    setLoading(false)
  }

  async function fetchCallLogs() {
    const supabase = createClient()
    const { data } = await supabase
      .from('call_logs')
      .select('*')
      .eq('lead_id', id)
      .order('created_at', { ascending: false })

    setCallLogs(data || [])
  }

  async function updateStatus(newStatus: LeadStatus) {
    setUpdating(true)
    const supabase = createClient()
    await supabase.from('leads').update({ status: newStatus }).eq('id', id)
    setLead((prev) => (prev ? { ...prev, status: newStatus } : prev))
    setUpdating(false)
  }

  if (loading) return <p className="text-[#1C1B1A]/50 text-sm">Loading...</p>
  if (!lead) return <p className="text-[#1C1B1A]/50 text-sm">Lead not found.</p>

  return (
    <div>
      <Link href="/admin/leads" className="inline-flex items-center gap-1 text-sm text-[#1C1B1A]/50 hover:text-[#D55D27] mb-6">
        <ArrowLeft size={14} /> Back to leads
      </Link>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left: Lead details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-[#1C1B1A]/10 p-6">
            <h1 className="text-xl font-bold text-[#1C1B1A] mb-1">{lead.name}</h1>
            <p className="text-sm text-[#1C1B1A]/50 mb-4">Enquired about {lead.trip?.name || 'a trip'}</p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[#1C1B1A]/40 text-xs mb-0.5">Phone</p>
                <p className="text-[#1C1B1A]">{lead.phone}</p>
              </div>
              <div>
                <p className="text-[#1C1B1A]/40 text-xs mb-0.5">Email</p>
                <p className="text-[#1C1B1A]">{lead.email}</p>
              </div>
              <div>
                <p className="text-[#1C1B1A]/40 text-xs mb-0.5">Group type</p>
                <p className="text-[#1C1B1A] capitalize">{lead.group_type}</p>
              </div>
              <div>
                <p className="text-[#1C1B1A]/40 text-xs mb-0.5">Preferred month</p>
                <p className="text-[#1C1B1A]">{lead.preferred_month}</p>
              </div>
            </div>

            {lead.vibe && (
              <div className="mt-4 pt-4 border-t border-[#1C1B1A]/10">
                <p className="text-[#1C1B1A]/40 text-xs mb-1">What they're hoping this trip feels like</p>
                <p className="text-sm text-[#1C1B1A]">{lead.vibe}</p>
              </div>
            )}
          </div>

          <CallLogSection leadId={id} callLogs={callLogs} onLogAdded={fetchCallLogs} />
        </div>

        {/* Right: Status + pipeline */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#1C1B1A]/10 p-6">
            <p className="text-xs text-[#1C1B1A]/40 mb-2">Status</p>
            <select
              value={lead.status}
              disabled={updating}
              onChange={(e) => updateStatus(e.target.value as LeadStatus)}
              className="w-full border border-[#1C1B1A]/15 rounded-lg px-3 py-2 text-sm text-[#1C1B1A] focus:outline-none focus:border-[#D55D27] disabled:opacity-50"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
              ))}
            </select>

            <div className="mt-4 space-y-1">
              {STATUSES.map((s, i) => {
                const currentIndex = STATUSES.indexOf(lead.status)
                const isPast = i < currentIndex
                const isCurrent = i === currentIndex
                return (
                  <div key={s} className="flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-[#D55D27]' : isPast ? 'bg-[#1C1B1A]/30' : 'bg-[#1C1B1A]/10'}`} />
                    <span className={isCurrent ? 'text-[#1C1B1A] font-medium' : 'text-[#1C1B1A]/40'}>
                      {s.replace(/_/g, ' ')}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}