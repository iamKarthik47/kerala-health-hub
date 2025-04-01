
import React from 'react';
import { Activity, ChevronRight, Map, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
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

  return (
    <div className="pb-16">
      <DashboardHero />
      <StatisticsSection statistics={statistics} />
      <ChartsSection patientData={patientData} />
      <HospitalsSection hospitalData={hospitalData} districtData={districtData} />
      <MonitoringSection diseaseData={diseaseData} resourceData={resourceData} />
    </div>
  );
};

export default Dashboard;
