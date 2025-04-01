
import React from 'react';

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

interface DistrictComparisonProps {
  filteredDistricts: DistrictData[];
  hospitalData: HospitalData[];
}

const DistrictComparison: React.FC<DistrictComparisonProps> = ({ filteredDistricts, hospitalData }) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">District Comparison</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3">District</th>
              <th scope="col" className="px-4 py-3">Total Cases</th>
              <th scope="col" className="px-4 py-3">Active Cases</th>
              <th scope="col" className="px-4 py-3">Recovery %</th>
              <th scope="col" className="px-4 py-3">Hospitals</th>
              <th scope="col" className="px-4 py-3">Bed Capacity</th>
              <th scope="col" className="px-4 py-3">Bed Availability %</th>
            </tr>
          </thead>
          <tbody>
            {filteredDistricts.map((district) => {
              const districtHospitals = hospitalData.filter(hospital => hospital.district === district.name);
              const totalBeds = districtHospitals.reduce((sum, hospital) => sum + hospital.bedCapacity, 0);
              const availableBeds = districtHospitals.reduce((sum, hospital) => sum + hospital.availableBeds, 0);
              const bedAvailabilityPercentage = totalBeds > 0 ? (availableBeds / totalBeds) * 100 : 0;
              const recoveryRate = district.cases > 0 ? (district.recovered / district.cases) * 100 : 0;
              
              return (
                <tr key={district.name} className="border-b bg-white">
                  <td className="px-4 py-3 font-medium text-gray-900">{district.name}</td>
                  <td className="px-4 py-3">{district.cases.toLocaleString()}</td>
                  <td className="px-4 py-3">{district.active.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      recoveryRate > 90 ? 'bg-emerald-100 text-emerald-800' : 
                      recoveryRate > 75 ? 'bg-blue-100 text-blue-800' : 
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {recoveryRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3">{districtHospitals.length}</td>
                  <td className="px-4 py-3">{totalBeds}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      bedAvailabilityPercentage > 30 ? 'bg-emerald-100 text-emerald-800' : 
                      bedAvailabilityPercentage > 15 ? 'bg-amber-100 text-amber-800' : 
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {bedAvailabilityPercentage.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DistrictComparison;
