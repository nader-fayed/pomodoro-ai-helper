import { LayoutGrid, Calendar, PieChart, MessageSquare, FolderGit2, LogOut, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className={cn(
      "border-r bg-white flex flex-col h-screen transition-all duration-300",
      isExpanded ? "w-64 p-6" : "w-[70px] p-2"
    )}>
      <div className="flex items-center gap-2 mb-8 relative">
        <img src="/brain-clock-logo.svg" alt="Brain Clock Logo" className="h-8 w-8" />
        <span className={cn("font-semibold transition-opacity duration-300", 
          isExpanded ? "opacity-100" : "opacity-0 absolute"
        )}>Focus Quest</span>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute right-0 top-0 transition-transform",
            !isExpanded && "rotate-180"
          )}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-lg bg-slate-50 p-4">
        <div className="h-8 w-8 rounded-full bg-blue-600" />
        <div className="flex-1">
          <div className="font-medium">Alpaca.studio</div>
          <div className="text-xs text-muted-foreground">https://alpaca.com</div>
        </div>
      </div>

      <nav className="space-y-2">
        <Button variant="ghost" className="w-full justify-start gap-2">
          <LayoutGrid className="h-5 w-5" /> Dashboard
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <Calendar className="h-5 w-5" /> Schedule
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <PieChart className="h-5 w-5" /> Finance
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <MessageSquare className="h-5 w-5" /> Messages
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <FolderGit2 className="h-5 w-5" /> Portfolio
        </Button>
      </nav>

      <div className="mt-auto pt-4">
        <Button variant="ghost" className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50">
          <LogOut className="h-5 w-5" /> Logout
        </Button>
      </div>
    </div>
  )
}

