import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import axios from "axios"

export function RecentSales() {
  const [recentRestaurants, setRecentRestaurants] = useState([])

  useEffect(() => {
    const fetchRecentRestaurants = async () => {
      try {
        const token = localStorage.getItem('authToken')
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/restaurants/`, {
          headers: { Authorization: `token ${token}` }
        })

        const restaurants = response.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)

        setRecentRestaurants(restaurants)
      } catch (error) {
        console.error('Error fetching recent restaurants:', error)
      }
    }

    fetchRecentRestaurants()
  }, [])

  return (
    <div className="space-y-8">
      {recentRestaurants.map((restaurant) => (
        <div key={restaurant.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{restaurant.company_name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{restaurant.company_name}</p>
            <p className="text-sm text-muted-foreground">
              {restaurant.phone_number}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

