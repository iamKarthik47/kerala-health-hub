
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import AnimatedCounter from '../ui/AnimatedCounter';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  prefix?: string;
  suffix?: string;
  color?: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon,
  description, 
  trend, 
  prefix = '', 
  suffix = '',
  color = 'health',
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
          <div className="flex items-baseline">
            <AnimatedCounter 
              value={value} 
              prefix={prefix} 
              suffix={suffix} 
              className="text-2xl text-gray-900"
            />
            
            {trend && (
              <span 
                className={`ml-2 text-xs font-medium ${
                  trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {trend.isPositive ? '+' : '-'}{trend.value}%
              </span>
            )}
          </div>
          {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </div>
        
        <div className={`bg-${color}-100 p-2.5 rounded-lg`}>
          <Icon className={`h-5 w-5 text-${color}-600`} />
        </div>
      </div>
      
      <motion.div 
        className={`h-1 bg-${color}-100 rounded-full mt-4 overflow-hidden`}
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 0.8, delay: delay + 0.3 }}
      >
        <motion.div 
          className={`h-full bg-${color}-500 rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(value / 10, 100)}%` }}
          transition={{ duration: 0.5, delay: delay + 0.5 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default StatCard;
