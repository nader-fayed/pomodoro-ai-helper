"use client"

import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const data = {
  labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      data: [1000, 1500, 1200, 1800, 1400, 1100],
      borderColor: "#0066FF",
      backgroundColor: "#0066FF",
      tension: 0.4,
      pointRadius: 0,
    },
  ],
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value: number) => `$${value}`,
      },
    },
  },
}

export default function ProfitChart() {
  return <Line data={data} options={options} />
}

