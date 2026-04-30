"use client"

import { useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "react-toastify"

interface User {
  id: string
  name: string
  email: string
  role: string
  properties: string[]
  status: "Active" | "Inactive"
  joinDate: string
}

export default function OthersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  // Mock data - non-inspector users from signup
  const users: User[] = [
    {
      id: "USR-001",
      name: "Sarah Mitchell",
      email: "sarah.mitchell@example.com",
      role: "Property Manager",
      properties: ["Sunset Apartments", "River Heights", "Oakwood Towers"],
      status: "Active",
      joinDate: "2024-01-15",
    },
    {
      id: "USR-002",
      name: "Michael Chen",
      email: "michael.chen@example.com",
      role: "Property Manager",
      properties: ["Courthouse Apartments", "Calhoun Homes"],
      status: "Active",
      joinDate: "2024-02-10",
    },
    {
      id: "USR-003",
      name: "Emma Johnson",
      email: "emma.johnson@example.com",
      role: "Supervisor",
      properties: ["STEPHEN'S PARK APA", "Demure St-Hilaire"],
      status: "Active",
      joinDate: "2024-01-20",
    },
    {
      id: "USR-004",
      name: "David Martinez",
      email: "david.martinez@example.com",
      role: "Coordinator",
      properties: ["Sunset Apartments"],
      status: "Inactive",
      joinDate: "2023-12-05",
    },
    {
      id: "USR-005",
      name: "Jessica Lee",
      email: "jessica.lee@example.com",
      role: "Property Manager",
      properties: ["River Heights", "Oakwood Towers", "Courthouse Apartments"],
      status: "Active",
      joinDate: "2024-01-08",
    },
  ]

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = !roleFilter || user.role === roleFilter
    const matchesStatus = !statusFilter || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleViewDetails = (userId: string) => {
    toast.info(`Viewing details for user ${userId}`, { position: "top-right" })
  }

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      "Property Manager": "bg-blue-100 text-blue-700",
      "Supervisor": "bg-purple-100 text-purple-700",
      "Coordinator": "bg-green-100 text-green-700",
    }
    return colors[role] || "bg-gray-100 text-gray-700"
  }

  const getStatusColor = (status: string) => {
    return status === "Active"
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-700"
  }

  const uniqueRoles = [...new Set(users.map(u => u.role))]

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#E8F4F8] p-3 sm:p-4 md:p-6 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 shadow-sm">
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1">Others</h1>
              <p className="text-sm sm:text-base text-gray-600">
                View all non-inspector users (Property Managers, Supervisors, Coordinators) and their associated properties.
              </p>
            </div>
          </div>

          {/* Filters */}
          <Card className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Filters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Search by Name or Email
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#006795] text-sm"
                  />
                </div>
              </div>

              {/* Role Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#006795] text-sm"
                >
                  <option value="">All Roles</option>
                  {uniqueRoles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#006795] text-sm"
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Users List */}
          <div className="space-y-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <Card key={user.id} className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#006795] to-[#0A5F7F] flex items-center justify-center text-white font-bold text-lg">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>

                      {/* Role and Status Badges */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                          Joined {user.joinDate}
                        </span>
                      </div>

                      {/* Associated Properties */}
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          Associated Properties ({user.properties.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {user.properties.map((property, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 rounded-lg bg-[#E8F4F8] text-[#006795] text-xs font-medium"
                            >
                              {property}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 md:w-auto">
                      <Button
                        onClick={() => handleViewDetails(user.id)}
                        className="w-full md:w-auto bg-[#006795] hover:bg-[#0a5670] text-white px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="bg-white rounded-lg shadow-sm p-8 text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20a9 9 0 0118 0v2h2v-2a11 11 0 10-20 0v2h2v-2z" />
                </svg>
                <p className="text-gray-600 font-medium">No users found matching your filters</p>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
              </Card>
            )}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Card className="bg-white rounded-lg shadow-sm p-4">
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </Card>
            <Card className="bg-white rounded-lg shadow-sm p-4">
              <p className="text-sm text-gray-600 mb-1">Active Users</p>
              <p className="text-2xl font-bold text-green-600">{users.filter(u => u.status === "Active").length}</p>
            </Card>
            <Card className="bg-white rounded-lg shadow-sm p-4">
              <p className="text-sm text-gray-600 mb-1">Inactive Users</p>
              <p className="text-2xl font-bold text-gray-600">{users.filter(u => u.status === "Inactive").length}</p>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
