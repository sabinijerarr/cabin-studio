import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import type { Profile, RenterApplication } from '@/lib/supabase/types'

export const metadata = { title: 'Members | Cabin Studio Portal' }

export default async function RentersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single<Pick<Profile, 'role'>>()
  if (profile?.role !== 'owner') redirect('/portal')

  const { data: applications } = await supabase
    .from('renter_applications')
    .select('*')
    .order('created_at', { ascending: false })
    .returns<RenterApplication[]>()

  const pending = applications?.filter(a => a.status === 'pending') ?? []
  const approved = applications?.filter(a => a.status === 'approved') ?? []
  const rejected = applications?.filter(a => a.status === 'rejected') ?? []

  const statusColor: Record<string, string> = {
    pending: 'text-yellow-400 border-yellow-400/30',
    approved: 'text-green-400 border-green-400/30',
    rejected: 'text-red-400 border-red-400/30',
  }

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="font-cinzel text-2xl text-[#D4A853] tracking-wide mb-1">Monthly Members</h1>
      <p className="font-cormorant text-[#C4B99A]/50 italic mb-8">Review applications and manage active renters</p>

      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="font-cinzel text-[11px] tracking-[0.2em] text-yellow-400/80 uppercase mb-3">Pending Review ({pending.length})</h2>
          <div className="space-y-2">
            {pending.map(a => <ApplicationRow key={a.id} app={a} statusColor={statusColor} />)}
          </div>
        </div>
      )}

      {approved.length > 0 && (
        <div className="mb-8">
          <h2 className="font-cinzel text-[11px] tracking-[0.2em] text-green-400/80 uppercase mb-3">Active Members ({approved.length})</h2>
          <div className="space-y-2">
            {approved.map(a => <ApplicationRow key={a.id} app={a} statusColor={statusColor} />)}
          </div>
        </div>
      )}

      {rejected.length > 0 && (
        <div>
          <h2 className="font-cinzel text-[11px] tracking-[0.2em] text-[#C4B99A]/30 uppercase mb-3">Rejected ({rejected.length})</h2>
          <div className="space-y-2">
            {rejected.map(a => <ApplicationRow key={a.id} app={a} statusColor={statusColor} />)}
          </div>
        </div>
      )}

      {!applications?.length && (
        <p className="font-cormorant text-[#C4B99A]/40 italic">No applications yet. Share your apply link: <span className="text-[#D4A853]">cabinstudio.com/apply</span></p>
      )}
    </div>
  )
}

function ApplicationRow({ app, statusColor }: { app: RenterApplication; statusColor: Record<string, string> }) {
  return (
    <a
      href={`/portal/admin/renters/${app.id}`}
      className="flex items-center justify-between bg-[#2C2518] border border-[#3A3020] px-5 py-4 hover:border-[#D4A853]/40 transition-colors"
    >
      <div>
        <p className="font-cormorant text-[#C4B99A] text-base">{app.full_name}</p>
        <p className="font-cormorant text-xs text-[#C4B99A]/40">{app.email} · {format(new Date(app.created_at), 'MMM d, yyyy')}</p>
      </div>
      <div className="flex items-center gap-4">
        {app.status === 'approved' && (
          <span className="font-cormorant text-xs text-[#C4B99A]/50">
            Deposit: {app.deposit_paid ? '✓ paid' : app.deposit_amount ? `$${(app.deposit_amount / 100).toLocaleString()} due` : 'not set'}
          </span>
        )}
        <span className={`font-cinzel text-[9px] tracking-[0.15em] uppercase border px-2 py-1 ${statusColor[app.status]}`}>
          {app.status}
        </span>
      </div>
    </a>
  )
}
