import { ReactNode } from 'react';

interface MetricTooltipProps {
  children: ReactNode;
  title: string;
  description: string;
  threshold?: string;
}

export const MetricTooltip = ({ children, title, description, threshold }: MetricTooltipProps) => {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
        <div className="font-semibold mb-1">{title}</div>
        <div className="text-gray-300 mb-2">{description}</div>
        {threshold && (
          <div className="text-yellow-300 text-xs">
            💡 Optimal: {threshold}
          </div>
        )}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
};