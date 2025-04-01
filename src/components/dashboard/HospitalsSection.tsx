
import React from 'react';
import { Building, ChevronRight, Map } from 'lucide-react';
import HospitalCard from './HospitalCard';
import { Link } from 'react-router-dom';

interface HospitalData {
  id: number;
  name: string;
  type: string;
  location: string;
  district: string;
  bedCapacity: number;
  availableBeds: number;
  occupancyRate: number;
  patientCount: number;
  status: "operational" | "partial" | "critical";
  doctors: number;
  availableDoctors: number;
  staff: number;
  availableStaff: number;
  facilities: string[];
  specialties: string[];
}

interface DistrictData {
  name: string;
  cases: number;
  recovered: number;
  active: number;
  deceased: number;
}

interface HospitalsSectionProps {
  hospitalData: HospitalData[];
  districtData?: DistrictData[];
}

const HospitalsSection: React.FC<HospitalsSectionProps> = ({ hospitalData, districtData = [] }) => {
  // Get top 3 districts by active cases
  const topDistricts = [...districtData]
    .sort((a, b) => b.active - a.active)
    .slice(0, 3);

  return (
    <section className="px-6 md:px-10 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-medium text-gray-900 flex items-center">
              <Building className="h-5 w-5 mr-2 text-health-600" />
              Hospital Status
            </h2>
            <p className="text-gray-500 mt-1">Current operational status of key medical facilities</p>
          </div>
          <Link to="/hospitals" className="text-health-600 hover:text-health-700 text-sm font-medium flex items-center">
            View all hospitals
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hospitalData.slice(0, 4).map((hospital, index) => {
            // Ensure the status is of the correct type
            const validStatus: "operational" | "partial" | "critical" = 
              (hospital.status === "operational" || hospital.status === "partial" || hospital.status === "critical") 
                ? hospital.status as "operational" | "partial" | "critical"
                : "operational";
                
            return (
              <HospitalCard
                key={hospital.id}
                name={hospital.name}
                type={hospital.type}
                location={hospital.location}
                district={hospital.district}
                bedCapacity={hospital.bedCapacity}
                availableBeds={hospital.availableBeds}
                occupancyRate={hospital.occupancyRate}
                patientCount={hospital.patientCount}
                status={validStatus}
                delay={0.1 + (index * 0.1)}
                doctors={hospital.doctors || 0}
                availableDoctors={hospital.availableDoctors || 0}
                staff={hospital.staff || 0}
                availableStaff={hospital.availableStaff || 0}
                facilities={hospital.facilities || []}
                specialties={hospital.specialties || []}
              />
            );
          })}
        </div>

        {districtData.length > 0 && (
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-medium text-gray-900 flex items-center">
                  <Map className="h-5 w-5 mr-2 text-health-600" />
                  District Highlights
                </h2>
                <p className="text-gray-500 mt-1">Key districts requiring attention</p>
              </div>
              <Link to="/hospitals?tab=districtsDetails" className="text-health-600 hover:text-health-700 text-sm font-medium flex items-center">
                View all districts
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topDistricts.map((district) => {
                const districtHospitals = hospitalData.filter(h => h.district === district.name);
                const operationalCount = districtHospitals.filter(h => h.status === 'operational').length;
                const criticalCount = districtHospitals.filter(h => h.status === 'critical').length;
                
                return (
                  <div key={district.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-gray-900">{district.name}</h3>
                      <span className="bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded-full">
                        {district.active} active cases
                      </span>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Hospitals</div>
                        <div className="mt-1 text-2xl font-semibold">{districtHospitals.length}</div>
                        <div className="mt-1 text-xs">
                          <span className="text-emerald-600">{operationalCount} operational</span>
                          {criticalCount > 0 && (
                            <span className="text-rose-600 ml-2">{criticalCount} critical</span>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-500">Recovery Rate</div>
                        <div className="mt-1 text-2xl font-semibold">
                          {((district.recovered / district.cases) * 100).toFixed(1)}%
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {district.recovered.toLocaleString()} of {district.cases.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <Link 
                      to={`/hospitals?district=${district.name}`} 
                      className="mt-4 text-sm text-health-600 hover:text-health-700 flex items-center"
                    >
                      View district details
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HospitalsSection;
