"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// Update the form schema to remove phoneNumber
const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
})

export function EditUserDialog({ open, onOpenChange, userId }) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  })

  useEffect(() => {
    const fetchUser = async () => {
      if (userId && open) {
        try {
          const token = localStorage.getItem('authToken')
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`, {
            headers: {
              Authorization: `token ${token}`
            }
          })

          if (response.data !== null) {
            const userData = response.data
            form.reset({
              username: userData.username,
              email: userData.email,
            })
          }
        } catch (error) {
          console.error('Error fetching user:', error)
          toast({
            title: "Error!",
            description: "Failed to fetch user data.",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      }
    }

    fetchUser()
    // Reset form when dialog closes
    return () => {
      if (!open) {
        form.reset({
          username: "",
          email: "",
        })
        setLoading(true)
      }
    }
  }, [userId, open, form, toast])

  async function onSubmit(values) {
    try {
      const token = localStorage.getItem('authToken')
      
      await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}/`, {
        username: values.username,
        email: values.email,
      }, {
        headers: {
          'Authorization': `token ${token}`
        }
      })

      toast({
        title: "Success!",
        description: "User updated successfully.",
        variant: "default",
      })

      onOpenChange(false)
      // Replace window.location.reload() with a more React-friendly approach
      window.dispatchEvent(new CustomEvent('userUpdated'))
      
    } catch (error) {
      console.error('Error updating user:', error)
      toast({
        title: "Error!",
        description: error.response?.data?.message || "Failed to update user. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[80vh] overflow-y-auto border-gray-800 p-0">
        <DialogHeader className="relative px-6 py-4">
          <DialogTitle className="text-xl font-semibold">Edit User</DialogTitle>
          <DialogDescription className="text-gray-400 text-sm">
            Make changes to the user here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="p-6">Loading...</div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 pb-6">
              <div className="space-y-3 py-2">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-[120px_1fr] items-center gap-2">
                      <FormLabel className="text-sm text-right">Username</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          className="border border-gray-200 dark:border-gray-800 h-9 text-sm placeholder:text-gray-500" 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-[120px_1fr] items-center gap-2">
                      <FormLabel className="text-sm text-right">Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          {...field}
                          className="border border-gray-200 dark:border-gray-800 h-9 text-sm placeholder:text-gray-500" 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-4 flex justify-end py-4 bg-opacity-20">
                <Button 
                  type="submit" 
                  className="h-9 px-4 text-sm dark:bg-white dark:text-black hover:bg-gray-800 bg-black text-white dark:hover:bg-gray-200"
                >
                  Save changes
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}