'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Lead, LeadStatus } from '@/types'

const STATUS_COLORS: Record<LeadStatus, string> = {
  NEW: 'bg-[#D1B788]/30 text-[#1C1B1A]',
  CONTACTED: 'bg-blue-100 text-blue-700',
  QUALIFIED: 'bg-purple-100 text-purple-700',
  VIBE_CHECK_SENT: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  NOT_A_FIT: 'bg-red-100 text-red-700',
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  useEffect(() => {
    fetchLeads()
  }, [])

  async function fetchLeads() {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('leads')
      .select('*, trip:trips(*)')
      .order('created_at', { ascending: false })

    setLeads(data || [])
    setLoading(false)
  }

  const filtered = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search)
    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1C1B1A]">Leads</h1>
      </div>

      <div className="flex gap-3 mb-6">
        <input
          placeholder="Search by name or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-[#1C1B1A]/15 rounded-lg px-3 py-2 text-sm text-[#1C1B1A] focus:outline-none focus:border-[#D55D27]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-[#1C1B1A]/15 rounded-lg px-3 py-2 text-sm text-[#1C1B1A] focus:outline-none focus:border-[#D55D27]"
        >
          <option value="ALL">All statuses</option>
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="QUALIFIED">Qualified</option>
          <option value="VIBE_CHECK_SENT">Vibe check sent</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="NOT_A_FIT">Not a fit</option>
        </select>
      </div>

      {loading && <p className="text-[#1C1B1A]/50 text-sm">Loading leads...</p>}

      {!loading && filtered.length === 0 && (
        <p className="text-[#1C1B1A]/50 text-sm">No leads match your search.</p>
      )}

      {!loading && filtered.length > 0 && (
        <div className="bg-white rounded-xl border border-[#1C1B1A]/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1C1B1A]/10 text-left text-[#1C1B1A]/50">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Trip</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Received</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-[#1C1B1A]/5 last:border-0 hover:bg-[#FFFBF5] cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <Link href={`/admin/leads/${lead.id}`} className="text-[#1C1B1A] font-medium hover:text-[#D55D27]">
                      {lead.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[#1C1B1A]/70">{lead.trip?.name || '—'}</td>
                  <td className="px-4 py-3 text-[#1C1B1A]/70">{lead.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[lead.status]}`}>
                      {lead.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#1C1B1A]/50">
                    {new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}