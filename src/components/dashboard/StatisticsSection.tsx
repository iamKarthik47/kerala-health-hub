
import React from 'react';
import StatCard from './StatCard';
import { LucideIcon } from 'lucide-react';

interface StatisticItem {
  id: string;
  title: string;
  value: number;
  icon: LucideIcon;
  description: string;
  color: string;
  trend: {
    value: number;
    isPositive: boolean;
  };
  suffix?: string;
  prefix?: string;
}

interface StatisticsSectionProps {
  statistics: StatisticItem[];
}

const StatisticsSection: React.FC<StatisticsSectionProps> = ({ statistics }) => {
  return (
    <section className="px-6 md:px-10 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statistics.map((stat, index) => (
            <StatCard
              key={stat.id}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              description={stat.description}
              trend={stat.trend}
              suffix={stat.suffix}
              prefix={stat.prefix}
              color={stat.color}
              delay={0.1 + (index * 0.1)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
