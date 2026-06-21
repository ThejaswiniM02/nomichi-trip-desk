import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/LogoutButton'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <nav className="border-b border-[#1C1B1A]/10 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="font-bold text-[#1C1B1A]">Trip Desk</span>
            <div className="flex gap-6 text-sm">
              <Link href="/admin/dashboard" className="text-[#1C1B1A]/70 hover:text-[#D55D27]">Dashboard</Link>
              <Link href="/admin/leads" className="text-[#1C1B1A]/70 hover:text-[#D55D27]">Leads</Link>
              <Link href="/admin/trips" className="text-[#1C1B1A]/70 hover:text-[#D55D27]">Trips</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#1C1B1A]/50">{user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}