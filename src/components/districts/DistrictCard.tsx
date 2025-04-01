
import React from 'react';
import { Activity, Users, Building } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface DistrictCardProps {
  district: {
    name: string;
    cases: number;
    recovered: number;
    active: number;
  };
  districtHospitals: any[];
  totalBeds: number;
  availableBeds: number;
}

const DistrictCard: React.FC<DistrictCardProps> = ({ 
  district, 
  districtHospitals, 
  totalBeds, 
  availableBeds 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-6"
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-900">{district.name}</h3>
        <div className="bg-health-50 text-health-700 px-2 py-0.5 rounded text-sm">
          {districtHospitals.length} Hospitals
        </div>
      </div>
      
      <div className="mt-4 space-y-3">
        <div className="flex items-center">
          <Activity className="h-4 w-4 text-health-600 mr-2" />
          <div className="flex-1">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Cases</span>
              <span className="font-medium">{district.cases.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <Users className="h-4 w-4 text-emerald-500 mr-2" />
          <div className="flex-1">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Recovered</span>
              <span className="font-medium text-emerald-600">{district.recovered.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <Activity className="h-4 w-4 text-amber-500 mr-2" />
          <div className="flex-1">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Active Cases</span>
              <span className="font-medium text-amber-600">{district.active.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <Building className="h-4 w-4 text-blue-500 mr-2" />
          <div className="flex-1">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Hospital Beds</span>
              <span className="font-medium">{availableBeds} / {totalBeds}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Button variant="outline" className="w-full" asChild>
          <a href={`#district-${district.name}`}>View Details</a>
        </Button>
      </div>
    </motion.div>
  );
};

export default DistrictCard;
