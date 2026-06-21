'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Lead, Trip, LeadStatus } from '@/types'

const STATUSES: LeadStatus[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'VIBE_CHECK_SENT', 'CONFIRMED', 'NOT_A_FIT']

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const supabase = createClient()
    const [leadsRes, tripsRes] = await Promise.all([
      supabase.from('leads').select('*, trip:trips(*)'),
      supabase.from('trips').select('*'),
    ])
    setLeads(leadsRes.data || [])
    setTrips(tripsRes.data || [])
    setLoading(false)
  }

  if (loading) return <p className="text-[#1C1B1A]/50 text-sm">Loading...</p>

  const statusCounts = STATUSES.map((status) => ({
    status,
    count: leads.filter((l) => l.status === status).length,
  }))

  const tripCounts = trips.map((trip) => ({
    trip,
    count: leads.filter((l) => l.trip_id === trip.id).length,
  }))

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1C1B1A] mb-6">Dashboard</h1>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[#1C1B1A]/10 p-5">
          <p className="text-xs text-[#1C1B1A]/40 mb-1">Total leads</p>
          <p className="text-3xl font-bold text-[#1C1B1A]">{leads.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#1C1B1A]/10 p-5">
          <p className="text-xs text-[#1C1B1A]/40 mb-1">Open trips</p>
          <p className="text-3xl font-bold text-[#1C1B1A]">{trips.filter((t) => t.status === 'open').length}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#1C1B1A]/10 p-5">
          <p className="text-xs text-[#1C1B1A]/40 mb-1">Confirmed</p>
          <p className="text-3xl font-bold text-[#D55D27]">{leads.filter((l) => l.status === 'CONFIRMED').length}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-[#1C1B1A]/10 p-6">
          <h2 className="text-sm font-semibold text-[#1C1B1A] mb-4">Leads by stage</h2>
          <div className="space-y-2">
            {statusCounts.map(({ status, count }) => (
              <div key={status} className="flex items-center justify-between text-sm">
                <span className="text-[#1C1B1A]/70">{status.replace(/_/g, ' ')}</span>
                <span className="font-medium text-[#1C1B1A]">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#1C1B1A]/10 p-6">
          <h2 className="text-sm font-semibold text-[#1C1B1A] mb-4">Leads per trip</h2>
          <div className="space-y-2">
            {tripCounts.map(({ trip, count }) => (
              <div key={trip.id} className="flex items-center justify-between text-sm">
                <span className="text-[#1C1B1A]/70">{trip.name}</span>
                <span className="font-medium text-[#1C1B1A]">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}