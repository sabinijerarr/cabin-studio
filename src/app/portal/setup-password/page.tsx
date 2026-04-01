'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SetupPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Supabase sends the user here with a hash fragment containing the access token
    // The SSR client handles this automatically on page load
    setReady(true)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/portal')
    router.refresh()
  }

  if (!ready) return null

  return (
    <div className="min-h-screen bg-[#1A1610] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="font-cinzel text-2xl font-semibold text-[#D4A853] tracking-[0.2em]">CABIN STUDIO</p>
          <p className="font-cormorant text-[#C4B99A] text-lg mt-2">Set your password</p>
          <p className="font-cormorant text-[#C4B99A]/50 text-sm mt-1 italic">You&apos;ve been approved — create a password to access your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-cinzel text-[10px] tracking-[0.2em] text-[#C4B99A]/60 uppercase mb-2">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-[#2C2518] border border-[#4A3F2F] text-[#C4B99A] font-cormorant text-base px-4 py-3 focus:outline-none focus:border-[#D4A853] transition-colors"
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label className="block font-cinzel text-[10px] tracking-[0.2em] text-[#C4B99A]/60 uppercase mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              className="w-full bg-[#2C2518] border border-[#4A3F2F] text-[#C4B99A] font-cormorant text-base px-4 py-3 focus:outline-none focus:border-[#D4A853] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="font-cormorant text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D4A853] text-[#1A1610] font-cinzel text-sm tracking-[0.2em] uppercase py-4 hover:bg-[#E8C070] transition-colors disabled:opacity-50"
          >
            {loading ? 'Setting password…' : 'Activate My Account'}
          </button>
        </form>
      </div>
    </div>
  )
}
