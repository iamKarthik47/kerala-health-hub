
import React from 'react';
import { Map, Activity, Building } from 'lucide-react';

const DistrictLoading: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-4">
          <div className="inline-block animate-spin-slow">
            <Map className="h-10 w-10 text-health-500" />
          </div>
          <div className="inline-block animate-pulse">
            <Activity className="h-8 w-8 text-health-600" />
          </div>
          <div className="inline-block animate-bounce">
            <Building className="h-10 w-10 text-health-400" />
          </div>
        </div>
        <p className="mt-4 text-gray-600 animate-pulse">Loading district health data...</p>
        <p className="text-sm text-gray-500">Preparing detailed reports</p>
      </div>
    </div>
  );
};

export default DistrictLoading;
