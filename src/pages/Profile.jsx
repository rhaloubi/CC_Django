"use client"
import { AppSidebar } from "@/layout/sidebar"
import {  LayoutPanelLeft ,User,KeyRound,Bell , MonitorDot} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Header from "@/layout/header"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useNavigate } from "react-router-dom"  // Add this import at the top
import { useState, useEffect } from "react"  // Add this import
import axios from "axios"  // Add this import

export default function SettingsPage() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    role: ''
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken')
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/me/`, {
          headers: {
            Authorization: `token ${token}`
          }
        })
        
        if (response.data !== null) {
          setUserData({
            username: response.data.username,
            email: response.data.email,
            role: response.data.role
          })
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [])

  return (
    <ThemeProvider defaultTheme="dark">
      <SidebarProvider>
        <div className="flex min-h-screen dark:bg-background">
        <AppSidebar />

          {/* Main Content */}
          <div className="flex-1 ">
            <Header />

            <main className="p-6">
              <div className=" mx-auto">
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-muted-foreground mb-6 pb-3 border-b">
                  View your Profile settings and set e-mail preferences.
                </p>

                <div className="flex gap-8">
                  <div className="w-48 flex flex-col gap-1 ">
                    <Button 
                      variant="ghost" 
                      className="justify-start hover:text-line font-medium"
                      onClick={() => navigate('/profile')}
                    >
                      <User /> 
                      Profile
                    </Button>
                  </div>

                  <div className="flex-1">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-lg font-semibold mb-2">Profile</h2>
                        <p className="text-sm text-muted-foreground">
                          This is how others will see you on the site.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Username</label>
                          <Input 
                            value={userData.username} 
                            disabled 
                            readOnly 
                            className="mt-2" 
                          />
                          <p className="text-sm text-muted-foreground mt-2">
                            This is your public display name. It can be your real name or a pseudonym.
                          </p>
                        </div>

                        <div>
                          <label className="text-sm font-medium">Email</label>
                          <Input 
                            value={userData.email}
                            disabled 
                            readOnly
                            className="mt-2" 
                          />
                          <p className="text-sm text-muted-foreground mt-2">
                            You can manage verified email addresses in your email settings.
                          </p>
                        </div>

                        <div>
                          <label className="text-sm font-medium">Role</label>
                          <Input 
                            value={userData.role}
                            className="mt-2 w-32" 
                            disabled 
                            readOnly
                          />
                          <p className="text-sm text-muted-foreground mt-2">
                            This displays your role in the organization. Only administrators can modify roles.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  )
}

