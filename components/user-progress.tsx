import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface UserProgressProps {
  user: {
    name: string
    company: string
    completed: number
    total: number
    image: string
  }
}

export function UserProgress({ user }: UserProgressProps) {
  const progress = (user.completed / user.total) * 100

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar>
            <AvatarImage src={user.image} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.company}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            {user.completed} from {user.total} task completed
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}

