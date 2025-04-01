
import React from 'react';
import { MapPin, Activity, Users, Filter } from 'lucide-react';

interface DistrictData {
  name: string;
  cases: number;
  recovered: number;
  active: number;
  deceased: number;
}

interface HospitalData {
  id: number;
  name: string;
  district: string;
  bedCapacity: number;
  availableBeds: number;
  [key: string]: any;
}

interface DistrictStatsProps {
  districtData: DistrictData[];
  hospitalData: HospitalData[];
}

const DistrictStats: React.FC<DistrictStatsProps> = ({ districtData, hospitalData }) => {
  return (
    <section className="px-6 md:px-10 py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-medium text-gray-900">District Health Overview</h2>
          <p className="text-gray-500 mt-1">Key statistics across all districts</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-health-600 mb-2">
              <MapPin className="h-6 w-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{districtData.length}</div>
            <div className="text-gray-500 text-sm">Total Districts</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-amber-600 mb-2">
              <Activity className="h-6 w-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {districtData.reduce((sum, district) => sum + district.cases, 0).toLocaleString()}
            </div>
            <div className="text-gray-500 text-sm">Total Cases</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-emerald-600 mb-2">
              <Users className="h-6 w-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {districtData.reduce((sum, district) => sum + district.recovered, 0).toLocaleString()}
            </div>
            <div className="text-gray-500 text-sm">Total Recovered</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-rose-600 mb-2">
              <Filter className="h-6 w-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {hospitalData.reduce((sum, hospital) => sum + hospital.bedCapacity, 0).toLocaleString()}
            </div>
            <div className="text-gray-500 text-sm">Total Bed Capacity</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DistrictStats;
