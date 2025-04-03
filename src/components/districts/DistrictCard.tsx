
import React, { useState } from 'react';
import { Activity, FileText, Building, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import ReportViewer from '../reports/ReportViewer';
import { generateReportData } from '@/utils/reportUtils';

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

interface DistrictCardProps {
  district: DistrictData;
  districtHospitals: HospitalData[];
  totalBeds: number;
  availableBeds: number;
}

const DistrictCard: React.FC<DistrictCardProps> = ({
  district,
  districtHospitals,
  totalBeds,
  availableBeds,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  
  const recoveryRate = ((district.recovered / district.cases) * 100).toFixed(1);
  const occupancyRate = totalBeds > 0 
    ? ((totalBeds - availableBeds) / totalBeds * 100).toFixed(1) 
    : "0.0";
  
  const viewDetailedReport = () => {
    setReportOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
    >
      <div className="p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">{district.name}</h3>
          <div className="flex items-center gap-2">
            <span className="bg-health-50 text-health-700 px-2 py-0.5 rounded text-sm">
              {districtHospitals.length} Hospitals
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center text-sm text-gray-500">
              <Activity className="h-4 w-4 mr-1 text-health-600" />
              Cases
            </div>
            <div className="mt-2 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Total</span>
                <span className="text-sm font-medium">{district.cases.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Recovered</span>
                <span className="text-sm font-medium text-emerald-600">
                  {district.recovered.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Active</span>
                <span className="text-sm font-medium text-amber-600">{district.active.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center text-sm text-gray-500">
              <Building className="h-4 w-4 mr-1 text-health-600" />
              Infrastructure
            </div>
            <div className="mt-2 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Hospitals</span>
                <span className="text-sm font-medium">{districtHospitals.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Total Beds</span>
                <span className="text-sm font-medium">{totalBeds}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Available</span>
                <span className="text-sm font-medium text-emerald-600">{availableBeds}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-gray-500">Recovery Rate</span>
            <span
              className={`text-xs font-medium ${
                Number(recoveryRate) > 90
                  ? 'text-emerald-600'
                  : Number(recoveryRate) > 75
                  ? 'text-amber-600'
                  : 'text-rose-600'
              }`}
            >
              {recoveryRate}%
            </span>
          </div>
          <Progress
            value={Number(recoveryRate)}
            className={`h-1.5 ${
              Number(recoveryRate) > 90
                ? 'bg-emerald-200'
                : Number(recoveryRate) > 75
                ? 'bg-amber-200'
                : 'bg-rose-200'
            }`}
          />

          <div className="flex justify-between items-center mt-2 mb-1.5">
            <span className="text-xs text-gray-500">Bed Occupancy</span>
            <span
              className={`text-xs font-medium ${
                Number(occupancyRate) > 90
                  ? 'text-rose-600'
                  : Number(occupancyRate) > 70
                  ? 'text-amber-600'
                  : 'text-emerald-600'
              }`}
            >
              {occupancyRate}%
            </span>
          </div>
          <Progress
            value={Number(occupancyRate)}
            className={`h-1.5 ${
              Number(occupancyRate) > 90
                ? 'bg-rose-200'
                : Number(occupancyRate) > 70
                ? 'bg-amber-200'
                : 'bg-emerald-200'
            }`}
          />
        </div>

        <div className="mt-4 flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" /> Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" /> Show More
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="w-full text-health-700"
            onClick={viewDetailedReport}
          >
            <FileText className="h-4 w-4 mr-1" /> View Report
          </Button>
        </div>

        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-gray-100"
          >
            <h4 className="text-sm font-medium mb-2">Hospital List</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {districtHospitals.map((hospital) => (
                <div
                  key={hospital.id}
                  className="text-xs p-2 border rounded-lg flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">{hospital.name}</div>
                    <div className="text-gray-500">{hospital.type}</div>
                  </div>
                  <div>
                    <div className="text-right">Beds: {hospital.availableBeds}/{hospital.bedCapacity}</div>
                    <div
                      className={`text-right ${
                        hospital.status === 'operational'
                          ? 'text-emerald-600'
                          : hospital.status === 'partial'
                          ? 'text-amber-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {hospital.status.charAt(0).toUpperCase() + hospital.status.slice(1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Report Viewer Dialog */}
      <ReportViewer 
        isOpen={reportOpen} 
        onClose={() => setReportOpen(false)}
        report={reportOpen ? generateReportData(district.name, district, districtHospitals) : null}
      />
    </motion.div>
  );
};

export default DistrictCard;
