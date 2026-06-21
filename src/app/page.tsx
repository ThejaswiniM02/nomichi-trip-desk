import { createClient } from '@/lib/supabase/server'
import { Trip } from '@/types'
import TripCard from '@/components/public/TripCard'

export default async function PublicPage() {
  const supabase = await createClient()
  const { data: trips } = await supabase
    .from('trips')
    .select('*')
    .eq('status', 'open')
    .order('start_date', { ascending: true })

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <header className="border-b border-[#1C1B1A]/10">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-[#1C1B1A]">Nomichi</h1>
          <p className="text-[#1C1B1A]/60 mt-1">Travel that finds you.</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-xl font-semibold text-[#1C1B1A] mb-6">Open trips</h2>

        {(!trips || trips.length === 0) && (
          <p className="text-[#1C1B1A]/50">No trips are open right now. Check back soon.</p>
        )}

        <div className="grid sm:grid-cols-2 gap-6">
          {trips?.map((trip: Trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </main>
    </div>
  )
}