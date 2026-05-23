"use client"

import { useEffect, useState } from 'react'
import { handleOAuthCallback } from '@/lib/social-auth'

export default function OAuthCallback() {
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        handleOAuthCallback().catch((err: any) => {
            console.error('OAuth callback error:', err)
            setError(err?.message || 'Authentication failed. Please close this window and try again.')
        })
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#E8F4F8]">
            <div className="text-center max-w-md px-4">
                {error ? (
                    <>
                        <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <p className="text-red-700 font-semibold">Authentication Error</p>
                        <p className="text-red-600 text-sm mt-2">{error}</p>
                    </>
                ) : (
                    <>
                        <div className="animate-spin h-12 w-12 border-4 border-[#006795] border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-700 font-semibold">Completing authentication...</p>
                        <p className="text-gray-500 text-sm mt-2">This window will close automatically.</p>
                    </>
                )}
            </div>
        </div>
    )
}
