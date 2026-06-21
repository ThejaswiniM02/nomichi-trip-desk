'use client'

import { Trip } from '@/types'
import { useState } from 'react'
import EnquiryModal from './EnquiryModal'

export default function TripCard({ trip }: { trip: Trip }) {
  const [open, setOpen] = useState(false)

  const dateRange = `${new Date(trip.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – ${new Date(trip.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`

  return (
    <>
      <div className="border border-[#1C1B1A]/10 rounded-xl p-5 bg-white flex flex-col">
        <h3 className="font-semibold text-[#1C1B1A] text-lg">{trip.name}</h3>
        <p className="text-sm text-[#1C1B1A]/50 mt-0.5">{trip.destination}</p>
        <p className="text-sm text-[#1C1B1A]/70 mt-3 flex-1">{trip.description}</p>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#1C1B1A]/10">
          <div>
            <p className="text-xs text-[#1C1B1A]/40">{dateRange}</p>
            <p className="font-semibold text-[#D55D27]">₹{trip.price_with_gst.toLocaleString('en-IN')} <span className="text-xs font-normal text-[#1C1B1A]/40">incl. GST</span></p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="bg-[#1C1B1A] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#D55D27] transition-colors"
          >
            Enquire
          </button>
        </div>
      </div>

      {open && <EnquiryModal trip={trip} onClose={() => setOpen(false)} />}
    </>
  )
}