'use client'

import { useState } from 'react'
import { Trip, GroupType } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { X } from 'lucide-react'

export default function EnquiryModal({ trip, onClose }: { trip: Trip; onClose: () => void }) {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', group_type: 'solo' as GroupType,
    preferred_month: '', vibe: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  function validate() {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Name is required.'
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit phone number.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email.'
    if (!form.preferred_month.trim()) e.preferred_month = 'Let us know a preferred month.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setStatus('submitting')
    const supabase = createClient()
    const { error } = await supabase.from('leads').insert({
      ...form,
      trip_id: trip.id,
    })

    if (error) {
      setStatus('error')
      return
    }
    setStatus('success')
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#1C1B1A]">Enquire about {trip.name}</h3>
          <button onClick={onClose}><X size={18} className="text-[#1C1B1A]/40" /></button>
        </div>

        {status === 'success' ? (
          <div className="py-8 text-center">
            <p className="text-[#1C1B1A] font-medium">Got it, {form.name.split(' ')[0]}.</p>
            <p className="text-sm text-[#1C1B1A]/60 mt-2">Someone from our team will reach out within a day. No spam, no chasing, just a real conversation.</p>
            <button onClick={onClose} className="mt-6 text-sm text-[#D55D27] font-medium">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-[#1C1B1A]/15 rounded-lg px-3 py-2 text-sm text-[#1C1B1A] focus:outline-none focus:border-[#D55D27]"
              />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <input
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-[#1C1B1A]/15 rounded-lg px-3 py-2 text-sm text-[#1C1B1A] focus:outline-none focus:border-[#D55D27]"
              />
              {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-[#1C1B1A]/15 rounded-lg px-3 py-2 text-sm text-[#1C1B1A] focus:outline-none focus:border-[#D55D27]"
              />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-xs text-[#1C1B1A]/50 block mb-1">Who's coming</label>
              <select
                value={form.group_type}
                onChange={(e) => setForm({ ...form, group_type: e.target.value as GroupType })}
                className="w-full border border-[#1C1B1A]/15 rounded-lg px-3 py-2 text-sm text-[#1C1B1A] focus:outline-none focus:border-[#D55D27]"
              >
                <option value="solo">Solo</option>
                <option value="friends">Friends</option>
                <option value="couple">Couple</option>
                <option value="family">Family</option>
              </select>
            </div>

            <div>
              <input
                placeholder="Preferred month"
                value={form.preferred_month}
                onChange={(e) => setForm({ ...form, preferred_month: e.target.value })}
                className="w-full border border-[#1C1B1A]/15 rounded-lg px-3 py-2 text-sm text-[#1C1B1A] focus:outline-none focus:border-[#D55D27]"
              />
              {errors.preferred_month && <p className="text-xs text-red-600 mt-1">{errors.preferred_month}</p>}
            </div>

            <div>
              <textarea
                placeholder="What are you hoping this trip feels like?"
                value={form.vibe}
                onChange={(e) => setForm({ ...form, vibe: e.target.value })}
                rows={3}
               className="w-full border border-[#1C1B1A]/15 rounded-lg px-3 py-2 text-sm text-[#1C1B1A] focus:outline-none focus:border-[#D55D27]"
              />
            </div>

            {status === 'error' && <p className="text-sm text-red-600">Something went wrong. Try again.</p>}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full bg-[#D55D27] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#D55D27]/90 disabled:opacity-50"
            >
              {status === 'submitting' ? 'Sending...' : 'Send enquiry'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}