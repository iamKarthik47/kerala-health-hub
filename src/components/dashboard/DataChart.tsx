
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  LineChart,
  Line
} from 'recharts';

type ChartType = 'area' | 'bar' | 'line';

interface DataPoint {
  name: string;
  [key: string]: string | number;
}

interface DataChartProps {
  title: string;
  subtitle?: string;
  data: DataPoint[];
  dataKeys: { key: string; color: string; name?: string }[];
  type?: ChartType;
  aspectRatio?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  delay?: number;
}

const DataChart: React.FC<DataChartProps> = ({
  title,
  subtitle,
  data,
  dataKeys,
  type = 'area',
  aspectRatio = 3,
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  delay = 0
}) => {
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  
  useEffect(() => {
    // Animate data loading
    let tempData: DataPoint[] = [];
    const interval = setInterval(() => {
      if (tempData.length < data.length) {
        tempData = [...data.slice(0, tempData.length + 1)];
        setChartData(tempData);
      } else {
        clearInterval(interval);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [data]);

  const renderChart = () => {
    switch (type) {
      case 'area':
        return (
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />}
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12 }} 
              dx={-10}
            />
            {showTooltip && <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                border: '1px solid #f1f5f9',
              }} 
            />}
            {dataKeys.map(({key, color, name}, index) => (
              <Area 
                key={key}
                type="monotone" 
                dataKey={key} 
                name={name || key}
                stroke={color} 
                fill={color} 
                fillOpacity={0.2} 
                strokeWidth={2}
                animationDuration={1500}
                animationEasing="ease-out"
              />
            ))}
            {showLegend && <Legend wrapperStyle={{ paddingTop: '20px' }} />}
          </AreaChart>
        );
      
      case 'bar':
        return (
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />}
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12 }} 
              dx={-10}
            />
            {showTooltip && <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                border: '1px solid #f1f5f9',
              }} 
            />}
            {dataKeys.map(({key, color, name}, index) => (
              <Bar 
                key={key}
                dataKey={key} 
                name={name || key}
                fill={color} 
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
                animationEasing="ease-out"
              />
            ))}
            {showLegend && <Legend wrapperStyle={{ paddingTop: '20px' }} />}
          </BarChart>
        );
        
      case 'line':
        return (
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />}
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12 }} 
              dx={-10}
            />
            {showTooltip && <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                border: '1px solid #f1f5f9',
              }} 
            />}
            {dataKeys.map(({key, color, name}, index) => (
              <Line 
                key={key}
                type="monotone" 
                dataKey={key} 
                name={name || key}
                stroke={color} 
                strokeWidth={2}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ fill: color, strokeWidth: 2, r: 6 }}
                animationDuration={1500}
                animationEasing="ease-out"
              />
            ))}
            {showLegend && <Legend wrapperStyle={{ paddingTop: '20px' }} />}
          </LineChart>
        );
      
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className="mb-4">
        <h3 className="text-gray-900 font-medium">{title}</h3>
        {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
      </div>

      <div className="w-full" style={{ aspectRatio: aspectRatio.toString() }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default DataChart;
