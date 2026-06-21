'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Trip } from '@/types'
import { Plus } from 'lucide-react'

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrips()
  }, [])

  async function fetchTrips() {
    const supabase = createClient()
    const { data } = await supabase
      .from('trips')
      .select('*')
      .order('start_date', { ascending: true })

    setTrips(data || [])
    setLoading(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1C1B1A]">Trips</h1>
        <Link
          href="/admin/trips/new"
          className="inline-flex items-center gap-1.5 bg-[#D55D27] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#D55D27]/90"
        >
          <Plus size={16} /> New trip
        </Link>
      </div>

      {loading && <p className="text-[#1C1B1A]/50 text-sm">Loading trips...</p>}

      {!loading && trips.length === 0 && (
        <p className="text-[#1C1B1A]/50 text-sm">No trips yet. Create your first one.</p>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {trips.map((trip) => (
          <Link
            key={trip.id}
            href={`/admin/trips/${trip.id}`}
            className="bg-white rounded-xl border border-[#1C1B1A]/10 p-5 hover:border-[#D55D27]/40 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-[#1C1B1A]">{trip.name}</h3>
                <p className="text-sm text-[#1C1B1A]/50">{trip.destination}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                trip.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-[#1C1B1A]/10 text-[#1C1B1A]/50'
              }`}>
                {trip.status}
              </span>
            </div>
            <p className="text-sm text-[#1C1B1A]/70 mt-3">
              ₹{trip.price_with_gst.toLocaleString('en-IN')} · {trip.total_seats} seats
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}