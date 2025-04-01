
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, ChevronDown, ChevronUp, Activity, Building, Users, Bed, HeartPulse, ArrowUpRight, ArrowDownRight, ChevronRight } from 'lucide-react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

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

interface DistrictDetailsProps {
  districtData: DistrictData[];
  hospitalData: HospitalData[];
}

const DistrictDetails: React.FC<DistrictDetailsProps> = ({ districtData, hospitalData }) => {
  const [expandedDistrict, setExpandedDistrict] = useState<string | null>(null);

  const toggleDistrict = (districtName: string) => {
    if (expandedDistrict === districtName) {
      setExpandedDistrict(null);
    } else {
      setExpandedDistrict(districtName);
    }
  };

  const getDistrictHospitals = (districtName: string) => {
    return hospitalData.filter(hospital => hospital.district === districtName);
  };

  const calculateDistrictStats = (districtName: string) => {
    const hospitals = getDistrictHospitals(districtName);
    
    const totalBeds = hospitals.reduce((sum, hospital) => sum + hospital.bedCapacity, 0);
    const availableBeds = hospitals.reduce((sum, hospital) => sum + hospital.availableBeds, 0);
    const totalDoctors = hospitals.reduce((sum, hospital) => sum + hospital.doctors, 0);
    const availableDoctors = hospitals.reduce((sum, hospital) => sum + hospital.availableDoctors, 0);
    const totalStaff = hospitals.reduce((sum, hospital) => sum + hospital.staff, 0);
    const availableStaff = hospitals.reduce((sum, hospital) => sum + hospital.availableStaff, 0);
    const averageOccupancy = hospitals.length > 0 
      ? hospitals.reduce((sum, hospital) => sum + hospital.occupancyRate, 0) / hospitals.length
      : 0;
    
    return {
      totalHospitals: hospitals.length,
      totalBeds,
      availableBeds,
      totalDoctors,
      availableDoctors,
      totalStaff,
      availableStaff,
      averageOccupancy,
      operationalCount: hospitals.filter(h => h.status === 'operational').length,
      partialCount: hospitals.filter(h => h.status === 'partial').length,
      criticalCount: hospitals.filter(h => h.status === 'critical').length,
      specialtiesCount: new Set(hospitals.flatMap(h => h.specialties)).size,
    };
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-medium text-gray-900 flex items-center">
          <Map className="h-5 w-5 mr-2 text-health-600" />
          District Health Infrastructure
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {districtData.map((district) => {
          const stats = calculateDistrictStats(district.name);
          
          return (
            <motion.div
              key={district.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 flex justify-between">
                  {district.name}
                  <span className="text-sm bg-health-50 text-health-700 px-2 py-0.5 rounded">
                    {stats.totalHospitals} hospitals
                  </span>
                </h3>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Activity className="h-4 w-4 mr-1 text-health-600" />
                      Case Statistics
                    </div>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Total Cases</span>
                        <span className="text-sm font-medium">{district.cases.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Recovered</span>
                        <span className="text-sm font-medium text-emerald-600">{district.recovered.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Active</span>
                        <span className="text-sm font-medium text-amber-600">{district.active.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Deceased</span>
                        <span className="text-sm font-medium text-rose-600">{district.deceased.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Building className="h-4 w-4 mr-1 text-health-600" />
                      Hospital Status
                    </div>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Operational</span>
                        <span className="text-sm font-medium text-emerald-600">{stats.operationalCount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Partial</span>
                        <span className="text-sm font-medium text-amber-600">{stats.partialCount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Critical</span>
                        <span className="text-sm font-medium text-rose-600">{stats.criticalCount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Specialties</span>
                        <span className="text-sm font-medium">{stats.specialtiesCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-gray-500">Bed Occupancy</span>
                    <span className={`text-xs font-medium ${
                      stats.averageOccupancy > 90 ? 'text-rose-600' : 
                      stats.averageOccupancy > 70 ? 'text-amber-600' : 'text-emerald-600'
                    }`}>
                      {stats.averageOccupancy.toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={stats.averageOccupancy} 
                    className={`h-1.5 ${
                      stats.averageOccupancy > 90 ? 'bg-rose-200' : 
                      stats.averageOccupancy > 70 ? 'bg-amber-200' : 'bg-emerald-200'
                    }`} 
                  />
                  
                  <div className="mt-3 flex justify-between text-xs text-gray-500">
                    <div>
                      Beds: {stats.availableBeds} / {stats.totalBeds}
                    </div>
                    <div>
                      Doctors: {stats.availableDoctors} / {stats.totalDoctors}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => toggleDistrict(district.name)}
                  className="w-full mt-4 flex items-center justify-center text-sm text-gray-500 hover:text-health-600 transition-colors"
                >
                  {expandedDistrict === district.name ? (
                    <>Show less <ChevronUp className="ml-1 h-4 w-4" /></>
                  ) : (
                    <>Show details <ChevronDown className="ml-1 h-4 w-4" /></>
                  )}
                </button>

                {expandedDistrict === district.name && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-gray-100"
                  >
                    <h4 className="text-sm font-medium text-gray-800 mb-3">Health Infrastructure</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Hospital Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="text-right">Beds</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getDistrictHospitals(district.name).map((hospital) => (
                          <TableRow key={hospital.id}>
                            <TableCell className="font-medium">{hospital.name}</TableCell>
                            <TableCell>{hospital.type}</TableCell>
                            <TableCell className="text-right">{hospital.availableBeds} / {hospital.bedCapacity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h5 className="text-xs font-medium text-gray-700 mb-2">Healthcare Personnel</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">Total Doctors</span>
                            <span className="text-xs font-medium">{stats.totalDoctors}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">Available Doctors</span>
                            <span className="text-xs font-medium text-health-600">{stats.availableDoctors}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">Total Staff</span>
                            <span className="text-xs font-medium">{stats.totalStaff}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">Available Staff</span>
                            <span className="text-xs font-medium text-health-600">{stats.availableStaff}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h5 className="text-xs font-medium text-gray-700 mb-2">Recovery Statistics</h5>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-white p-2 rounded shadow-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Recovery Rate</span>
                              <span className="text-xs font-medium text-emerald-600">
                                {(district.recovered / district.cases * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex items-center mt-1">
                              <HeartPulse className="h-3 w-3 mr-1 text-emerald-500" />
                              <span className="text-sm font-semibold">
                                {district.recovered.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <div className="bg-white p-2 rounded shadow-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Active Cases</span>
                              <span className={`text-xs font-medium flex items-center ${
                                district.active > 100 ? 'text-amber-600' : 'text-emerald-600'
                              }`}>
                                {district.active > 100 ? 
                                  <ArrowUpRight className="h-3 w-3 mr-0.5" /> :
                                  <ArrowDownRight className="h-3 w-3 mr-0.5" />
                                }
                                {(district.active / district.cases * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex items-center mt-1">
                              <Activity className="h-3 w-3 mr-1 text-amber-500" />
                              <span className="text-sm font-semibold">
                                {district.active.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <a
                          href="#"
                          className="mt-3 text-xs flex items-center justify-center text-health-600 hover:text-health-700"
                        >
                          View detailed district report
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">District Health Overview</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>A comprehensive overview of all districts in Kerala</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>District</TableHead>
                <TableHead>Hospitals</TableHead>
                <TableHead>Beds</TableHead>
                <TableHead>Doctors</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Cases</TableHead>
                <TableHead>Recovered</TableHead>
                <TableHead className="text-right">Recovery Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {districtData.map((district) => {
                const stats = calculateDistrictStats(district.name);
                return (
                  <TableRow key={district.name}>
                    <TableCell className="font-medium">{district.name}</TableCell>
                    <TableCell>{stats.totalHospitals}</TableCell>
                    <TableCell>{stats.totalBeds}</TableCell>
                    <TableCell>{stats.totalDoctors}</TableCell>
                    <TableCell>{stats.totalStaff}</TableCell>
                    <TableCell>{district.cases.toLocaleString()}</TableCell>
                    <TableCell>{district.recovered.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center">
                        {(district.recovered / district.cases * 100).toFixed(1)}%
                        <span className={`ml-1 rounded-full w-2 h-2 ${
                          (district.recovered / district.cases * 100) > 90 ? 'bg-emerald-500' : 
                          (district.recovered / district.cases * 100) > 80 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}></span>
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DistrictDetails;
