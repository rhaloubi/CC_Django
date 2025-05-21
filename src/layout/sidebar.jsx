import {   Settings, UserPen, GalleryVerticalEnd } from 'lucide-react'
import { useEffect, useState } from "react";
import axios from "axios";
import { NavMain } from "@/components/sidebar/nav-main"
import { NavUser } from "@/components/sidebar/nav-user"
import { TeamSwitcher } from "@/components/sidebar/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { SidebarNav } from "@/components/sidebar/nav-dash"

const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],

  others: [
    {
      title: "Settings",
      url: "",
      icon: Settings,
      isActive: false,
      items: [
        { title: "Profile", url: "profile", icon: UserPen },
      ],
    },
  ]
}

export function AppSidebar({ ...props }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
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

        if (response.data) {
          setUserData({ data: response.data });
        } else {
          setError('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Sidebar collapsible="icon" {...props} className="border-r-0">
      <SidebarHeader className="relative h-16 px-2 py-4">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarNav />
        <NavMain items={data.others} />
      </SidebarContent>
      <SidebarFooter className="pb-3">
        {loading ? (
          <div>Loading user data...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <NavUser user={userData} />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}


