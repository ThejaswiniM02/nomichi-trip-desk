'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/admin/leads')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFBF5] px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-[#1C1B1A] mb-1">Trip Desk</h1>
        <p className="text-sm text-[#1C1B1A]/60 mb-8">Sign in to the team admin.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm text-[#1C1B1A]/70 block mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#1C1B1A]/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D55D27]"
            />
          </div>
          <div>
            <label className="text-sm text-[#1C1B1A]/70 block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#1C1B1A]/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D55D27]"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D55D27] text-white rounded-lg py-2 text-sm font-medium hover:bg-[#D55D27]/90 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}