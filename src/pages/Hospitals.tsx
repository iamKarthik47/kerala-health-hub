
import React, { useState, useMemo } from 'react';
import { Building, MapPin, Filter, Grid3X3, List, Search, Map } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '../components/transitions/PageTransition';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HospitalCard from '../components/dashboard/HospitalCard';
import { useHealthData } from '../context/HealthDataContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DistrictDetails from '../components/districts/DistrictDetails';

type ViewMode = 'grid' | 'list';
type HospitalType = 'all' | 'Medical College' | 'District Hospital' | 'Community Hospital' | 'Specialty Hospital';

const Hospitals: React.FC = () => {
  const { loading, hospitalData, districtData } = useHealthData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [hospitalType, setHospitalType] = useState<HospitalType>('all');

  const districts = useMemo(() => {
    const uniqueDistricts = Array.from(
      new Set(hospitalData.map((hospital) => hospital.district))
    );
    return ['all', ...uniqueDistricts];
  }, [hospitalData]);

  const filteredHospitals = useMemo(() => {
    return hospitalData.filter((hospital) => {
      const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            hospital.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDistrict = selectedDistrict === 'all' || hospital.district === selectedDistrict;
      const matchesType = hospitalType === 'all' || hospital.type === hospitalType;
      
      return matchesSearch && matchesDistrict && matchesType;
    });
  }, [hospitalData, searchTerm, selectedDistrict, hospitalType]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin-slow">
            <Building className="h-12 w-12 text-health-500" />
          </div>
          <p className="mt-4 text-gray-600 animate-pulse">Loading hospital data...</p>
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
                  Hospital Directory
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight"
                >
                  Kerala Hospitals
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-4 text-xl text-gray-600 max-w-3xl"
                >
                  Browse and monitor the status of healthcare facilities across Kerala
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
                    placeholder="Search hospitals by name or location"
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center border border-gray-200 rounded-md">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className={`${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid3X3 className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Grid</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className={`${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">List</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <section className="px-6 md:px-10 py-6">
            <div className="max-w-7xl mx-auto">
              <Tabs defaultValue="districts" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="districts">By District</TabsTrigger>
                  <TabsTrigger value="types">By Type</TabsTrigger>
                  <TabsTrigger value="districtsDetails">Districts Details</TabsTrigger>
                </TabsList>
                
                <TabsContent value="districts" className="space-y-6">
                  <div className="flex flex-wrap gap-2">
                    {districts.map((district) => (
                      <Button
                        key={district}
                        variant="outline"
                        size="sm"
                        className={`${
                          selectedDistrict === district ? 'bg-health-100 text-health-800 border-health-200' : ''
                        }`}
                        onClick={() => setSelectedDistrict(district)}
                      >
                        {district === 'all' ? 'All Districts' : district}
                      </Button>
                    ))}
                  </div>
                  
                  <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
                    {filteredHospitals.map((hospital) => (
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
                        doctors={hospital.doctors}
                        availableDoctors={hospital.availableDoctors}
                        staff={hospital.staff}
                        availableStaff={hospital.availableStaff}
                        facilities={hospital.facilities}
                        specialties={hospital.specialties}
                      />
                    ))}
                  </div>
                  
                  {filteredHospitals.length === 0 && (
                    <div className="text-center py-12">
                      <Building className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">No hospitals found</h3>
                      <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="types" className="space-y-6">
                  <div className="flex flex-wrap gap-2">
                    {['all', 'Medical College', 'District Hospital', 'Community Hospital', 'Specialty Hospital'].map((type) => (
                      <Button
                        key={type}
                        variant="outline"
                        size="sm"
                        className={`${
                          hospitalType === type ? 'bg-health-100 text-health-800 border-health-200' : ''
                        }`}
                        onClick={() => setHospitalType(type as HospitalType)}
                      >
                        {type === 'all' ? 'All Types' : type}
                      </Button>
                    ))}
                  </div>
                  
                  <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
                    {filteredHospitals.map((hospital) => (
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
                        doctors={hospital.doctors}
                        availableDoctors={hospital.availableDoctors}
                        staff={hospital.staff}
                        availableStaff={hospital.availableStaff}
                        facilities={hospital.facilities}
                        specialties={hospital.specialties}
                      />
                    ))}
                  </div>
                  
                  {filteredHospitals.length === 0 && (
                    <div className="text-center py-12">
                      <Building className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">No hospitals found</h3>
                      <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="districtsDetails" className="space-y-6">
                  <DistrictDetails districtData={districtData} hospitalData={hospitalData} />
                </TabsContent>
              </Tabs>
            </div>
          </section>
          
          <section className="px-6 md:px-10 py-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-medium text-gray-900">Hospital Statistics</h2>
                <p className="text-gray-500 mt-1">Overview of healthcare facilities across Kerala</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-health-600 mb-2">
                    <Building className="h-6 w-6" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{hospitalData.length}</div>
                  <div className="text-gray-500 text-sm">Total Hospitals</div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-amber-600 mb-2">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{districts.length - 1}</div>
                  <div className="text-gray-500 text-sm">Districts Covered</div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-emerald-600 mb-2">
                    <Filter className="h-6 w-6" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {hospitalData.filter(h => h.status === 'operational').length}
                  </div>
                  <div className="text-gray-500 text-sm">Fully Operational</div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-rose-600 mb-2">
                    <Filter className="h-6 w-6" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {hospitalData.filter(h => h.status === 'critical').length}
                  </div>
                  <div className="text-gray-500 text-sm">Critical Status</div>
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

export default Hospitals;
