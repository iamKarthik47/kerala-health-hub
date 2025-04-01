
import React from 'react';
import { Map } from 'lucide-react';

const DistrictLoading: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin-slow">
          <Map className="h-12 w-12 text-health-500" />
        </div>
        <p className="mt-4 text-gray-600 animate-pulse">Loading district data...</p>
      </div>
    </div>
  );
};

export default DistrictLoading;
