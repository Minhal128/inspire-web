"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/DashboardLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { authAPI } from "@/lib/api"
import { toast } from "react-toastify"
import { AlertTriangle, Trash2, Shield, Lock, User, Mail, Loader2 } from "lucide-react"

export default function DeleteAccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [password, setPassword] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      setLoading(true)
      const userRes = await authAPI.getMe()
      if (userRes.success) {
        setUser(userRes.user)
      }
    } catch (error: any) {
      console.error('Error fetching user:', error)
      toast.error("Failed to load user data")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") {
      toast.error('Please type "DELETE" to confirm')
      return
    }

    if (!password) {
      toast.error("Please enter your password to confirm")
      return
    }

    setDeleting(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://sea-lion-app-2u676.ondigitalocean.app'}/api/auth/delete-account`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ password })
        }
      )

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success("Account deleted successfully. Redirecting...", { position: "top-right" })
        
        // Clear all local storage
        localStorage.clear()
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        throw new Error(data.message || 'Failed to delete account')
      }
    } catch (error: any) {
      console.error('Delete account error:', error)
      toast.error(`Failed to delete account: ${error.message}`, { position: "top-right" })
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A73E8]"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Delete Account</h1>
          <p className="text-sm sm:text-base text-gray-600">Permanently delete your account and all associated data</p>
        </div>

        {/* Warning Card */}
        <Card className="p-4 sm:p-6 bg-red-50 border-red-200 mb-4 sm:mb-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-red-900 mb-2">Warning: This action is irreversible</h3>
              <p className="text-xs sm:text-sm text-red-800 leading-relaxed">
                Deleting your account will permanently remove all your data from our servers. This includes:
              </p>
              <ul className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-red-800">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0"></div>
                  <span>All inspection reports and findings</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0"></div>
                  <span>Property information and records</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0"></div>
                  <span>Your profile and account settings</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0"></div>
                  <span>All uploaded images and documents</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Current Account Info */}
        <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Current Account Information</h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600">Full Name</p>
                <p className="font-bold text-sm sm:text-base text-gray-900 truncate">{user?.fullName || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600">Email Address</p>
                <p className="font-bold text-sm sm:text-base text-gray-900 truncate">{user?.email || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600">Account Role</p>
                <p className="font-bold text-sm sm:text-base text-gray-900 capitalize truncate">{user?.role || 'N/A'}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Delete Confirmation */}
        {!showConfirmation ? (
          <Card className="p-4 sm:p-6">
            <div className="text-center py-6 sm:py-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Trash2 className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Ready to delete your account?</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto px-4">
                Before proceeding, please make sure you've downloaded any important data or reports you need.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  className="w-full sm:w-auto px-6 sm:px-8"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setShowConfirmation(true)}
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-6 sm:px-8"
                >
                  Continue to Delete
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Confirm Account Deletion</h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">
                  Type "DELETE" to confirm
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type DELETE in capital letters"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">
                  Enter your password to confirm
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                <Button
                  onClick={() => {
                    setShowConfirmation(false)
                    setConfirmText("")
                    setPassword("")
                  }}
                  variant="outline"
                  className="w-full sm:flex-1 text-sm sm:text-base"
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteAccount}
                  disabled={deleting || confirmText !== "DELETE" || !password}
                  className="w-full sm:flex-1 bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete My Account
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Help Text */}
        <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-600 px-4">
          <p>Need help? Contact support at <a href="mailto:support@nspire.com" className="text-blue-600 hover:underline">support@nspire.com</a></p>
        </div>
      </div>
    </DashboardLayout>
  )
}
