
import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface DistrictData {
  name: string;
  cases: number;
  recovered: number;
  active: number;
  deceased: number;
}

interface HospitalData {
  id: number;
  name: string;
  type: string;
  location: string;
  district: string;
  bedCapacity: number;
  availableBeds: number;
  occupancyRate: number;
  patientCount: number;
  status: "operational" | "partial" | "critical";
  doctors: number;
  availableDoctors: number;
  staff: number;
  availableStaff: number;
  facilities: string[];
  specialties: string[];
}

interface DistrictChartsProps {
  districtData: DistrictData[];
  hospitalData: HospitalData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

const DistrictCharts: React.FC<DistrictChartsProps> = ({ districtData, hospitalData }) => {
  // Prepare data for case comparison chart
  const casesComparisonData = districtData.map(district => ({
    name: district.name,
    active: district.active,
    recovered: district.recovered,
    deceased: district.deceased,
  }));

  // Prepare data for hospital capacity chart
  const hospitalCapacityData = districtData.map(district => {
    const districtHospitals = hospitalData.filter(hospital => hospital.district === district.name);
    const totalBeds = districtHospitals.reduce((sum, hospital) => sum + hospital.bedCapacity, 0);
    const availableBeds = districtHospitals.reduce((sum, hospital) => sum + hospital.availableBeds, 0);
    const occupiedBeds = totalBeds - availableBeds;
    
    return {
      name: district.name,
      available: availableBeds,
      occupied: occupiedBeds
    };
  });

  // Prepare data for recovery rate chart
  const recoveryRateData = districtData.map(district => ({
    name: district.name,
    rate: parseFloat(((district.recovered / district.cases) * 100).toFixed(1)),
  }));

  // Prepare data for hospital status pie chart
  const hospitalStatusData = [
    { name: 'Operational', value: hospitalData.filter(h => h.status === 'operational').length },
    { name: 'Partial', value: hospitalData.filter(h => h.status === 'partial').length },
    { name: 'Critical', value: hospitalData.filter(h => h.status === 'critical').length },
  ];

  // Prepare data for healthcare personnel chart
  const healthcarePersonnelData = districtData.map(district => {
    const districtHospitals = hospitalData.filter(hospital => hospital.district === district.name);
    const totalDoctors = districtHospitals.reduce((sum, hospital) => sum + hospital.doctors, 0);
    const availableDoctors = districtHospitals.reduce((sum, hospital) => sum + hospital.availableDoctors, 0);
    const totalStaff = districtHospitals.reduce((sum, hospital) => sum + hospital.staff, 0);
    const availableStaff = districtHospitals.reduce((sum, hospital) => sum + hospital.availableStaff, 0);
    
    return {
      name: district.name,
      doctors: totalDoctors,
      availableDoctors: availableDoctors,
      staff: totalStaff,
      availableStaff: availableStaff,
    };
  });

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Cases Comparison Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">COVID Cases by District</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={casesComparisonData}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  tick={{ fontSize: 12 }}
                  height={80}
                />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    border: '1px solid #f1f5f9',
                  }}
                />
                <Legend />
                <Bar dataKey="active" name="Active Cases" fill="#FFBB28" radius={[4, 4, 0, 0]} />
                <Bar dataKey="recovered" name="Recovered" fill="#00C49F" radius={[4, 4, 0, 0]} />
                <Bar dataKey="deceased" name="Deceased" fill="#FF8042" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hospital Capacity Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Hospital Bed Capacity by District</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={hospitalCapacityData}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                stackOffset="expand"
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 'dataMax']} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  scale="band" 
                  tick={{ fontSize: 12 }}
                  width={100}
                />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    border: '1px solid #f1f5f9',
                  }}
                  formatter={(value, name) => [value, name === 'available' ? 'Available Beds' : 'Occupied Beds']}
                />
                <Legend />
                <Bar dataKey="occupied" name="Occupied Beds" stackId="a" fill="#ff8042" />
                <Bar dataKey="available" name="Available Beds" stackId="a" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recovery Rate Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recovery Rate by District</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={recoveryRateData}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  tick={{ fontSize: 12 }}
                  height={80}
                />
                <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    border: '1px solid #f1f5f9',
                  }}
                  formatter={(value) => [`${value}%`, 'Recovery Rate']}
                />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hospital Status Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Hospital Status Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={hospitalStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {hospitalStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={
                      entry.name === 'Operational' ? '#82ca9d' : 
                      entry.name === 'Partial' ? '#FFBB28' : '#FF8042'
                    } />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    border: '1px solid #f1f5f9',
                  }}
                  formatter={(value, name, props) => [value, props.payload.name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Healthcare Personnel Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-1 lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Healthcare Personnel by District</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={healthcarePersonnelData}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  tick={{ fontSize: 12 }}
                  height={80}
                />
                <YAxis />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    border: '1px solid #f1f5f9',
                  }}
                />
                <Legend />
                <Bar dataKey="doctors" name="Total Doctors" fill="#0088FE" radius={[4, 4, 0, 0]} />
                <Bar dataKey="availableDoctors" name="Available Doctors" fill="#00C49F" radius={[4, 4, 0, 0]} />
                <Bar dataKey="staff" name="Total Staff" fill="#8884d8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="availableStaff" name="Available Staff" fill="#82ca9d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DistrictCharts;
