import Link from "next/link"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { UserProvider } from "@/context/userContext"

interface userType {
  id: string;
  email: string;
  picture: string;
  firstName: string;
  lastName: string;
  userName: string;
}


export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <UserProvider>
        <div className="flex flex-col h-full bg-background text-white">
            <Navbar />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="h-full flex-1 overflow-x-hidden overflow-auto">{children}</main>
          </div>
        </div>
    </UserProvider>
  )
}
