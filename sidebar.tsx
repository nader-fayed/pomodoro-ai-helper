import { LayoutGrid, Calendar, PieChart, MessageSquare, FolderGit2, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Sidebar() {
  return (
    <div className="w-64 border-r bg-white p-6">
      <div className="flex items-center gap-2 mb-8">
        <div className="h-8 w-8 rounded bg-blue-600" />
        <span className="font-semibold">projack</span>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-lg bg-slate-50 p-4">
        <div className="h-8 w-8 rounded-full bg-blue-600" />
        <div className="flex-1">
          <div className="font-medium">Alpaca.studio</div>
          <div className="text-xs text-muted-foreground">https://alpaca.com</div>
        </div>
      </div>

      <div className="space-y-2">
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
      </div>

      <div className="mt-auto pt-4">
        <Button variant="ghost" className="w-full justify-start gap-2">
          <LogOut className="h-5 w-5" /> Logout
        </Button>
      </div>

      <Card className="mt-6 bg-blue-600 text-white">
        <div className="p-4">
          <h4 className="font-semibold">Contact support</h4>
          <p className="mb-4 text-sm text-blue-200">Let us know if you have any questions or inquiries</p>
          <Button variant="secondary" className="w-full" size="sm">
            Contact us
          </Button>
        </div>
      </Card>
    </div>
  )
}

