
import React from 'react';
import { Activity, ChevronRight, Map, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import StatCard from './StatCard';
import DataChart from './DataChart';
import HospitalCard from './HospitalCard';
import DiseaseTracker from './DiseaseTracker';
import ResourceMonitor from './ResourceMonitor';
import { useHealthData } from '../../context/HealthDataContext';
import DashboardHero from './DashboardHero';
import StatisticsSection from './StatisticsSection';
import ChartsSection from './ChartsSection';
import HospitalsSection from './HospitalsSection';
import MonitoringSection from './MonitoringSection';

const Dashboard: React.FC = () => {
  const { loading, statistics, patientData, hospitalData, diseaseData, resourceData, districtData } = useHealthData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin-slow">
            <Activity className="h-12 w-12 text-health-500" />
          </div>
          <p className="mt-4 text-gray-600 animate-pulse">Loading health data...</p>
        </div>
      </div>
    );
  }

  // Get the top 3 districts with highest cases
  const topDistricts = [...districtData]
    .sort((a, b) => b.cases - a.cases)
    .slice(0, 3);

  return (
    <div className="pb-16">
      <DashboardHero />
      <StatisticsSection statistics={statistics} />
      <ChartsSection patientData={patientData} />
      <HospitalsSection hospitalData={hospitalData} districtData={districtData} />
      
      {/* New Districts Highlight Section */}
      <section className="py-12 px-6 md:px-10 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">District Health Monitoring</h2>
              <p className="mt-2 text-gray-600">Monitor health metrics across Kerala's districts</p>
            </div>
            <Link to="/districts">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 py-2 bg-health-100 hover:bg-health-200 text-health-800 rounded-lg transition-colors"
              >
                View All Districts
                <ChevronRight className="ml-1 h-5 w-5" />
              </motion.button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topDistricts.map((district) => {
              // Get district hospitals
              const districtHospitals = hospitalData.filter(h => h.district === district.name);
              const totalBeds = districtHospitals.reduce((sum, h) => sum + h.bedCapacity, 0);
              const availableBeds = districtHospitals.reduce((sum, h) => sum + h.availableBeds, 0);
              const recoveryRate = ((district.recovered / district.cases) * 100).toFixed(1);
              
              return (
                <motion.div
                  key={district.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 p-6"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900">{district.name}</h3>
                    <div className="bg-health-50 text-health-700 px-2 py-0.5 rounded text-sm">
                      {districtHospitals.length} Hospitals
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex items-start">
                      <Map className="h-4 w-4 text-health-600 mt-0.5 mr-2" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Cases</span>
                          <span className="font-medium">{district.cases.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500">Recovery Rate</span>
                          <span className={`text-xs font-medium ${
                            Number(recoveryRate) > 90 ? 'text-emerald-600' : 
                            Number(recoveryRate) > 75 ? 'text-amber-600' : 'text-rose-600'
                          }`}>{recoveryRate}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Activity className="h-4 w-4 text-amber-500 mt-0.5 mr-2" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Active Cases</span>
                          <span className="font-medium text-amber-600">{district.active.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500">Deceased</span>
                          <span className="text-xs font-medium text-gray-800">{district.deceased.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Activity className="h-4 w-4 text-blue-500 mt-0.5 mr-2" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Hospital Beds</span>
                          <span className="font-medium">{availableBeds} / {totalBeds}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500">Availability</span>
                          <span className={`text-xs font-medium ${
                            (availableBeds / totalBeds) * 100 > 30 ? 'text-emerald-600' : 
                            (availableBeds / totalBeds) * 100 > 15 ? 'text-amber-600' : 'text-rose-600'
                          }`}>{((availableBeds / totalBeds) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Link to={`/districts`}>
                    <button className="mt-4 w-full py-2 bg-gray-50 hover:bg-gray-100 text-sm text-gray-700 rounded-md transition-colors">
                      View District Details
                    </button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      
      <MonitoringSection diseaseData={diseaseData} resourceData={resourceData} />
    </div>
  );
};

export default Dashboard;
