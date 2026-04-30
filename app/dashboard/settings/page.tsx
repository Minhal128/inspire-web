"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/DashboardLayout"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import Image from "next/image"
import { usersAPI, authAPI } from "@/lib/api"

type TabType = "profile" | "notifications" | "security"

export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>("profile")
  const [isLoading, setIsLoading] = useState(false)

  // Profile state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState("Inspector")
  const [language, setLanguage] = useState("English")
  const [timezone, setTimezone] = useState("EST")

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = localStorage.getItem('user')
        if (userData) {
          const user = JSON.parse(userData)
          setName(user.fullName || '')
          setEmail(user.email || '')
          setRole(user.role || 'Inspector')
        }
        
        // Try to get fresh data from API
        const response = await authAPI.getMe()
        if (response.success) {
          setName(response.user.fullName || '')
          setEmail(response.user.email || '')
          setPhone(response.user.phone || '')
          setRole(response.user.role || 'Inspector')
          setLanguage(response.user.language || 'English')
          setTimezone(response.user.timezone || 'EST')
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      }
    }
    loadUserData()
  }, [])

  // Notification state
  const [emailNotifications, setEmailNotifications] = useState({
    inspectionReminders: true,
    reportCompletion: true,
    followUpTasks: false,
    systemUpdates: true,
  })
  const [inAppNotifications, setInAppNotifications] = useState({
    inspectionReminders: true,
    reportCompletion: true,
    followUpTasks: true,
    systemUpdates: false,
  })

  // Security state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      const response = await usersAPI.updateProfile({
        fullName: name,
        email,
        phone,
        role,
        language,
        timezone,
      })
      if (response.success) {
        toast.success("Profile updated successfully!", { position: "top-right" })
        // Update local storage
        const userData = localStorage.getItem('user')
        if (userData) {
          const user = JSON.parse(userData)
          user.fullName = name
          user.email = email
          localStorage.setItem('user', JSON.stringify(user))
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile", { position: "top-right" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveNotifications = async () => {
    setIsLoading(true)
    try {
      const response = await usersAPI.updateNotificationSettings(
        emailNotifications.inspectionReminders,
        inAppNotifications.inspectionReminders
      )
      if (response.success) {
        toast.success("Notification preferences saved!", { position: "top-right" })
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save notifications", { position: "top-right" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!", { position: "top-right" })
      return
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters!", { position: "top-right" })
      return
    }
    setIsLoading(true)
    try {
      const response = await usersAPI.changePassword(currentPassword, newPassword)
      if (response.success) {
        toast.success("Password changed successfully!", { position: "top-right" })
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to change password", { position: "top-right" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggle2FA = async () => {
    setIsLoading(true)
    try {
      const response = await usersAPI.toggleTwoFactor()
      if (response.success) {
        setTwoFactorEnabled(response.twoFactorEnabled)
        toast.success(response.message, { position: "top-right" })
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to toggle 2FA", { position: "top-right" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      // Ignore logout errors
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    toast.info("Logged out successfully", { position: "top-right" })
    setTimeout(() => router.push("/"), 1000)
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and security</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === "profile"
                      ? "bg-[#006795] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Profile Settings
                </button>

                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === "notifications"
                      ? "bg-[#006795] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                  Notifications
                </button>

                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === "security"
                      ? "bg-[#006795] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Security Settings
                </button>
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Profile Settings */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Profile Settings</h2>

                {/* Avatar */}
                <div className="flex items-center gap-4 mb-8 pb-6 border-b">
                  <Image
                    src="https://ui-avatars.com/api/?name=Emma+Johnson&size=100&background=FF4757&color=fff"
                    alt="Profile"
                    width={100}
                    height={100}
                    className="rounded-full"
                  />
                  <div>
                    <Button className="bg-[#006795] hover:bg-[#0a5670] text-white">
                      Change Photo
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF. Max size 2MB</p>
                  </div>
                </div>

                {/* Form */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006795]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006795]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006795]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006795]"
                    >
                      <option value="Inspector">Inspector</option>
                      <option value="Property Manager">Property Manager</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006795]"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006795]"
                    >
                      <option value="EST">EST (UTC-5)</option>
                      <option value="CST">CST (UTC-6)</option>
                      <option value="MST">MST (UTC-7)</option>
                      <option value="PST">PST (UTC-8)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} className="px-8 bg-[#006795] hover:bg-[#6de600] text-white font-semibold">
                    Save Changes
                  </Button>
                </div>
              </div>
            )}

            {/* Notification Preferences */}
            {activeTab === "notifications" && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Notification Preferences</h2>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Email Notifications</h3>
                    <div className="space-y-4">
                      {Object.entries(emailNotifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-800">
                              {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                            </p>
                            <p className="text-sm text-gray-600">
                              Receive email notifications for{" "}
                              {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={() =>
                                setEmailNotifications({ ...emailNotifications, [key]: !value })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#006795]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006795]"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">In-App Notifications</h3>
                    <div className="space-y-4">
                      {Object.entries(inAppNotifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-800">
                              {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                            </p>
                            <p className="text-sm text-gray-600">
                              Show in-app notifications for{" "}
                              {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={() =>
                                setInAppNotifications({ ...inAppNotifications, [key]: !value })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#006795]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006795]"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button onClick={handleSaveNotifications} className="px-8 bg-[#006795] hover:bg-[#6de600] text-white font-semibold">
                    Save Preferences
                  </Button>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Security Settings</h2>

                {/* Change Password */}
                <div className="mb-8 pb-8 border-b">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006795]"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006795]"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006795]"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <Button onClick={handleChangePassword} className="bg-[#006795] hover:bg-[#0a5670] text-white">
                      Update Password
                    </Button>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="mb-8 pb-8 border-b">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg max-w-2xl">
                    <div>
                      <p className="font-medium text-gray-800 mb-1">Enable Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600">
                        Add an extra layer of security to your account by requiring a verification code
                      </p>
                    </div>
                    <Button
                      onClick={handleToggle2FA}
                      className={`${
                        twoFactorEnabled
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-[#006795] hover:bg-[#6de600] text-black"
                      } text-white font-semibold`}
                    >
                      {twoFactorEnabled ? "Disable" : "Enable"}
                    </Button>
                  </div>
                </div>

                {/* Session Management */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Session Management</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">Current Device</p>
                        <p className="text-sm text-gray-600">Windows · Chrome · {new Date().toLocaleString()}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">iPhone 13</p>
                        <p className="text-sm text-gray-600">iOS · Safari · Last active 2 hours ago</p>
                      </div>
                      <Button variant="outline" className="text-red-600 hover:text-red-700">
                        Log Out
                      </Button>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Log Out From All Devices
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
