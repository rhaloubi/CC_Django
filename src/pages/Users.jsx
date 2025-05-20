"use client"

import { useState, useEffect } from "react"
import { Users, UserPlus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { AddUserDialog } from "@/components/Users/add-user-dialog"
import { columns } from "@/components/Users/columns"
import { DataTable } from "@/components/Users/data-table"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import Header from "@/layout/header"
import { AppSidebar } from "@/layout/sidebar"
import axios from "axios"
import { Toaster } from "@/components/ui/toaster"
import { EditUserDialog } from "@/components/Users/edit-user-dialog"

export default function UserList() {
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [editUserOpen, setEditUserOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('authToken')
        const headers = {
          Authorization: `token ${token}`
        }

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, { headers })
        
        if (response.data) {
          const userData = response.data  // <-- Add .data here
          .filter(user => user.role !== 'admin')
          .map(user => ({
            id: user.id.toString(),
            email: user.email,
            username: user.username,
            role: user.role
          }))
          setUsers(userData)
        }
      } catch (error) {
        console.error('Error fetching users:', error)
        setError('Failed to fetch users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return (
    <ThemeProvider defaultTheme="dark">
      <SidebarProvider>
        <div className="flex min-h-screen dark:bg-background">
          <AppSidebar />
          <div className="flex-1">
            <Header />
            <div className="bg-background p-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-semibold">User List</h1>
                  <p className="text-muted-foreground">
                    Manage your users and their roles here.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button className="gap-2" onClick={() => setAddUserOpen(true)}>
                    Add User
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {loading ? (
                <div>Loading users...</div>
              ) : error ? (
                <div>{error}</div>
              ) : (
                <DataTable 
                  columns={columns({ 
                    setEditUserOpen, 
                    setSelectedUserId 
                  })} 
                  data={users} 
                />
              )}
              <AddUserDialog open={addUserOpen} onOpenChange={setAddUserOpen} />
              <EditUserDialog 
                open={editUserOpen} 
                onOpenChange={setEditUserOpen}
                userId={selectedUserId}
              />
            </div>
          </div>
        </div>
        <Toaster />
      </SidebarProvider>
    </ThemeProvider>
  )
}

