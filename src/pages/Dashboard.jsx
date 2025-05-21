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
import { ListTodo, CheckCircle, Clock } from 'lucide-react'

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('authToken')
        const headers = { Authorization: `token ${token}` }

        const [usersResponse, tasksResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, { headers }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/tasks`, { headers })
        ])

        const users = usersResponse.data
        const tasks = tasksResponse.data.data
        
        setStats({
          totalUsers: users.length,
          totalTasks: tasks.length,
          completedTasks: tasks.filter(task => task.status === "Done").length,
          pendingTasks: tasks.filter(task => task.status === "TODO" || task.status === "IN_PROGRESS").length
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
                            Active team members
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-md font-medium">
                            Total Tasks
                          </CardTitle>
                          <ListTodo className="text-blue-300 dark:text-blue-900" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">{stats.totalTasks}</div>
                          <p className="text-sm text-muted-foreground">
                            All assigned tasks
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-md font-medium">
                            Completed Tasks
                          </CardTitle>
                          <CheckCircle className="text-blue-300 dark:text-blue-900" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">{stats.completedTasks}</div>
                          <p className="text-sm text-green-500/90">
                            Successfully completed
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-md font-medium">
                            Pending Tasks
                          </CardTitle>
                          <Clock className="text-blue-300 dark:text-blue-900" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">{stats.pendingTasks}</div>
                          <p className="text-sm text-yellow-500/90">
                            In progress or todo
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                      <Card className="col-span-4">
                        <CardHeader>
                          <CardTitle>Task Statistics</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                          <Overview />
                        </CardContent>
                      </Card>
                      <Card className="col-span-3">
                        <CardHeader>
                          <CardTitle>Recent Tasks</CardTitle>
                          <div className="text-md text-muted-foreground">
                            Latest {stats.totalTasks} tasks created
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

