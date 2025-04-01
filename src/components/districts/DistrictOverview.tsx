
import React from 'react';
import { Map } from 'lucide-react';
import DistrictCard from './DistrictCard';

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

interface DistrictOverviewProps {
  filteredDistricts: DistrictData[];
  hospitalData: HospitalData[];
}

const DistrictOverview: React.FC<DistrictOverviewProps> = ({ filteredDistricts, hospitalData }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDistricts.map((district) => {
          const districtHospitals = hospitalData.filter(hospital => hospital.district === district.name);
          const totalBeds = districtHospitals.reduce((sum, hospital) => sum + hospital.bedCapacity, 0);
          const availableBeds = districtHospitals.reduce((sum, hospital) => sum + hospital.availableBeds, 0);
          
          return (
            <DistrictCard 
              key={district.name}
              district={district}
              districtHospitals={districtHospitals}
              totalBeds={totalBeds}
              availableBeds={availableBeds}
            />
          );
        })}
      </div>
      
      {filteredDistricts.length === 0 && (
        <div className="text-center py-12">
          <Map className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No districts found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search</p>
        </div>
      )}
    </div>
  );
};

export default DistrictOverview;
