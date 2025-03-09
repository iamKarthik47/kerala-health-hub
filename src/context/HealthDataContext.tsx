
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import mockData from '../lib/mockData';

interface HealthDataContextType {
  loading: boolean;
  statistics: typeof mockData.statistics;
  patientData: typeof mockData.patientData;
  hospitalData: typeof mockData.hospitalData;
  diseaseData: typeof mockData.diseaseData;
  resourceData: typeof mockData.resourceData;
  districtData: typeof mockData.districtData;
  fetchData: () => Promise<void>;
  error: string | null;
}

const HealthDataContext = createContext<HealthDataContextType | undefined>(undefined);

export const HealthDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState(mockData.statistics);
  const [patientData, setPatientData] = useState(mockData.patientData);
  const [hospitalData, setHospitalData] = useState(mockData.hospitalData);
  const [diseaseData, setDiseaseData] = useState(mockData.diseaseData);
  const [resourceData, setResourceData] = useState(mockData.resourceData);
  const [districtData, setDistrictData] = useState(mockData.districtData);

  const fetchData = async () => {
    setLoading(true);
    try {
      // In a real application, this would be an API call
      // For now, we'll simulate a delay and use our mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStatistics(mockData.statistics);
      setPatientData(mockData.patientData);
      setHospitalData(mockData.hospitalData);
      setDiseaseData(mockData.diseaseData);
      setResourceData(mockData.resourceData);
      setDistrictData(mockData.districtData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch health data. Please try again later.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const value = {
    loading,
    statistics,
    patientData,
    hospitalData,
    diseaseData,
    resourceData,
    districtData,
    fetchData,
    error
  };

  return (
    <HealthDataContext.Provider value={value}>
      {children}
    </HealthDataContext.Provider>
  );
};

export const useHealthData = () => {
  const context = useContext(HealthDataContext);
  if (context === undefined) {
    throw new Error('useHealthData must be used within a HealthDataProvider');
  }
  return context;
};
