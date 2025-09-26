import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RewardsChartProps {
  data: Array<{
    epoch: number;
    rewards: number;
    commission: number;
  }>;
}

export const RewardsChart = ({ data }: RewardsChartProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        💰 Rewards Timeline
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="epoch" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value} SOL`, 'Rewards']} />
          <Area type="monotone" dataKey="rewards" stroke="#f59e0b" fill="#fbbf24" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};