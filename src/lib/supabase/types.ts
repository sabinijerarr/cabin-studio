export type Role = 'owner' | 'employee' | 'renter'
export type UserStatus = 'active' | 'suspended'
export type ApplicationStatus = 'pending' | 'approved' | 'rejected'
export type BookingStatus = 'confirmed' | 'cancelled' | 'completed'
export type PaymentType = 'deposit' | 'subscription' | 'overage'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  role: Role
  status: UserStatus
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  created_at: string
}

export interface RenterApplication {
  id: string
  full_name: string
  email: string
  phone: string
  id_photo_url: string | null
  how_using: string | null
  social_links: string | null
  agreement_signed_at: string | null
  status: ApplicationStatus
  deposit_amount: number | null
  deposit_paid: boolean
  invited_user_id: string | null
  reviewed_at: string | null
  owner_notes: string | null
  created_at: string
}

export interface Booking {
  id: string
  user_id: string
  start_time: string
  end_time: string
  status: BookingStatus
  notes: string | null
  created_by: string | null
  created_at: string
  // joined
  profile?: Pick<Profile, 'full_name'>
}

export interface MonthlyUsage {
  id: string
  user_id: string
  month: string
  hours_used: number
}

export interface Payment {
  id: string
  user_id: string
  type: PaymentType
  amount_cents: number
  status: PaymentStatus
  stripe_payment_intent_id: string | null
  description: string | null
  created_at: string
  // joined
  profile?: Pick<Profile, 'full_name'>
}

// Supabase Database type (minimal — expand as needed)
export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> }
      renter_applications: { Row: RenterApplication; Insert: Partial<RenterApplication>; Update: Partial<RenterApplication> }
      bookings: { Row: Booking; Insert: Partial<Booking>; Update: Partial<Booking> }
      monthly_usage: { Row: MonthlyUsage; Insert: Partial<MonthlyUsage>; Update: Partial<MonthlyUsage> }
      payments: { Row: Payment; Insert: Partial<Payment>; Update: Partial<Payment> }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
