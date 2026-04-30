"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import OtherDashboardLayout from "@/components/OtherDashboardLayout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "react-toastify"
import { usersAPI } from "@/lib/api"

export default function OtherUsersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOtherUsers()
  }, [])

  const fetchOtherUsers = async () => {
    try {
      setLoading(true)
      const response = await usersAPI.getOtherUsers()
      if (response.success) {
        // Filter out inspectors - show only non-inspector users
        const nonInspectors = (response.users || []).filter(
          (user: any) => user.role !== 'inspector'
        )
        setUsers(nonInspectors)
      }
    } catch (error: any) {
      console.error('Error loading other users:', error)
      toast.error('Failed to load users', { position: "top-right" })
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    // Filter users locally based on search query
    fetchOtherUsers()
    toast.info("Searching users...", { position: "top-right" })
  }

  const filteredUsers = users.filter(user => 
    user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "management":
        return "bg-purple-100 text-purple-800"
      case "supervisor":
        return "bg-blue-100 text-blue-800"
      case "property-manager":
        return "bg-green-100 text-green-800"
      case "asset-manager":
        return "bg-orange-100 text-orange-800"
      case "other":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role?.toLowerCase()) {
      case "management":
        return "Management"
      case "supervisor":
        return "Supervisor"
      case "property-manager":
        return "Property Manager"
      case "asset-manager":
        return "Asset Manager"
      case "other":
        return "Other"
      default:
        return role || "User"
    }
  }

  return (
    <OtherDashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Other Users</h1>
          <p className="text-gray-600 text-sm sm:text-base">View and manage non-inspector users</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 lg:mb-8">
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600 text-sm font-medium mb-1">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
          </Card>
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600 text-sm font-medium mb-1">Management</p>
            <p className="text-2xl font-bold text-gray-900">
              {users.filter(u => u.role === 'management').length}
            </p>
          </Card>
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600 text-sm font-medium mb-1">Supervisors</p>
            <p className="text-2xl font-bold text-gray-900">
              {users.filter(u => u.role === 'supervisor').length}
            </p>
          </Card>
        </div>

        {/* Search */}
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 lg:mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Users</h2>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Name, Email or Role</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006795] focus:border-transparent text-sm transition-colors duration-200"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg font-bold transition-colors duration-200"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex items-end">
              <Button
                onClick={handleSearch}
                className="w-full bg-[#006795] hover:bg-[#0A5670] text-white font-semibold py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md transition-all duration-200"
              >
                Search
              </Button>
            </div>
          </div>
        </Card>

        {/* Users Grid */}
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {filteredUsers.length} users
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No users found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map((user) => (
                <Card key={user._id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#006795] flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                      {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{user.fullName}</h3>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-2 ${getRoleColor(user.role)}`}>
                        {getRoleDisplayName(user.role)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Joined</span>
                      <span className="text-gray-700">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </OtherDashboardLayout>
  )
}
