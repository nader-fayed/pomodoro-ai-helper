import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Zap } from "lucide-react"

interface QuickRecapProps {
  xp: number
  efficiency: number
}

export function QuickRecap({ xp, efficiency }: QuickRecapProps) {
  return (
    <Card className="bg-blue-600 text-white">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-6">Quick Recap</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold">{xp} XP</div>
              <div className="text-sm text-blue-200">Your progress</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold">{efficiency.toFixed(1)}%</div>
              <div className="text-sm text-blue-200">Time efficiency</div>
            </div>
          </div>
        </div>
        <Button className="w-full mt-6" variant="secondary">
          Optimize
        </Button>
      </CardContent>
    </Card>
  )
}

