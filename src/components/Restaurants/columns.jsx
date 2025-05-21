"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { MoreVertical } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Eye, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import axios from 'axios'

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="px-1">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-1">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "company_name",
    header: "Company Name",
  },
  {
    accessorKey: "phone_number",
    header: "Phone Number",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [isViewOpen, setIsViewOpen] = useState(false)
      const [restaurantDetails, setRestaurantDetails] = useState(null)

      const handleView = async () => {
        try {
          const token = localStorage.getItem('authToken')
          const restaurantId = row.getValue("id")
          
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/restaurants/${restaurantId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          setRestaurantDetails(response.data)
          setIsViewOpen(true)
        } catch (error) {
          console.error('Error fetching restaurant details:', error)
        }
      }

      const handleDelete = async () => {
        try {
          const token = localStorage.getItem('authToken')
          const restaurantId = row.getValue("id")
          
          await axios.delete(`${import.meta.env.VITE_API_URL}/api/restaurants/${restaurantId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          window.location.reload()
        } catch (error) {
          console.error('Error deleting restaurant:', error)
        }
      }

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                className="text-gray-600 dark:text-gray-400"
                onClick={handleView}
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-red-600" onSelect={(e) => e.preventDefault()}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the restaurant.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 dark:text-white hover:bg-red-700">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>

          {restaurantDetails && (
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
              <DialogContent className="sm:max-w-[600px] w-full">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">{restaurantDetails.company_name}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-semibold mb-2">Phone Number:</p>
                          <p>{restaurantDetails.phone_number}</p>
                        </div>
                        <div>
                          <p className="font-semibold mb-2">User ID:</p>
                          <p>{restaurantDetails.user}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </>
      )
    },
  }
]