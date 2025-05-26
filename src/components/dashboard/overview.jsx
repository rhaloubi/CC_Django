"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { useState, useEffect } from "react"
import axios from "axios"

export function Overview() {
  const [restaurantData, setRestaurantData] = useState([])

  useEffect(() => {
    const fetchRestaurantStats = async () => {
      try {
        const token = localStorage.getItem('authToken')
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/restaurants/`, {
          headers: { Authorization: `token ${token}` }
        })

        const restaurants = response.data
        const monthlyStats = Array(12).fill(0).map((_, index) => ({
          name: new Date(0, index).toLocaleString('default', { month: 'short' }),
          total: 0
        }))

        restaurants.forEach(restaurant => {
          const date = new Date(restaurant.createdAt)
          const month = date.getMonth()
          monthlyStats[month].total++
        })

        setRestaurantData(monthlyStats)
      } catch (error) {
        console.error('Error fetching restaurant stats:', error)
      }
    }

    fetchRestaurantStats()
  }, [])

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={restaurantData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar
          dataKey="total"
          fill="#3b82f6"
          radius={[4, 4, 0, 0]}
          name="Total Restaurants"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

