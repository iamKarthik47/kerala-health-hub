
import React, { useState, useMemo } from 'react';
import PageTransition from '../components/transitions/PageTransition';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useHealthData } from '../context/HealthDataContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DistrictDetails from '../components/districts/DistrictDetails';
import DistrictCharts from '../components/districts/DistrictCharts';
import DistrictLoading from '../components/districts/DistrictLoading';
import DistrictHero from '../components/districts/DistrictHero';
import DistrictSearch from '../components/districts/DistrictSearch';
import DistrictOverview from '../components/districts/DistrictOverview';
import DistrictComparison from '../components/districts/DistrictComparison';
import DistrictStats from '../components/districts/DistrictStats';

const Districts: React.FC = () => {
  const { loading, districtData, hospitalData } = useHealthData();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredDistricts = useMemo(() => {
    return districtData.filter((district) => 
      district.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [districtData, searchTerm]);

  if (loading) {
    return <DistrictLoading />;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <Header />
        
        <main className="pb-16">
          <DistrictHero />
          <DistrictSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          
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
                  <DistrictOverview 
                    filteredDistricts={filteredDistricts}
                    hospitalData={hospitalData}
                  />
                </TabsContent>
                
                <TabsContent value="details" className="space-y-6">
                  <DistrictDetails 
                    districtData={filteredDistricts} 
                    hospitalData={hospitalData} 
                  />
                </TabsContent>
                
                <TabsContent value="comparison" className="space-y-6">
                  <DistrictComparison 
                    filteredDistricts={filteredDistricts}
                    hospitalData={hospitalData}
                  />
                </TabsContent>

                <TabsContent value="charts" className="space-y-6">
                  <DistrictCharts 
                    districtData={filteredDistricts} 
                    hospitalData={hospitalData} 
                  />
                </TabsContent>
              </Tabs>
            </div>
          </section>
          
          <DistrictStats districtData={districtData} hospitalData={hospitalData} />
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Districts;
