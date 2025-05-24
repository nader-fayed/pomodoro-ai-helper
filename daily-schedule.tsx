export default function DailySchedule() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const hours = ["17:00", "12:00", "09:00", "08:00"]
  const schedule = {
    Mon: [9, 12, 17],
    Tue: [8, 12],
    Wed: [9, 17],
    Thu: [12],
    Fri: [9, 12, 17],
    Sat: [8, 17],
  }

  return (
    <div className="relative">
      <div className="absolute left-16 right-0 flex justify-between">
        {days.map((day) => (
          <div key={day} className="text-sm text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      <div className="mt-8">
        {hours.map((hour) => (
          <div key={hour} className="flex items-center mb-6">
            <div className="w-16 text-sm text-muted-foreground">{hour}</div>
            <div className="flex-1 flex justify-between">
              {days.map((day) => (
                <div key={`${day}-${hour}`} className="flex items-center justify-center">
                  {schedule[day as keyof typeof schedule].includes(Number.parseInt(hour)) && (
                    <div className="h-3 w-3 rounded-full bg-blue-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

