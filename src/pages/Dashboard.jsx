"use client"

import { Users } from 'lucide-react'
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { MainNav } from "@/components/dashboard/main-nav"
import { AppSidebar } from "@/layout/sidebar"
import { Overview } from "@/components/dashboard/overview"
import { RecentSales } from "@/components/dashboard/recent-sales"
import { SearchCommand } from "@/components/dashboard/SearchDialog"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { UserNav } from "@/components/dashboard/user-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Store, CheckCircle, Clock } from 'lucide-react'

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRestaurants: 0,
    activeRestaurants: 0,
    pendingRestaurants: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('authToken')
        const headers = { Authorization: `token ${token}` }

        const [usersResponse, restaurantsResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, { headers }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/restaurants/`, { headers })
        ])

        const users = usersResponse.data
        const restaurants = restaurantsResponse.data
        
        setStats({
          totalUsers: users.filter(user => user.role !== 'admin').length,
          totalRestaurants: restaurants.length,
          activeRestaurants: restaurants.length, // You can modify this based on your restaurant status logic
          pendingRestaurants: 0 // You can modify this based on your restaurant status logic
        })
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      }
    }

    fetchStats()
  }, [])

  return (
    <ThemeProvider defaultTheme="dark">
      <SidebarProvider>
        <div className="flex min-h-screen dark:bg-background">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <div className="flex flex-col h-full">
              <div className="border-b border-zinc-300 dark:border-zinc-700">
                <div className="flex h-16 items-center px-4">
                  <MainNav className="mx-6" />
                  <div className="ml-auto flex items-center space-x-4">
                    <SearchCommand />
                    <ThemeToggle />
                    <UserNav />
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-4 p-8 pt-6 overflow-auto">
                <div className="flex items-center justify-between space-y-2">
                  <h2 className="text-4xl font-bold tracking-tight">Dashboard</h2>
                </div>
                <Tabs defaultValue="overview" className="space-y-4">
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-md font-medium">
                            Total Users
                          </CardTitle>
                          <Users className="text-blue-300 dark:text-blue-900" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">{stats.totalUsers}</div>
                          <p className="text-sm text-muted-foreground">
                            Active Users
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-md font-medium">
                            Total Restaurants
                          </CardTitle>
                          <Store className="text-blue-300 dark:text-blue-900" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">{stats.totalRestaurants}</div>
                          <p className="text-sm text-muted-foreground">
                            All registered restaurants
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-md font-medium">
                            Active Restaurants
                          </CardTitle>
                          <CheckCircle className="text-blue-300 dark:text-blue-900" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">{stats.activeRestaurants}</div>
                          <p className="text-sm text-green-500/90">
                            Currently active
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-md font-medium">
                            Pending Restaurants
                          </CardTitle>
                          <Clock className="text-blue-300 dark:text-blue-900" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">{stats.pendingRestaurants}</div>
                          <p className="text-sm text-yellow-500/90">
                            Awaiting activation
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                      <Card className="col-span-4">
                        <CardHeader>
                          <CardTitle>Restaurant Statistics</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                          <Overview />
                        </CardContent>
                      </Card>
                      <Card className="col-span-3">
                        <CardHeader>
                          <CardTitle>Recent Restaurants</CardTitle>
                          <div className="text-md text-muted-foreground">
                            Latest {stats.totalRestaurants} restaurants added
                          </div>
                        </CardHeader>
                        <CardContent>
                          <RecentSales />
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default Dashboard

