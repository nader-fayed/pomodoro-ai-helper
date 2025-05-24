import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface UserCardProps {
  name: string
  company: string
  completed: number
  total: number
  image: string
}

export default function UserCard({ name, company, completed, total, image }: UserCardProps) {
  const progress = (completed / total) * 100

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar>
            <AvatarImage src={image} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{name}</h3>
            <p className="text-sm text-muted-foreground">{company}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            {completed} from {total} task completed
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}

