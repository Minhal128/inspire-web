import { Clerk } from '@clerk/clerk-js'

const OAUTH_REDIRECT_URI = 'https://nspire-five.vercel.app/oauth-callback'
const CLERK_PUBLISHABLE_KEY = 'pk_test_bGlnaHQtbXV0dC03Mi5jbGVyay5hY2NvdW50cy5kZXYk'

let clerkInstance: Clerk | null = null

const getClerk = async () => {
    if (clerkInstance) return clerkInstance
    clerkInstance = new Clerk(CLERK_PUBLISHABLE_KEY)
    await clerkInstance.load()
    return clerkInstance
}

export interface OAuthResult {
    email: string
    fullName: string
    provider: 'google' | 'facebook' | 'apple'
}

/**
 * Initialize Google OAuth login
 * Opens a popup window for Google authentication
 */
export const initGoogleLogin = (portal: string): Promise<OAuthResult> => {
    return new Promise((resolve, reject) => {
        const clientId = '164266308190-dp79tjoggk3qch05qjjcooc5d9rn2s5s.apps.googleusercontent.com'

        if (!clientId) {
            reject(new Error('Google OAuth is not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your environment variables.'))
            return
        }

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${clientId}&` +
            `redirect_uri=${encodeURIComponent(OAUTH_REDIRECT_URI)}&` +
            `response_type=token&` +
            `scope=openid email profile&` +
            `state=google_${portal}`

        const width = 500
        const height = 600
        const left = window.screenX + (window.outerWidth - width) / 2
        const top = window.screenY + (window.outerHeight - height) / 2

        const popup = window.open(
            authUrl,
            'Google Sign In',
            `width=${width},height=${height},left=${left},top=${top}`
        )

        if (!popup) {
            reject(new Error('Popup blocked. Please allow popups for this site.'))
            return
        }

        // Listen for OAuth callback
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return

            if (event.data.type === 'oauth-success' && event.data.provider === 'google') {
                window.removeEventListener('message', handleMessage)
                resolve({
                    email: event.data.email,
                    fullName: event.data.fullName,
                    provider: 'google'
                })
            } else if (event.data.type === 'oauth-error') {
                window.removeEventListener('message', handleMessage)
                reject(new Error(event.data.error || 'OAuth authentication failed'))
            }
        }

        window.addEventListener('message', handleMessage)

        // Check if popup was closed (try/catch: COOP policy can block window.closed)
        const checkClosed = setInterval(() => {
            try {
                if (popup.closed) {
                    clearInterval(checkClosed)
                    window.removeEventListener('message', handleMessage)
                    reject(new Error('Authentication cancelled'))
                }
            } catch (e) { /* COOP policy blocked access – rely on message listener */ }
        }, 1000)
    })
}

/**
 * Initialize Facebook OAuth login
 * Opens a popup window for Facebook authentication
 */
export const initFacebookLogin = (portal: string): Promise<OAuthResult> => {
    return new Promise(async (resolve, reject) => {
        try {
            const clerk = await getClerk()
            if (!clerk.client) throw new Error('Clerk client failed to load')

            // If user is already signed in to Clerk, resolve immediately
            if (clerk.user) {
                console.log('User already signed in to Clerk, using existing session')
                resolve({
                    email: clerk.user.primaryEmailAddress?.emailAddress || '',
                    fullName: clerk.user.fullName || clerk.user.firstName || '',
                    provider: 'facebook'
                })
                return
            }

            // Create a sign-in attempt to get the correct OAuth redirection URL
            const signIn = await clerk.client.signIn.create({
                strategy: 'oauth_facebook',
                redirectUrl: OAUTH_REDIRECT_URI + '?state=facebook_' + portal,
            })

            const authUrl = signIn.firstFactorVerification.externalVerificationRedirectURL
            if (!authUrl) throw new Error('Failed to get OAuth redirection URL')

            const width = 500
            const height = 600
            const left = window.screenX + (window.outerWidth - width) / 2
            const top = window.screenY + (window.outerHeight - height) / 2

            const popup = window.open(
                authUrl,
                'Facebook Sign In',
                `width=${width},height=${height},left=${left},top=${top}`
            )

            if (!popup) {
                reject(new Error('Popup blocked. Please allow popups for this site.'))
                return
            }

            const handleMessage = (event: MessageEvent) => {
                if (event.origin !== window.location.origin) return

                if (event.data.type === 'oauth-success' && event.data.provider === 'facebook') {
                    window.removeEventListener('message', handleMessage)
                    resolve({
                        email: event.data.email,
                        fullName: event.data.fullName,
                        provider: 'facebook'
                    })
                } else if (event.data.type === 'oauth-error') {
                    window.removeEventListener('message', handleMessage)
                    reject(new Error(event.data.error || 'OAuth authentication failed'))
                }
            }

            window.addEventListener('message', handleMessage)

            const checkClosed = setInterval(() => {
                try {
                    if (popup.closed) {
                        clearInterval(checkClosed)
                        window.removeEventListener('message', handleMessage)
                        reject(new Error('Authentication cancelled'))
                    }
                } catch (e) { /* COOP policy blocked access – rely on message listener */ }
            }, 1000)
        } catch (error: any) {
            if (error.message?.toLowerCase().includes('already signed in')) {
                const clerk = await getClerk()
                if (clerk.user) {
                    resolve({
                        email: clerk.user.primaryEmailAddress?.emailAddress || '',
                        fullName: clerk.user.fullName || clerk.user.firstName || '',
                        provider: 'facebook'
                    })
                    return
                }
            }
            reject(new Error('Failed to initialize Facebook login: ' + error.message))
        }
    })
}

/**
 * Initialize Apple OAuth login
 * Opens a popup window for Apple authentication
 */
export const initAppleLogin = (portal: string): Promise<OAuthResult> => {
    return new Promise((resolve, reject) => {
        const clientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID

        if (!clientId) {
            reject(new Error('Apple OAuth is not configured. Please set NEXT_PUBLIC_APPLE_CLIENT_ID in your environment variables.'))
            return
        }

        const authUrl = `https://appleid.apple.com/auth/authorize?` +
            `client_id=${clientId}&` +
            `redirect_uri=${encodeURIComponent(OAUTH_REDIRECT_URI)}&` +
            `response_type=code id_token&` +
            `scope=name email&` +
            `response_mode=form_post&` +
            `state=apple_${portal}`

        const width = 500
        const height = 600
        const left = window.screenX + (window.outerWidth - width) / 2
        const top = window.screenY + (window.outerHeight - height) / 2

        const popup = window.open(
            authUrl,
            'Apple Sign In',
            `width=${width},height=${height},left=${left},top=${top}`
        )

        if (!popup) {
            reject(new Error('Popup blocked. Please allow popups for this site.'))
            return
        }

        // Listen for OAuth callback
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return

            if (event.data.type === 'oauth-success' && event.data.provider === 'apple') {
                window.removeEventListener('message', handleMessage)
                resolve({
                    email: event.data.email,
                    fullName: event.data.fullName,
                    provider: 'apple'
                })
            } else if (event.data.type === 'oauth-error') {
                window.removeEventListener('message', handleMessage)
                reject(new Error(event.data.error || 'OAuth authentication failed'))
            }
        }

        window.addEventListener('message', handleMessage)

        // Check if popup was closed (try/catch: COOP policy can block window.closed)
        const checkClosed = setInterval(() => {
            try {
                if (popup.closed) {
                    clearInterval(checkClosed)
                    window.removeEventListener('message', handleMessage)
                    reject(new Error('Authentication cancelled'))
                }
            } catch (e) { /* COOP policy blocked access – rely on message listener */ }
        }, 1000)
    })
}

