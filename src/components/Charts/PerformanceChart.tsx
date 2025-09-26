import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PerformanceChartProps {
  data: Array<{
    epoch: number;
    blockProduction: number;
    voteSuccess: number;
    uptime: number;
  }>;
}

export const PerformanceChart = ({ data }: PerformanceChartProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        📈 Performance History
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="epoch" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="blockProduction" stroke="#10b981" name="Block Production %" />
          <Line type="monotone" dataKey="voteSuccess" stroke="#3b82f6" name="Vote Success %" />
          <Line type="monotone" dataKey="uptime" stroke="#8b5cf6" name="Uptime %" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};