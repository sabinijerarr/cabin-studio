import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import type { Profile, Payment } from '@/lib/supabase/types'

export const metadata = { title: 'Payments | Cabin Studio Portal' }

export default async function PaymentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single<Pick<Profile, 'role'>>()
  if (!profile || profile.role === 'renter') redirect('/portal')

  const { data: payments } = await supabase
    .from('payments')
    .select('*, profile:profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(100)
    .returns<Payment[]>()

  const statusStyle: Record<string, string> = {
    paid: 'text-green-400 border-green-400/30',
    pending: 'text-yellow-400 border-yellow-400/30',
    failed: 'text-red-400 border-red-400/30',
    refunded: 'text-[#C4B99A]/50 border-[#C4B99A]/20',
  }

  const typeLabel: Record<string, string> = {
    deposit: 'Deposit',
    subscription: 'Monthly',
    overage: 'Overage',
  }

  const totalPaid = payments?.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount_cents, 0) ?? 0

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-cinzel text-2xl text-[#D4A853] tracking-wide mb-1">Payments</h1>
      <p className="font-cormorant text-[#C4B99A]/50 italic mb-6">All studio payment records</p>

      <div className="bg-[#2C2518] border border-[#3A3020] p-5 mb-8 flex gap-8">
        <div>
          <p className="font-cinzel text-[9px] tracking-[0.2em] text-[#C4B99A]/40 uppercase mb-1">Total Collected</p>
          <p className="font-cinzel text-2xl text-[#D4A853]">${(totalPaid / 100).toLocaleString()}</p>
        </div>
        <div>
          <p className="font-cinzel text-[9px] tracking-[0.2em] text-[#C4B99A]/40 uppercase mb-1">Records</p>
          <p className="font-cinzel text-2xl text-[#C4B99A]">{payments?.length ?? 0}</p>
        </div>
      </div>

      <div className="space-y-2">
        {!payments?.length && (
          <p className="font-cormorant text-[#C4B99A]/40 italic">No payment records yet.</p>
        )}
        {payments?.map(p => (
          <div key={p.id} className="flex items-center justify-between bg-[#2C2518] border border-[#3A3020] px-5 py-4">
            <div>
              <p className="font-cormorant text-[#C4B99A] text-base">
                {p.profile?.full_name ?? 'Unknown'}
                <span className="text-[#C4B99A]/40 text-sm ml-2">{p.description ?? typeLabel[p.type]}</span>
              </p>
              <p className="font-cormorant text-xs text-[#C4B99A]/40">{format(new Date(p.created_at), 'MMM d, yyyy h:mm a')}</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-cinzel text-[#D4A853]">${(p.amount_cents / 100).toFixed(2)}</p>
              <span className={`font-cinzel text-[9px] tracking-[0.15em] uppercase border px-2 py-1 ${statusStyle[p.status]}`}>
                {p.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
