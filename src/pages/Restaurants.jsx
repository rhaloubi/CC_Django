"use client"

import { columns } from "@/components/Restaurants/columns"
import { DataTable } from "@/components/Restaurants/data-table"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import Header from "@/layout/header"
import { AppSidebar } from "@/layout/sidebar"
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Toaster } from "@/components/ui/toaster"

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem('authToken')
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/restaurants/`, {
          headers: {
            Authorization: `token ${token}`
          }
        })

        if (response.data !== null) {
          const formattedRestaurants = response.data.map(restaurant => ({
            id: restaurant.id,
            company_name: restaurant.company_name,
            phone_number: restaurant.phone_number,
            user: restaurant.user
          }))
          setRestaurants(formattedRestaurants)
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error)
        setError('Failed to fetch restaurants')
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurants()
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
                  <h1 className="text-2xl font-semibold">Restaurants</h1>
                  <p className="text-muted-foreground">
                    Here's a list of all restaurants!
                  </p>
                </div>
                <div className="flex gap-2">
                </div>
              </div>

              {loading ? (
                <div>Loading restaurants...</div>
              ) : error ? (
                <div>{error}</div>
              ) : (
                <DataTable columns={columns} data={restaurants} />
              )}
            </div>
          </div>
        </div>
        <Toaster />
      </SidebarProvider>
    </ThemeProvider>
  )
}