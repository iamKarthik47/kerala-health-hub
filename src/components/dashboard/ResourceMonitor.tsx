
import React from 'react';
import { motion } from 'framer-motion';
import { Package, ShieldAlert, ArrowRight } from 'lucide-react';

interface ResourceData {
  name: string;
  available: number;
  total: number;
  critical: boolean;
  district: string;
}

interface ResourceMonitorProps {
  resources: ResourceData[];
  delay?: number;
}

const ResourceMonitor: React.FC<ResourceMonitorProps> = ({ resources, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-gray-900 font-medium flex items-center">
            <Package className="h-4 w-4 mr-2 text-health-600" />
            Critical Resources Monitor
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            Resource availability across facilities
          </p>
        </div>
        <button className="text-health-600 hover:text-health-700 text-sm font-medium flex items-center">
          View all
          <ArrowRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      <div className="space-y-4">
        {resources.map((resource, index) => {
          const availabilityPercentage = (resource.available / resource.total) * 100;
          
          return (
            <motion.div
              key={resource.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: delay + (index * 0.1) }}
              className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <h4 className="text-gray-900 font-medium">{resource.name}</h4>
                    {resource.critical && (
                      <div className="ml-2 bg-rose-100 rounded-full p-1">
                        <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
                      </div>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs mt-1">{resource.district} District</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {resource.available} / {resource.total}
                  </div>
                  <div className="text-xs text-gray-500">Available Units</div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500">Availability</span>
                  <span className={`text-xs font-medium ${
                    availabilityPercentage < 30 ? 'text-rose-600' : 
                    availabilityPercentage < 60 ? 'text-amber-600' : 'text-emerald-600'
                  }`}>{Math.round(availabilityPercentage)}%</span>
                </div>
                <div className="bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <motion.div 
                    className={`h-full rounded-full ${
                      availabilityPercentage < 30 ? 'bg-rose-500' : 
                      availabilityPercentage < 60 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${availabilityPercentage}%` }}
                    transition={{ duration: 0.8, delay: delay + index * 0.1 + 0.3, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ResourceMonitor;
