export type TripStatus = 'open' | 'closed'
export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'VIBE_CHECK_SENT' | 'CONFIRMED' | 'NOT_A_FIT'
export type GroupType = 'solo' | 'friends' | 'couple' | 'family'

export interface Trip {
  id: string
  name: string
  destination: string
  start_date: string
  end_date: string
  price_with_gst: number
  total_seats: number
  status: TripStatus
  description: string
  created_at: string
}

export interface Lead {
  id: string
  name: string
  phone: string
  email: string
  trip_id: string
  trip?: Trip
  group_type: GroupType
  preferred_month: string
  vibe: string
  status: LeadStatus
  owner_id: string | null
  owner?: { email: string }
  created_at: string
}

export interface CallLog {
  id: string
  lead_id: string
  note: string
  next_action: string
  created_by: string
  created_at: string
}