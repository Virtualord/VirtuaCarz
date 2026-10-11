import React from 'react'
import Menus from './Menus'

const Layout = ({ children, title = "Admin Portal" }) => {
  return (
    <div className="flex min-h-screen bg-[#141414] text-[#f5f5f5]">
      {/* Left Sidebar Menu */}
      <aside className="w-64 shrink-0 sticky top-0 h-screen bg-[#1c1c1c] border-r border-[#2a2a2a] z-30">
        <Menus />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center border-b border-[#2a2a2a] bg-[#181818]/90 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-semibold text-[#f5f5f5]">{title}</h1>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
