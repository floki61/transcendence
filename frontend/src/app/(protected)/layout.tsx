import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { UserProvider } from "@/context/userContext"
import { ChatProvider } from "@/context/chatSocket";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <UserProvider>
      <ChatProvider>
        <div className="flex flex-col h-full bg-background text-white">
            <Navbar />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="h-full flex-1 overflow-x-hidden overflow-auto">{children}</main>
          </div>
        </div>
      </ChatProvider>
    </UserProvider>
  )
}
