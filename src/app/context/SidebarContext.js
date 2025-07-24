"use client"  

import { createContext, useContext, useState } from "react"
import { Sidebar } from "app/components/Sidebar/Sidebar"

 const SidebarContext = createContext(null)

 export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)

   const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const closeSidebar = () => {
    setIsOpen(false)
  }

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar , closeSidebar }}>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1">{children}</div>
      </div>
    </SidebarContext.Provider>
  )
}

 export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
