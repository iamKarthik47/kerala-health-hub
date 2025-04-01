
import React from 'react';
import { Building, ChevronRight } from 'lucide-react';
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

interface HospitalsSectionProps {
  hospitalData: HospitalData[];
}

const HospitalsSection: React.FC<HospitalsSectionProps> = ({ hospitalData }) => {
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
      </div>
    </section>
  );
};

export default HospitalsSection;
