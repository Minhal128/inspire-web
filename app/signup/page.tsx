"use client"

import { useState, FormEvent, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import SocialLoginButtons from "@/components/SocialLoginButtons"
import { initGoogleLogin, initFacebookLogin, initAppleLogin } from "@/lib/social-auth"
import { authAPI } from "@/lib/api"

export default function Signup() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("inspector")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // CAPTCHA state
  const [captchaId, setCaptchaId] = useState("")
  const [captchaImage, setCaptchaImage] = useState("")
  const [captchaCode, setCaptchaCode] = useState("")
  const [captchaLoading, setCaptchaLoading] = useState(false)

  // Load captcha on mount
  useEffect(() => {
    loadCaptcha()
  }, [])

  const loadCaptcha = async () => {
    setCaptchaLoading(true)
    try {
      const response = await authAPI.getCaptcha()
      if (response.success && response.captchaImage) {
        setCaptchaId(response.captchaId)
        setCaptchaImage(response.captchaImage)
        setCaptchaCode("")
      }
    } catch (error) {
      console.error("Failed to load captcha:", error)
      toast.error("Failed to load security check. Please refresh the page.", {
        position: "top-right",
        autoClose: 3000,
      })
    } finally {
      setCaptchaLoading(false)
    }
  }

  const validateFullName = (name: string) => {
    const nameRegex = /^[a-zA-Z][a-zA-Z\s'-]{1,98}[a-zA-Z]$/
    return nameRegex.test(name.trim()) && name.trim().length >= 2 && name.trim().length <= 100
  }



  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/
    return passwordRegex.test(password)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Validation
    if (!fullName.trim()) {
      toast.error("Please enter your full name", { position: "top-right", autoClose: 3000 })
      return
    }

    if (!validateFullName(fullName)) {
      toast.error("Full name must be 2-100 characters and contain only letters, spaces, hyphens, or apostrophes", { position: "top-right", autoClose: 4000 })
      return
    }

    if (!email.trim()) {
      toast.error("Please enter your email address", { position: "top-right", autoClose: 3000 })
      return
    }



    if (!password) {
      toast.error("Please create a password", { position: "top-right", autoClose: 3000 })
      return
    }

    if (password.length > 128) {
      toast.error("Password cannot exceed 128 characters", { position: "top-right", autoClose: 3000 })
      return
    }

    if (!validatePassword(password)) {
      toast.error("Password must be 8-128 characters with uppercase, lowercase, number, and special character (@$!%*?&)", { position: "top-right", autoClose: 5000 })
      return
    }

    if (!role) {
      toast.error("Please select your role", { position: "top-right", autoClose: 3000 })
      return
    }

    // Validate CAPTCHA
    if (!captchaCode.trim()) {
      toast.error("Please enter the security code", { position: "top-right", autoClose: 3000 })
      return
    }

    if (captchaCode.length !== 5) {
      toast.error("Security code must be 5 characters", { position: "top-right", autoClose: 3000 })
      return
    }

    setIsLoading(true)

    try {
      const response = await authAPI.signupWithCaptcha(
        fullName.trim(),
        email.trim().toLowerCase(),
        password,
        role,
        captchaId,
        captchaCode.toUpperCase()
      )

      if (response.success) {
        toast.success("Account created! Please select your portal to continue.", {
          position: "top-right",
          autoClose: 2000,
        })

        // Store email and role in localStorage for later verification
        localStorage.setItem('pendingVerificationEmail', email.trim().toLowerCase())
        localStorage.setItem('pendingVerificationRole', role)

        // Redirect to email verification page
        setTimeout(() => {
          router.push(`/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}&role=${encodeURIComponent(role)}`)
        }, 2000)
      } else {
        toast.error(response.message || "Signup failed. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        })
        // Reload captcha on failure
        loadCaptcha()
      }
    } catch (error: any) {
      toast.error(error.message || "Error connecting to server. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      })
      // Reload captcha on error
      loadCaptcha()
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setIsLoading(true)
    const portal = 'Inspector'

    try {
      let result
      if (provider === 'google') {
        result = await initGoogleLogin(portal)
      } else if (provider === 'facebook') {
        result = await initFacebookLogin(portal)
      } else {
        result = await initAppleLogin(portal)
      }

      // Send to backend for verification
      const response = await authAPI.socialLogin(
        result.email,
        result.fullName || result.email.split('@')[0],
        portal,
        provider
      )

      if (response.success) {
        // Store token
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))

        toast.success(`Logged in with ${provider}! Redirecting...`, {
          position: "top-right",
          autoClose: 2000,
        })

        // Redirect based on role
        const userRole = response.user.role
        setTimeout(() => {
          if (userRole === 'admin') {
            router.push('/admin/dashboard')
          } else if (userRole === 'management' || userRole === 'property-manager' || userRole === 'supervisor') {
            router.push('/management/dashboard')
          } else if (userRole === 'inspector') {
            router.push('/dashboard')
          } else {
            router.push('/other/dashboard')
          }
        }, 2000)
      } else {
        toast.error(response.message || 'Social login failed', {
          position: "top-right",
          autoClose: 3000,
        })
        setIsLoading(false)
      }
    } catch (error: any) {
      console.error(`${provider} login error:`, error)

      if (!error.message?.includes('cancelled') && !error.message?.includes('closed')) {
        toast.error(error.message || `Failed to sign in with ${provider}`, {
          position: "top-right",
          autoClose: 3000,
        })
      }
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      {/* Header Section */}
      <div className="w-full bg-[#E8F4F8] px-4 sm:px-6 text-center flex flex-col items-center justify-center rounded-b-[40px] sm:rounded-b-[70px]" style={{ minHeight: '200px' }}>
        <div className="flex justify-center mb-4 sm:mb-8">
          <Image
            src="/logo.png"
            alt="INSPIRE Logo"
            width={480}
            height={560}
            className="w-auto h-16 sm:h-24 md:h-32 cursor-pointer"
            onClick={() => router.push('/')}
          />
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
          Create Your INSPIRE Account
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 px-2 sm:px-4 mb-4">
          Start inspecting smarter — join property managers and inspectors using INSPIRE.
        </p>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex items-start sm:items-center justify-center px-3 sm:px-4 py-4 sm:py-8">
        <div className="w-full max-w-[600px] px-2 sm:px-6 md:px-12 py-4 sm:py-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-8 text-center">
            Let's Get You Started
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Full Name Field */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-[#0D6A8D] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  maxLength={100}
                  className="w-full px-4 py-3 rounded-lg bg-[#E8F4F8] border-0 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0D6A8D]"
                />
                <p className="text-xs text-gray-500 mt-1">Letters, spaces, hyphens only</p>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#0D6A8D] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 rounded-lg bg-[#E8F4F8] border-0 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0D6A8D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-[#0D6A8D] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create your Password"
                  maxLength={128}
                  className="w-full px-4 py-3 rounded-lg bg-[#E8F4F8] border-0 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0D6A8D]"
                />
                <p className="text-xs text-gray-500 mt-1">8-128 chars, uppercase, lowercase, number, special (@$!%*?&)</p>
              </div>

              {/* Role Field */}
              <div>
                <label htmlFor="role" className="block text-sm font-semibold text-[#0D6A8D] mb-2">
                  Role
                </label>
                <input
                  type="text"
                  id="role"
                  value="Inspector"
                  readOnly
                  className="w-full px-4 py-3 rounded-lg bg-[#E8F4F8] border-0 text-gray-900 font-semibold cursor-default"
                />
              </div>
            </div>

            {/* CAPTCHA */}
            <div>
              <label className="block text-sm font-semibold text-[#0D6A8D] mb-2">
                Security Check
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-3">
                <div className="flex items-center gap-3">
                  {captchaLoading ? (
                    <div className="w-40 sm:w-48 h-14 sm:h-16 bg-[#E8F4F8] rounded-lg flex items-center justify-center border-2 border-[#0D6A8D]">
                      <div className="animate-spin h-5 w-5 sm:h-6 sm:w-6 border-2 border-[#0D6A8D] border-t-transparent rounded-full"></div>
                    </div>
                  ) : captchaImage ? (
                    <img
                      src={captchaImage}
                      alt="Security Code"
                      className="w-40 sm:w-48 h-14 sm:h-16 rounded-lg border-2 border-[#0D6A8D] object-contain bg-white"
                    />
                  ) : (
                    <div className="w-40 sm:w-48 h-14 sm:h-16 bg-[#E8F4F8] rounded-lg flex items-center justify-center border-2 border-[#0D6A8D]">
                      <span className="text-xs text-gray-500">Click refresh →</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={loadCaptcha}
                    disabled={captchaLoading}
                    className="p-2 sm:p-3 bg-[#E8F4F8] rounded-lg hover:bg-[#D1F2EB] transition-colors disabled:opacity-50 flex-shrink-0"
                    title="Refresh security code"
                  >
                    <svg className="w-5 h-5 text-[#0D6A8D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={captchaCode}
                onChange={(e) => setCaptchaCode(e.target.value.toUpperCase())}
                placeholder="Enter code from image"
                maxLength={5}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-[#E8F4F8] border-0 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] text-center text-base sm:text-lg font-semibold tracking-widest uppercase"
              />
            </div>

            {/* Create Account Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0D6A8D] hover:bg-[#0D6A8D]/90 text-white rounded-lg py-6 font-semibold text-base disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Social Login */}
          <div className="mt-6">
            <SocialLoginButtons
              onGoogleClick={() => handleSocialLogin('google')}
              onFacebookClick={() => handleSocialLogin('facebook')}
              onAppleClick={() => handleSocialLogin('apple')}
              disabled={isLoading}
            />
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-[#0D6A8D] hover:underline font-semibold">
              Log in here
            </a>
          </p>

          {/* Back to Portal Selection */}
          <p className="text-center text-sm text-gray-600 mt-4">
            <button
              onClick={() => router.push('/profile-selection')}
              className="text-[#0D6A8D] hover:underline font-semibold bg-transparent border-0 cursor-pointer"
            >
              ← Back to Portal Selection
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
