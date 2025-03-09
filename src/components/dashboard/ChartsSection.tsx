
import React from 'react';
import { BarChart3 } from 'lucide-react';
import DataChart from './DataChart';

interface DataPoint {
  name: string;
  [key: string]: string | number;
}

interface ChartsSectionProps {
  patientData: DataPoint[];
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ patientData }) => {
  return (
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
  );
};

export default ChartsSection;