/**
 * Handle OAuth callback and send result back to parent window
 * This should be called from the OAuth callback page
 */
export const handleOAuthCallback = async () => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.hash.substring(1))
    const searchParams = new URLSearchParams(window.location.search)

    const state = searchParams.get('state') || params.get('state') || ''
    const accessToken = params.get('access_token')
    const code = searchParams.get('code')

    if (!state) {
        window.opener?.postMessage({ type: 'oauth-error', error: 'Invalid state parameter' }, window.location.origin)
        window.close()
        return
    }

    const [provider, portal] = state.split('_')

    try {
        let email = ''
        let fullName = ''

        if (provider === 'google' && accessToken) {
            // Fetch user info from Google
            const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            const data = await response.json()
            email = data.email || ''
            fullName = data.name || (email.includes('@') ? email.split('@')[0] : email)
        } else if (provider === 'facebook') {
            console.log('Processing Facebook callback...')
            // For Clerk-bridged Facebook, user data is available in the Clerk session
            const clerk = await getClerk()

            try {
                console.log('Calling handleRedirectCallback...')
                await clerk.handleRedirectCallback({}, async () => {
                    console.log('Clerk redirect handled successfully')
                    // Notify parent and close window from INSIDE the handler to prevent redirect
                    const currentUser = clerk.user
                    if (currentUser) {
                        const emailValue = currentUser.primaryEmailAddress?.emailAddress || ''
                        const fullNameValue = currentUser.fullName || currentUser.firstName || ''

                        window.opener?.postMessage({
                            type: 'oauth-success',
                            provider: 'facebook',
                            email: emailValue,
                            fullName: fullNameValue || (emailValue.includes('@') ? emailValue.split('@')[0] : emailValue),
                            portal
                        }, window.location.origin)
                        window.close()
                    }
                })
            } catch (e) {
                console.error('Clerk handleRedirectCallback failed:', e)
            }

            // Wait for Clerk to synchronize session
            let user = clerk.user
            let attempts = 0
            while (!user && attempts < 20) {
                await new Promise(resolve => setTimeout(resolve, 500))
                user = clerk.user
                attempts++
            }

            if (user) {
                email = user.primaryEmailAddress?.emailAddress || ''
                fullName = user.fullName || user.firstName || ''
            } else {
                console.log('User still null, checking signIn status...')
                // One last try: Check if the signIn is complete but session isn't synced
                const signIn = clerk.client?.signIn
                if (signIn && signIn.status === 'complete' && signIn.createdSessionId) {
                    console.log('SignIn complete, attempting to set session active manually...')
                    await clerk.setActive({ session: signIn.createdSessionId })
                    const finalUser = clerk.user
                    if (finalUser) {
                        email = finalUser.primaryEmailAddress?.emailAddress || ''
                        fullName = finalUser.fullName || finalUser.firstName || ''
                    }
                }

                if (!email) {
                    console.error('Final attempt failed. Clerk State:', {
                        loaded: clerk.loaded,
                        session: clerk.session?.id,
                        signInStatus: signIn?.status
                    })
                    throw new Error('Could not retrieve user info from Clerk session after multiple attempts')
                }
            }
        } else if (provider === 'apple' && code) {
            // For Apple, we need to exchange code on backend
            // Send code to parent window for backend processing
            window.opener?.postMessage({
                type: 'oauth-success',
                provider: 'apple',
                code,
                portal
            }, window.location.origin)
            window.close()
            return
        }

        if (!email) {
            throw new Error('Could not retrieve email from provider')
        }

        window.opener?.postMessage({
            type: 'oauth-success',
            provider,
            email,
            fullName: fullName || (email.includes('@') ? email.split('@')[0] : email),
            portal
        }, window.location.origin)

        window.close()
    } catch (error: any) {
        window.opener?.postMessage({
            type: 'oauth-error',
            error: error.message || 'Failed to complete authentication'
        }, window.location.origin)
        window.close()
    }
}
