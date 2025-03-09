
import React, { useEffect } from 'react';
import { Activity, ChevronRight, Map, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '../components/transitions/PageTransition';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import StatCard from '../components/dashboard/StatCard';
import DataChart from '../components/dashboard/DataChart';
import HospitalCard from '../components/dashboard/HospitalCard';
import DiseaseTracker from '../components/dashboard/DiseaseTracker';
import ResourceMonitor from '../components/dashboard/ResourceMonitor';
import { HealthDataProvider, useHealthData } from '../context/HealthDataContext';

const Dashboard: React.FC = () => {
  const { loading, statistics, patientData, hospitalData, diseaseData, resourceData } = useHealthData();

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
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 md:px-10 bg-gradient-to-b from-health-50 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block rounded-lg bg-health-100 px-3 py-1 text-sm font-medium text-health-800 mb-4"
            >
              Kerala Health Dashboard
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight"
            >
              Kerala Health Central
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-xl text-gray-600 max-w-3xl"
            >
              Comprehensive real-time health monitoring system for Kerala state's healthcare infrastructure and disease surveillance.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <button className="px-5 py-3 rounded-lg bg-health-600 text-white font-medium hover:bg-health-700 transition-colors flex items-center">
                Explore Dashboard
                <ChevronRight className="ml-1 h-4 w-4" />
              </button>
              <button className="px-5 py-3 rounded-lg bg-white text-health-600 font-medium border border-health-200 hover:bg-health-50 transition-colors">
                View Reports
              </button>
            </motion.div>
          </div>
          
          <div className="absolute right-0 top-0 -z-10 mask-radial-faded pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-health-100 via-health-200/40 to-health-300/20 opacity-50 rounded-full blur-3xl" />
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="px-6 md:px-10 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statistics.map((stat, index) => (
              <StatCard
                key={stat.id}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                description={stat.description}
                trend={stat.trend}
                prefix={stat.prefix}
                suffix={stat.suffix}
                color={stat.color}
                delay={0.1 + (index * 0.1)}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Charts Section */}
      <section className="px-6 md:px-10 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-medium text-gray-900 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-health-600" />
              Patient Metrics
            </h2>
            <p className="text-gray-500 mt-1">Annual overview of patient statistics</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DataChart
                title="Patient Trends"
                subtitle="Monthly trends of patient admission, recovery, and mortality"
                data={patientData}
                dataKeys={[
                  { key: 'admitted', color: '#0ea5e9', name: 'Admissions' },
                  { key: 'recovered', color: '#10b981', name: 'Recoveries' },
                  { key: 'deceased', color: '#f43f5e', name: 'Deceased' }
                ]}
                type="area"
                delay={0.2}
              />
            </div>
            <div>
              <DataChart
                title="Recovery vs. Admission"
                subtitle="Monthly comparison"
                data={patientData}
                dataKeys={[
                  { key: 'admitted', color: '#0ea5e9', name: 'Admissions' },
                  { key: 'recovered', color: '#10b981', name: 'Recoveries' }
                ]}
                type="bar"
                aspectRatio={1.2}
                delay={0.3}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Hospitals Section */}
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
            <button className="text-health-600 hover:text-health-700 text-sm font-medium flex items-center">
              View all hospitals
              <ChevronRight className="ml-1 h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hospitalData.map((hospital, index) => (
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
                status={hospital.status}
                delay={0.1 + (index * 0.1)}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Disease & Resource Monitoring */}
      <section className="px-6 md:px-10 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-medium text-gray-900 flex items-center">
              <Map className="h-5 w-5 mr-2 text-health-600" />
              Outbreak Monitoring
            </h2>
            <p className="text-gray-500 mt-1">Tracking diseases and critical resources</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DiseaseTracker 
              diseases={diseaseData}
              delay={0.2}
            />
            <ResourceMonitor 
              resources={resourceData}
              delay={0.3}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <PageTransition>
      <HealthDataProvider>
        <div className="min-h-screen bg-white">
          <Header />
          <Dashboard />
          <Footer />
        </div>
      </HealthDataProvider>
    </PageTransition>
  );
};

export default Index;
