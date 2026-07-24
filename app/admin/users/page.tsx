"use client"

import { useState, useEffect } from "react"
import AdminDashboardLayout from "@/components/AdminDashboardLayout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "react-toastify"
import { adminAPI } from "@/lib/api"
import { Search, Loader2 } from "lucide-react"

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await adminAPI.getInspectors({ search: searchQuery })
      if (response.success && response.inspectors) {
        setUsers(response.inspectors)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to load users", { position: "top-right" })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUsers()
  }

  const toggleUserStatus = async (user: any) => {
    try {
      const response = await adminAPI.updateUserStatus(user._id, !user.isActive)
      if (response.success) {
        toast.success(`User ${!user.isActive ? 'activated' : 'banned'} successfully`, { position: "top-right" })
        fetchUsers() // Refresh list
      }
    } catch (error) {
      console.error("Error updating user status:", error)
      toast.error("Failed to update user status", { position: "top-right" })
    }
  }

  const deleteUser = async (user: any) => {
    if (!window.confirm(`Are you sure you want to completely remove the user "${user.name}"? This action cannot be undone.`)) {
      return
    }
    try {
      const response = await adminAPI.deleteUser(user._id)
      if (response.success) {
        toast.success(`User deleted successfully`, { position: "top-right" })
        fetchUsers() // Refresh list
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("Failed to delete user", { position: "top-right" })
    }
  }

  return (
    <AdminDashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 lg:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600 text-sm sm:text-base">View and manage all system users (ban, activate, or remove)</p>
          </div>
        </div>

        {/* Search */}
        <Card className="p-4 mb-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users by name or email..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006795]"
              />
            </div>
            <Button type="submit" className="bg-[#1E3A5F] hover:bg-[#152A45] text-white">
              Search
            </Button>
          </form>
        </Card>

        {/* Users Table */}
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">User Records</h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {users.length} users
            </span>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#006795]" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No users found matching your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      User
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-[#1E3A5F] rounded-full flex items-center justify-center text-white font-bold">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="capitalize text-sm text-gray-900">{user.role}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Banned'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {user.hireDate}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => toggleUserStatus(user)}
                            variant="outline"
                            className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                              user.isActive 
                                ? "text-amber-600 border-amber-600 hover:bg-amber-50" 
                                : "text-green-600 border-green-600 hover:bg-green-50"
                            }`}
                          >
                            {user.isActive ? 'Ban' : 'Activate'}
                          </Button>
                          <Button
                            onClick={() => deleteUser(user)}
                            variant="outline"
                            className="px-3 py-1 text-xs font-semibold rounded-lg text-red-600 border-red-600 hover:bg-red-50"
                          >
                            Remove
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </AdminDashboardLayout>
  )
}
