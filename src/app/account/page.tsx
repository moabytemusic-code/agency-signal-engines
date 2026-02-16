
'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/browser'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

export default function AccountPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    // Form Fields
    const [fullName, setFullName] = useState('')
    const [company, setCompany] = useState('')
    const [platform, setPlatform] = useState('MIXED')
    const [email, setEmail] = useState('')

    const supabase = createClient()

    useEffect(() => {
        getProfile()
    }, [])

    async function getProfile() {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            window.location.href = '/login'
            return
        }

        setEmail(user.email || '')

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (data) {
            setFullName(data.display_name || '')
            setCompany(data.company_name || '')
            setPlatform(data.primary_platform || 'MIXED')
        }

        setLoading(false)
    }

    async function updateProfile(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        setMessage(null)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const updates = {
            user_id: user.id,
            display_name: fullName,
            company_name: company,
            primary_platform: platform,
            updated_at: new Date().toISOString(),
        }

        const { error } = await supabase.from('profiles').upsert(updates)

        if (error) {
            setMessage({ type: 'error', text: error.message })
        } else {
            setMessage({ type: 'success', text: 'Profile updated successfully!' })
        }
        setSaving(false)
    }

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading profile...</div>
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
            <div className="max-w-2xl mx-auto">
                <Link href="/dashboard" className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
                </Link>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Account Settings</h1>
                    <p className="text-gray-500 mb-8 text-sm">Update your profile details used in outbound messaging.</p>

                    <form onSubmit={updateProfile} className="space-y-6">

                        {/* Read Only Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                            <input
                                type="text"
                                value={email}
                                disabled
                                className="block w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-gray-900 sm:text-sm cursor-not-allowed"
                            />
                        </div>

                        {/* Full Name */}
                        <div>
                            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">Display Name (Sender Name)</label>
                            <input
                                id="fullname"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900"
                                placeholder="Ken Driskell"
                                required
                            />
                            <p className="mt-1 text-xs text-gray-400">Used as signature in outbound messages.</p>
                        </div>

                        {/* Company */}
                        <div>
                            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Agency / Company Name</label>
                            <input
                                id="company"
                                type="text"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900"
                                placeholder="Agency SignalEngines"
                                required
                            />
                        </div>

                        {/* Platform */}
                        <div>
                            <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">Primary Ad Platform</label>
                            <select
                                id="platform"
                                value={platform}
                                onChange={(e) => setPlatform(e.target.value)}
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900"
                            >
                                <option value="MIXED">Mixed / General</option>
                                <option value="META">Meta (Facebook/IG)</option>
                                <option value="GOOGLE">Google Ads / PPC</option>
                                <option value="TIKTOK">TikTok / UGC</option>
                            </select>
                            <p className="mt-1 text-xs text-gray-400">Used to tailor outbound messages when prospect niche is unclear.</p>
                        </div>

                        {message && (
                            <div className={`p-4 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}
