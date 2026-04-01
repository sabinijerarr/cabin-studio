'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/portal'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push(redirect)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#1A1610] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <p className="font-cinzel text-2xl font-semibold text-[#D4A853] tracking-[0.2em]">CABIN STUDIO</p>
          <p className="font-cormorant text-[#C4B99A]/60 text-sm mt-1 italic tracking-wide">Member Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-cinzel text-[10px] tracking-[0.2em] text-[#C4B99A]/60 uppercase mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-[#2C2518] border border-[#4A3F2F] text-[#C4B99A] font-cormorant text-base px-4 py-3 focus:outline-none focus:border-[#D4A853] transition-colors"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block font-cinzel text-[10px] tracking-[0.2em] text-[#C4B99A]/60 uppercase mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
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
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-8 font-cormorant text-[#C4B99A]/40 text-sm">
          Not a member?{' '}
          <a href="/apply" className="text-[#D4A853] hover:underline">
            Apply for monthly access
          </a>
        </p>
      </div>
    </div>
  )
}
