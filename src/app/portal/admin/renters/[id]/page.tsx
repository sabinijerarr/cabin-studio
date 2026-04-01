'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import type { RenterApplication } from '@/lib/supabase/types'

export default function RenterDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [app, setApp] = useState<RenterApplication | null>(null)
  const [depositAmount, setDepositAmount] = useState('')
  const [ownerNotes, setOwnerNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState('')
  const [idPhotoUrl, setIdPhotoUrl] = useState<string | null>(null)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('renter_applications')
        .select('*')
        .eq('id', id)
        .single<RenterApplication>()
      if (data) {
        setApp(data)
        setOwnerNotes(data.owner_notes ?? '')
        if (data.deposit_amount) setDepositAmount(String(data.deposit_amount / 100))
        // Get signed URL for ID photo
        if (data.id_photo_url) {
          const { data: url } = await supabase.storage
            .from('id-photos')
            .createSignedUrl(data.id_photo_url, 3600)
          setIdPhotoUrl(url?.signedUrl ?? null)
        }
      }
    }
    load()
  }, [id])

  async function updateNotes() {
    setLoading(true)
    const supabase = createClient()
    await supabase.from('renter_applications').update({ owner_notes: ownerNotes }).eq('id', id)
    setMsg('Notes saved.')
    setLoading(false)
  }

  async function handleApprove() {
    const cents = Math.round(parseFloat(depositAmount) * 100)
    if (!depositAmount || isNaN(cents) || cents <= 0) {
      setMsg('Set a deposit amount before approving.')
      return
    }
    setActionLoading('approve')
    try {
      const res = await fetch('/api/portal/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: id,
          email: app!.email,
          fullName: app!.full_name,
          depositAmountCents: cents,
          ownerNotes,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setMsg('Approved! Invite email sent.')
      setApp(prev => prev ? { ...prev, status: 'approved', deposit_amount: cents } : prev)
    } catch (err: unknown) {
      setMsg(err instanceof Error ? err.message : 'Error approving.')
    } finally {
      setActionLoading('')
    }
  }

  async function handleReject() {
    setActionLoading('reject')
    const supabase = createClient()
    await supabase.from('renter_applications').update({
      status: 'rejected',
      reviewed_at: new Date().toISOString(),
      owner_notes: ownerNotes,
    }).eq('id', id)
    setMsg('Application rejected.')
    setApp(prev => prev ? { ...prev, status: 'rejected' } : prev)
    setActionLoading('')
  }

  if (!app) return <div className="p-8 font-cormorant text-[#C4B99A]/50">Loading…</div>

  const statusColor = { pending: 'text-yellow-400', approved: 'text-green-400', rejected: 'text-red-400' }

  return (
    <div className="p-8 max-w-2xl">
      <a href="/portal/admin/renters" className="font-cinzel text-[#D4A853]/60 text-[10px] tracking-[0.2em] uppercase hover:text-[#D4A853]">← Members</a>

      <div className="flex items-start justify-between mt-4 mb-8">
        <div>
          <h1 className="font-cinzel text-2xl text-[#D4A853] tracking-wide">{app.full_name}</h1>
          <p className="font-cormorant text-[#C4B99A]/50 italic mt-0.5">Applied {format(new Date(app.created_at), 'MMMM d, yyyy')}</p>
        </div>
        <span className={`font-cinzel text-[10px] tracking-[0.15em] uppercase ${statusColor[app.status]}`}>{app.status}</span>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          ['Email', app.email],
          ['Phone', app.phone],
          ['Social', app.social_links || '—'],
          ['Agreement signed', app.agreement_signed_at ? format(new Date(app.agreement_signed_at), 'MMM d, yyyy h:mm a') : 'No'],
        ].map(([label, value]) => (
          <div key={label} className="bg-[#2C2518] border border-[#3A3020] p-4">
            <p className="font-cinzel text-[9px] tracking-[0.15em] text-[#C4B99A]/40 uppercase mb-1">{label}</p>
            <p className="font-cormorant text-[#C4B99A] text-sm">{value}</p>
          </div>
        ))}
      </div>

      {/* How using */}
      <div className="bg-[#2C2518] border border-[#3A3020] p-4 mb-4">
        <p className="font-cinzel text-[9px] tracking-[0.15em] text-[#C4B99A]/40 uppercase mb-2">How they plan to use the studio</p>
        <p className="font-cormorant text-[#C4B99A] text-sm leading-relaxed">{app.how_using || '—'}</p>
      </div>

      {/* ID Photo */}
      {idPhotoUrl && (
        <div className="mb-6">
          <p className="font-cinzel text-[9px] tracking-[0.15em] text-[#C4B99A]/40 uppercase mb-2">Photo ID</p>
          <a href={idPhotoUrl} target="_blank" rel="noreferrer" className="inline-block">
            <img src={idPhotoUrl} alt="ID" className="max-h-48 border border-[#3A3020] object-contain" />
          </a>
        </div>
      )}

      {/* Owner notes */}
      <div className="mb-6">
        <label className="block font-cinzel text-[9px] tracking-[0.15em] text-[#C4B99A]/40 uppercase mb-2">Your Notes</label>
        <textarea
          value={ownerNotes}
          onChange={e => setOwnerNotes(e.target.value)}
          rows={3}
          className="w-full bg-[#2C2518] border border-[#4A3F2F] text-[#C4B99A] font-cormorant text-sm px-4 py-3 focus:outline-none focus:border-[#D4A853] resize-none transition-colors"
          placeholder="Internal notes about this applicant…"
        />
        <button onClick={updateNotes} disabled={loading}
          className="mt-2 font-cinzel text-[10px] tracking-[0.15em] uppercase text-[#C4B99A]/50 hover:text-[#C4B99A] transition-colors">
          {loading ? 'Saving…' : 'Save notes'}
        </button>
      </div>

      {/* Deposit amount */}
      {app.status === 'pending' && (
        <div className="mb-6">
          <label className="block font-cinzel text-[9px] tracking-[0.15em] text-[#C4B99A]/40 uppercase mb-2">Deposit Amount (USD)</label>
          <div className="flex gap-2">
            <span className="flex items-center px-3 bg-[#2C2518] border border-[#4A3F2F] text-[#C4B99A]/50 font-cormorant">$</span>
            <input
              type="number"
              value={depositAmount}
              onChange={e => setDepositAmount(e.target.value)}
              placeholder="e.g. 500"
              min="0"
              className="flex-1 bg-[#2C2518] border border-[#4A3F2F] text-[#C4B99A] font-cormorant text-base px-4 py-3 focus:outline-none focus:border-[#D4A853] transition-colors"
            />
          </div>
          <p className="font-cormorant text-xs text-[#C4B99A]/30 mt-1">Required before approving. Renter pays this before gaining access.</p>
        </div>
      )}

      {msg && <p className="font-cormorant text-[#D4A853] text-sm mb-4">{msg}</p>}

      {/* Actions */}
      {app.status === 'pending' && (
        <div className="flex gap-3">
          <button
            onClick={handleApprove}
            disabled={actionLoading === 'approve'}
            className="flex-1 bg-[#D4A853] text-[#1A1610] font-cinzel text-[11px] tracking-[0.2em] uppercase py-3 hover:bg-[#E8C070] transition-colors disabled:opacity-50"
          >
            {actionLoading === 'approve' ? 'Approving…' : 'Approve & Send Invite'}
          </button>
          <button
            onClick={handleReject}
            disabled={actionLoading === 'reject'}
            className="px-6 border border-red-400/40 text-red-400 font-cinzel text-[11px] tracking-[0.2em] uppercase py-3 hover:bg-red-400/10 transition-colors disabled:opacity-50"
          >
            {actionLoading === 'reject' ? '…' : 'Reject'}
          </button>
        </div>
      )}

      {app.status === 'approved' && (
        <div className="bg-green-400/10 border border-green-400/20 px-4 py-3">
          <p className="font-cormorant text-green-400 text-sm">
            Approved — deposit {app.deposit_paid ? 'paid ✓' : `of $${((app.deposit_amount ?? 0) / 100).toLocaleString()} pending`}
          </p>
        </div>
      )}
    </div>
  )
}
