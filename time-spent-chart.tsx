"use client"

import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

const data = {
  datasets: [
    {
      data: [36, 12],
      backgroundColor: ["#0066FF", "#FFD700"],
      borderWidth: 0,
    },
  ],
}

const options = {
  cutout: "70%",
  plugins: {
    legend: {
      display: false,
    },
  },
}

export default function TimeSpentChart() {
  return (
    <div>
      <div className="relative aspect-square w-40 mx-auto">
        <Doughnut data={data} options={options} />
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-blue-600" />
          <div className="flex-1">
            <div className="text-sm">Researching</div>
            <div className="text-sm font-medium">36 Hours</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-yellow-400" />
          <div className="flex-1">
            <div className="text-sm">Designing</div>
            <div className="text-sm font-medium">12 Hours</div>
          </div>
        </div>
      </div>
    </div>
  )
}

