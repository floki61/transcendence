import Link from "next/link"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"

import {GameProvider} from "@/context/gameSocket"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <GameProvider>
      <div className="flex flex-col h-full bg-background text-white">
          <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="h-full flex-1 overflow-x-hidden overflow-auto">{children}</main>
        </div>
      </div>
    </GameProvider>
  )
}