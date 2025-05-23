
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, AlertCircle, Bed, Users, Stethoscope, MapPin, ChevronDown, ChevronUp, Briefcase, Building2, Shield } from 'lucide-react';

interface HospitalCardProps {
  name: string;
  type: string;
  location: string;
  district: string;
  bedCapacity: number;
  availableBeds: number;
  occupancyRate: number;
  patientCount: number;
  status: 'operational' | 'partial' | 'critical';
  delay?: number;
  doctors?: number;
  availableDoctors?: number;
  staff?: number;
  availableStaff?: number;
  facilities?: string[];
  specialties?: string[];
}

const HospitalCard: React.FC<HospitalCardProps> = ({
  name,
  type,
  location,
  district,
  bedCapacity,
  availableBeds,
  occupancyRate,
  patientCount,
  status,
  delay = 0,
  doctors = 0,
  availableDoctors = 0,
  staff = 0,
  availableStaff = 0,
  facilities = [],
  specialties = []
}) => {
  const [expanded, setExpanded] = useState(false);

  const statusConfig = {
    operational: { icon: Check, color: 'emerald', text: 'Fully Operational' },
    partial: { icon: AlertCircle, color: 'amber', text: 'Partially Operational' },
    critical: { icon: AlertCircle, color: 'rose', text: 'Critical Status' },
  };
  
  const StatusIcon = statusConfig[status].icon;
  const statusColor = statusConfig[status].color;
  const statusText = statusConfig[status].text;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <span className={`inline-flex items-center rounded-full bg-${statusColor}-100 px-2.5 py-0.5 text-xs font-medium text-${statusColor}-800 mb-2`}>
              <StatusIcon className={`h-3 w-3 mr-1 text-${statusColor}-500`} />
              {statusText}
            </span>
            <h3 className="text-lg font-medium text-gray-900">{name}</h3>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <Stethoscope className="h-3.5 w-3.5 mr-1" />
              {type}
            </div>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              {location}, {district}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <div className="flex items-center">
              <Bed className="h-4 w-4 text-health-600 mr-1.5" />
              <span className="text-sm font-medium text-gray-700">Bed Capacity</span>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-semibold text-gray-900">{bedCapacity}</span>
            </div>
            <div className="mt-1 flex items-center">
              <span className="text-xs text-gray-500">Available: </span>
              <span className="ml-1 text-xs font-medium text-health-600">{availableBeds}</span>
            </div>
          </div>
          
          <div>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-health-600 mr-1.5" />
              <span className="text-sm font-medium text-gray-700">Patients</span>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-semibold text-gray-900">{patientCount}</span>
            </div>
            <div className="mt-1">
              <span className="text-xs text-gray-500">Occupancy: </span>
              <span className={`ml-1 text-xs font-medium ${
                occupancyRate > 90 ? 'text-rose-600' : 
                occupancyRate > 70 ? 'text-amber-600' : 'text-emerald-600'
              }`}>{occupancyRate}%</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Occupancy</span>
            <span className={`text-xs font-medium ${
                occupancyRate > 90 ? 'text-rose-600' : 
                occupancyRate > 70 ? 'text-amber-600' : 'text-emerald-600'
              }`}>{occupancyRate}%</span>
          </div>
          <div className="mt-2 bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <motion.div 
              className={`h-full rounded-full ${
                occupancyRate > 90 ? 'bg-rose-500' : 
                occupancyRate > 70 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${occupancyRate}%` }}
              transition={{ duration: 0.8, delay: delay + 0.3, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Additional hospital information - only visible when expanded */}
        {expanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-gray-100"
          >
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="flex items-center">
                  <Stethoscope className="h-4 w-4 text-health-600 mr-1.5" />
                  <span className="text-sm font-medium text-gray-700">Doctors</span>
                </div>
                <div className="mt-1">
                  <span className="text-xl font-semibold text-gray-900">{doctors}</span>
                </div>
                <div className="mt-1 flex items-center">
                  <span className="text-xs text-gray-500">Available: </span>
                  <span className="ml-1 text-xs font-medium text-health-600">{availableDoctors}</span>
                </div>
              </div>
              
              <div>
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 text-health-600 mr-1.5" />
                  <span className="text-sm font-medium text-gray-700">Staff</span>
                </div>
                <div className="mt-1">
                  <span className="text-xl font-semibold text-gray-900">{staff}</span>
                </div>
                <div className="mt-1 flex items-center">
                  <span className="text-xs text-gray-500">Available: </span>
                  <span className="ml-1 text-xs font-medium text-health-600">{availableStaff}</span>
                </div>
              </div>
            </div>

            {facilities.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center mb-2">
                  <Building2 className="h-4 w-4 text-health-600 mr-1.5" />
                  <span className="text-sm font-medium text-gray-700">Facilities</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {facilities.map((facility, i) => (
                    <span key={i} className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {specialties.length > 0 && (
              <div>
                <div className="flex items-center mb-2">
                  <Shield className="h-4 w-4 text-health-600 mr-1.5" />
                  <span className="text-sm font-medium text-gray-700">Specialties</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {specialties.map((specialty, i) => (
                    <span key={i} className="inline-flex items-center rounded-full bg-health-50 px-2.5 py-0.5 text-xs font-medium text-health-800">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        <button 
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-4 flex items-center justify-center text-sm text-gray-500 hover:text-health-600 transition-colors"
        >
          {expanded ? (
            <>Show less <ChevronUp className="ml-1 h-4 w-4" /></>
          ) : (
            <>Show details <ChevronDown className="ml-1 h-4 w-4" /></>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default HospitalCard;
