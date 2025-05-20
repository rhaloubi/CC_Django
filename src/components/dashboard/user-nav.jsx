"use client"
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react' // Add useState
import axios from 'axios' // Add axios import
import {  BadgeCheck, LogOut, LayoutDashboard, User } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function UserNav() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/me/`, {
          headers: {
            Authorization: `token ${token}`,
          },
        });

        if (response.data.success) {
          setUserData(response.data);
        } else {
          setError('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.shiftKey && event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'p':
            navigate('/profile')
            break
          case 'b':
            navigate('/account')
            break
          case 'd':
            navigate('/dashboard')
            break
          case 'z':
            handleLogout()
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  const handleLogout = async () => {
    try {
     
      localStorage.removeItem('authToken')
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const userInitials = userData?.username ? userData.username.substring(0, 2).toUpperCase() : 'UN';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt={userData?.username} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userData?.username}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userData?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/account')}>
            <BadgeCheck className="mr-2 h-4 w-4" />
            <span>Account</span>
            <DropdownMenuShortcut>⇧⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/dashboard')}>
            <LayoutDashboard  className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
            <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Z</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


