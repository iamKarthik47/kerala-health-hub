
import React from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';

interface DiseaseData {
  name: string;
  cases: number;
  trend: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
}

interface DiseaseTrackerProps {
  diseases: DiseaseData[];
  delay?: number;
}

const DiseaseTracker: React.FC<DiseaseTrackerProps> = ({ diseases, delay = 0 }) => {
  const severityConfig = {
    low: { color: 'emerald', text: 'Low Severity' },
    medium: { color: 'amber', text: 'Medium Severity' },
    high: { color: 'orange', text: 'High Severity' },
    critical: { color: 'rose', text: 'Critical Severity' },
  };

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
            <AlertOctagon className="h-4 w-4 mr-2 text-health-600" />
            Disease Outbreak Tracker
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            Current diseases under monitoring
          </p>
        </div>
        <button className="text-health-600 hover:text-health-700 text-sm font-medium flex items-center">
          View all
          <ArrowRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      <div className="overflow-hidden">
        <div className="border-b border-gray-100 pb-2 mb-2 grid grid-cols-12 text-xs font-medium text-gray-500">
          <div className="col-span-4">Disease</div>
          <div className="col-span-2 text-right">Cases</div>
          <div className="col-span-2 text-right">Trend</div>
          <div className="col-span-2">Severity</div>
          <div className="col-span-2">Location</div>
        </div>

        <div className="space-y-3">
          {diseases.map((disease, index) => {
            const severityInfo = severityConfig[disease.severity];
            
            return (
              <motion.div
                key={disease.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: delay + (index * 0.1) }}
                className="grid grid-cols-12 items-center py-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="col-span-4 font-medium text-gray-900">
                  {disease.name}
                </div>
                <div className="col-span-2 text-right font-medium text-gray-900">
                  {disease.cases.toLocaleString()}
                </div>
                <div className={`col-span-2 text-right font-medium flex items-center justify-end ${
                  disease.trend > 0 ? 'text-rose-600' : 'text-emerald-600'
                }`}>
                  {disease.trend > 0 ? (
                    <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 mr-1.5" />
                  )}
                  {Math.abs(disease.trend)}%
                </div>
                <div className="col-span-2">
                  <span className={`inline-flex rounded-full bg-${severityInfo.color}-100 px-2 py-0.5 text-xs font-medium text-${severityInfo.color}-800`}>
                    {severityInfo.text}
                  </span>
                </div>
                <div className="col-span-2 text-gray-500 text-sm">
                  {disease.location}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default DiseaseTracker;
