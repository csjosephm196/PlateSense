import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function GlucoseChart({ meals }) {
  const last7 = (meals || []).slice(0, 7).reverse();
  const labels = last7.map((m) => new Date(m.timestamp).toLocaleDateString('en-US', { weekday: 'short' }));
  const carbsData = last7.map((m) => m.total_carbs ?? 0);

  const data = {
    labels,
    datasets: [
      {
        label: 'Carbs (g)',
        data: carbsData,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  if (last7.length === 0) {
    return <p className="text-slate-500 py-8 text-center">No meal history yet</p>;
  }

  return <Line data={data} options={options} />;
}
