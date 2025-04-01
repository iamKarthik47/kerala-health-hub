
import React, { useState, useMemo } from 'react';
import { Map, Search, MapPin, Activity, Building, Users, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '../components/transitions/PageTransition';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useHealthData } from '../context/HealthDataContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DistrictDetails from '../components/districts/DistrictDetails';
import DistrictCharts from '../components/districts/DistrictCharts';

const Districts: React.FC = () => {
  const { loading, districtData, hospitalData } = useHealthData();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredDistricts = useMemo(() => {
    return districtData.filter((district) => 
      district.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [districtData, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin-slow">
            <Map className="h-12 w-12 text-health-500" />
          </div>
          <p className="mt-4 text-gray-600 animate-pulse">Loading district data...</p>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <Header />
        
        <main className="pb-16">
          <section className="pt-32 pb-16 px-6 md:px-10 bg-gradient-to-b from-health-50 to-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block rounded-lg bg-health-100 px-3 py-1 text-sm font-medium text-health-800 mb-4"
                >
                  District Overview
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight"
                >
                  Kerala Health Districts
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-4 text-xl text-gray-600 max-w-3xl"
                >
                  Explore health infrastructure and statistics across all districts in Kerala
                </motion.p>
              </div>
            </div>
          </section>
          
          <section className="px-6 md:px-10 py-6 border-b border-gray-100">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search districts by name"
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>
          
          <section className="px-6 md:px-10 py-6">
            <div className="max-w-7xl mx-auto">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="overview">District Overview</TabsTrigger>
                  <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
                  <TabsTrigger value="comparison">District Comparison</TabsTrigger>
                  <TabsTrigger value="charts">Visual Analytics</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDistricts.map((district) => {
                      const districtHospitals = hospitalData.filter(hospital => hospital.district === district.name);
                      const totalBeds = districtHospitals.reduce((sum, hospital) => sum + hospital.bedCapacity, 0);
                      const availableBeds = districtHospitals.reduce((sum, hospital) => sum + hospital.availableBeds, 0);
                      
                      return (
                        <motion.div
                          key={district.name}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-6"
                        >
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold text-gray-900">{district.name}</h3>
                            <div className="bg-health-50 text-health-700 px-2 py-0.5 rounded text-sm">
                              {districtHospitals.length} Hospitals
                            </div>
                          </div>
                          
                          <div className="mt-4 space-y-3">
                            <div className="flex items-center">
                              <Activity className="h-4 w-4 text-health-600 mr-2" />
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Total Cases</span>
                                  <span className="font-medium">{district.cases.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center">
                              <Users className="h-4 w-4 text-emerald-500 mr-2" />
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Recovered</span>
                                  <span className="font-medium text-emerald-600">{district.recovered.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center">
                              <Activity className="h-4 w-4 text-amber-500 mr-2" />
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Active Cases</span>
                                  <span className="font-medium text-amber-600">{district.active.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center">
                              <Building className="h-4 w-4 text-blue-500 mr-2" />
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Hospital Beds</span>
                                  <span className="font-medium">{availableBeds} / {totalBeds}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <Button variant="outline" className="w-full" asChild>
                              <a href={`#district-${district.name}`}>View Details</a>
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  
                  {filteredDistricts.length === 0 && (
                    <div className="text-center py-12">
                      <Map className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">No districts found</h3>
                      <p className="text-gray-500 mt-2">Try adjusting your search</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="details" className="space-y-6">
                  <DistrictDetails districtData={filteredDistricts} hospitalData={hospitalData} />
                </TabsContent>
                
                <TabsContent value="comparison" className="space-y-6">
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
                </TabsContent>

                {/* New Charts Tab */}
                <TabsContent value="charts" className="space-y-6">
                  <DistrictCharts districtData={filteredDistricts} hospitalData={hospitalData} />
                </TabsContent>
              </Tabs>
            </div>
          </section>
          
          <section className="px-6 md:px-10 py-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-medium text-gray-900">District Health Overview</h2>
                <p className="text-gray-500 mt-1">Key statistics across all districts</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-health-600 mb-2">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{districtData.length}</div>
                  <div className="text-gray-500 text-sm">Total Districts</div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-amber-600 mb-2">
                    <Activity className="h-6 w-6" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {districtData.reduce((sum, district) => sum + district.cases, 0).toLocaleString()}
                  </div>
                  <div className="text-gray-500 text-sm">Total Cases</div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-emerald-600 mb-2">
                    <Users className="h-6 w-6" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {districtData.reduce((sum, district) => sum + district.recovered, 0).toLocaleString()}
                  </div>
                  <div className="text-gray-500 text-sm">Total Recovered</div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-rose-600 mb-2">
                    <Filter className="h-6 w-6" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {hospitalData.reduce((sum, hospital) => sum + hospital.bedCapacity, 0).toLocaleString()}
                  </div>
                  <div className="text-gray-500 text-sm">Total Bed Capacity</div>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Districts;
