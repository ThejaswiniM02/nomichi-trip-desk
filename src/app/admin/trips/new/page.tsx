'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewTripPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    destination: '',
    start_date: '',
    end_date: '',
    price_with_gst: '',
    total_seats: '',
    status: 'open',
    description: '',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!form.name || !form.destination || !form.start_date || !form.end_date || !form.price_with_gst || !form.total_seats) {
      setError('Please fill in all required fields.')
      return
    }

    setSaving(true)
    setError('')

    const supabase = createClient()
    const { error: insertError } = await supabase.from('trips').insert({
      name: form.name,
      destination: form.destination,
      start_date: form.start_date,
      end_date: form.end_date,
      price_with_gst: parseFloat(form.price_with_gst),
      total_seats: parseInt(form.total_seats),
      status: form.status,
      description: form.description,
    })

    if (insertError) {
      setError(insertError.message)
      setSaving(false)
      return
    }

    router.push('/admin/trips')
    router.refresh()
  }

  return (
    <div className="max-w-xl">
      <Link href="/admin/trips" className="inline-flex items-center gap-1 text-sm text-[#1C1B1A]/50 hover:text-[#D55D27] mb-6">
        <ArrowLeft size={14} /> Back to trips
      </Link>

      <h1 className="text-xl font-bold text-[#1C1B1A] mb-6">New trip</h1>

      <div className="bg-white rounded-xl border border-[#1C1B1A]/10 p-6 space-y-4">
        <div>
          <label className="text-xs text-[#1C1B1A]/50 block mb-1">Trip name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-[#1C1B1A]/15 rounded-lg px-3 py-2 text-sm text-[#1C1B1A] focus:outline-none focus:border-[#D55D27]"
          />
        </div>

        <div>
          <label className="text-xs text-[#1C1B1A]/50 block mb-1">Destination</label>
          <input
            value={form.destination}
            onChange={(e) => setForm({ ...form, destination: e.target.value })}
            className="w-full border border-[#1C1B1A]/15 rounded-lg px-3 py-2 text-sm text-[#1C1B1A] focus:outline-none focus:border-[#D55D27]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-[#1C1B1A]/50 block mb-1">Start date</label>
            <input
              type="date"
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              className="w-full border border-[#1C1B1A]/15 rounded-lg px-3 py-2 text-sm text-[#1C1B1A] focus:outline-none focus:border-[#D55D27]"
            />
          </div>
          <div>
            <label className="text-xs text-[#1C1B1A]/50 block mb-1">End date</label>
            <input
              type="date"
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              className="w-full border border-[#1C1B1A]/15 rounded-lg px-3 py-2 text-sm text-[#1C1B1A] focus:outline-none focus:border-[#D55D27]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-[#1C1B1A]/50 block mb-1">Price (incl. GST)</label>
            <input
              type="number"
              value={form.price_with_gst}
              onChange={(e) => setForm({ ...form, price_with_gst: e.target.value })}
              className="w-full border border-[#1C1B1A]/15 rounded-lg px-3 py-2 text-sm text-[#1C1B1A] focus:outline-none focus:border-[#D55D27]"
            />
          </div>
          <div>
            <label className="text-xs text-[#1C1B1A]/50 block mb-1">Total seats</label>
            <input
              type="number"
              value={form.total_seats}
              onChange={(e) => setForm({ ...form, total_seats: e.target.value })}
              className="w-full border border-[#1C1B1A]/15 rounded-lg px-3 py-2 text-sm text-[#1C1B1A] focus:outline-none focus:border-[#D55D27]"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-[#1C1B1A]/50 block mb-1">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full border border-[#1C1B1A]/15 rounded-lg px-3 py-2 text-sm text-[#1C1B1A] focus:outline-none focus:border-[#D55D27]"
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-[#1C1B1A]/50 block mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full border border-[#1C1B1A]/15 rounded-lg px-3 py-2 text-sm text-[#1C1B1A] focus:outline-none focus:border-[#D55D27] resize-none"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#1C1B1A] text-white text-sm px-5 py-2.5 rounded-lg hover:bg-[#D55D27] disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : 'Create trip'}
        </button>
      </div>
    </div>
  )
}