
import React, { useState } from 'react';
import { Activity, ChevronRight, Map, BarChart3, FileText, Download } from 'lucide-react';
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
import ReportViewer from '../reports/ReportViewer';
import { generateReportData } from '@/utils/reportUtils';
import { Button } from '@/components/ui/button';

const Dashboard: React.FC = () => {
  const { loading, statistics, patientData, hospitalData, diseaseData, resourceData, districtData } = useHealthData();
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [showStateReport, setShowStateReport] = useState(false);

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

  const viewDistrictReport = (districtName: string) => {
    setSelectedDistrict(districtName);
    setShowStateReport(false);
    setReportOpen(true);
  };
  
  const viewStateReport = () => {
    setSelectedDistrict(null);
    setShowStateReport(true);
    setReportOpen(true);
  };
  
  // Generate state level report data
  const generateStateReportData = () => {
    const totalCases = districtData.reduce((sum, district) => sum + district.cases, 0);
    const totalRecovered = districtData.reduce((sum, district) => sum + district.recovered, 0);
    const totalActive = districtData.reduce((sum, district) => sum + district.active, 0);
    const totalDeceased = districtData.reduce((sum, district) => sum + district.deceased, 0);
    
    const totalHospitals = hospitalData.length;
    const totalBeds = hospitalData.reduce((sum, h) => sum + h.bedCapacity, 0);
    const availableBeds = hospitalData.reduce((sum, h) => sum + h.availableBeds, 0);
    const totalDoctors = hospitalData.reduce((sum, h) => sum + h.doctors, 0);
    const availableDoctors = hospitalData.reduce((sum, h) => sum + h.availableDoctors, 0);
    const totalStaff = hospitalData.reduce((sum, h) => sum + h.staff, 0);
    const availableStaff = hospitalData.reduce((sum, h) => sum + h.availableStaff, 0);
    
    return {
      title: "Kerala State Health Report",
      subtitle: "Comprehensive Health Status of Kerala State",
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      type: "State",
      data: {
        cases: totalCases,
        recovered: totalRecovered,
        active: totalActive,
        deceased: totalDeceased,
        hospitals: hospitalData,
        totalBeds,
        availableBeds,
        totalDoctors,
        availableDoctors,
        totalStaff,
        availableStaff,
        districts: districtData,
        districtVisualizationData: {
          cases: districtData.map(d => d.cases),
          recovered: districtData.map(d => d.recovered),
          active: districtData.map(d => d.active),
          labels: districtData.map(d => d.name)
        }
      }
    };
  };

  return (
    <div className="pb-16">
      <DashboardHero onViewReports={viewStateReport} />
      <StatisticsSection statistics={statistics} />
      <ChartsSection patientData={patientData} />
      <HospitalsSection hospitalData={hospitalData} districtData={districtData} />
      
      {/* Districts Highlight Section */}
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
                  
                  <div className="mt-4 flex space-x-2">
                    <Link to="/districts" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1 text-health-700"
                      onClick={() => viewDistrictReport(district.name)}
                    >
                      <FileText className="h-4 w-4 mr-1" /> View Report
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      
      <MonitoringSection diseaseData={diseaseData} resourceData={resourceData} />
      
      {/* State Report Button - Adding functionality to View Reports button in DashboardHero */}
      <section className="py-8 px-6 md:px-10 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <Button 
            onClick={viewStateReport}
            className="px-6 py-3 bg-health-600 text-white hover:bg-health-700 transition-colors rounded-lg font-medium"
          >
            <FileText className="h-5 w-5 mr-2" />
            View Comprehensive State Health Report
          </Button>
          <p className="mt-3 text-sm text-gray-600">
            Access detailed analytics, 3D visualizations, and comprehensive health metrics for Kerala state
          </p>
        </div>
      </section>
      
      {/* Report Viewer Dialog */}
      <ReportViewer 
        isOpen={reportOpen} 
        onClose={() => setReportOpen(false)}
        report={
          reportOpen
            ? (showStateReport 
                ? generateStateReportData()
                : selectedDistrict && generateReportData(
                    selectedDistrict,
                    districtData.find(d => d.name === selectedDistrict), 
                    hospitalData.filter(h => h.district === selectedDistrict)
                  )
              )
            : null
        }
      />
    </div>
  );
};

export default Dashboard;
