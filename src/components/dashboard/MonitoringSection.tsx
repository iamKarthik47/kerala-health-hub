
import React from 'react';
import { Map } from 'lucide-react';
import DiseaseTracker, { DiseaseData } from './DiseaseTracker';
import ResourceMonitor from './ResourceMonitor';

interface ResourceData {
  name: string;
  available: number;
  total: number;
  critical: boolean;
  district: string;
}

interface MonitoringSectionProps {
  diseaseData: any[];
  resourceData: ResourceData[];
}

const MonitoringSection: React.FC<MonitoringSectionProps> = ({ diseaseData, resourceData }) => {
  return (
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
            diseases={diseaseData.map(disease => ({
              ...disease,
              // Ensure severity is of the correct type
              severity: (disease.severity === "low" || disease.severity === "medium" || 
                          disease.severity === "high" || disease.severity === "critical") 
                ? disease.severity as "low" | "medium" | "high" | "critical"
                : "medium"
            }))}
            delay={0.2}
          />
          <ResourceMonitor 
            resources={resourceData}
            delay={0.3}
          />
        </div>
      </div>
    </section>
  );
};

export default MonitoringSection;
