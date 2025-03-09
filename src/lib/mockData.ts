
import { Activity, HeartPulse, UserCheck, AlertTriangle, Thermometer, Microscope, Users, Building, Bed, ShieldCheck } from 'lucide-react';

const mockData = {
  statistics: [
    {
      id: 'total-patients',
      title: 'Total Patients',
      value: 156789,
      icon: Users,
      trend: { value: 12, isPositive: true },
      description: 'Across all districts',
      color: 'health'
    },
    {
      id: 'recovery-rate',
      title: 'Recovery Rate',
      value: 94.8,
      icon: UserCheck,
      trend: { value: 2.3, isPositive: true },
      description: 'Past 30 days',
      suffix: '%',
      color: 'emerald'
    },
    {
      id: 'critical-cases',
      title: 'Critical Cases',
      value: 487,
      icon: AlertTriangle,
      trend: { value: 4.1, isPositive: false },
      description: 'Currently under care',
      color: 'rose'
    },
    {
      id: 'active-facilities',
      title: 'Active Facilities',
      value: 328,
      icon: Building,
      trend: { value: 1.5, isPositive: true },
      description: 'Hospitals & clinics',
      color: 'amber'
    }
  ],
  
  patientData: [
    { name: 'Jan', recovered: 4500, admitted: 5200, deceased: 210 },
    { name: 'Feb', recovered: 5100, admitted: 5800, deceased: 230 },
    { name: 'Mar', recovered: 4800, admitted: 5300, deceased: 180 },
    { name: 'Apr', recovered: 5600, admitted: 6200, deceased: 190 },
    { name: 'May', recovered: 6200, admitted: 6800, deceased: 170 },
    { name: 'Jun', recovered: 7100, admitted: 7500, deceased: 165 },
    { name: 'Jul', recovered: 7800, admitted: 8200, deceased: 155 },
    { name: 'Aug', recovered: 8500, admitted: 9100, deceased: 180 },
    { name: 'Sep', recovered: 9200, admitted: 9800, deceased: 160 },
    { name: 'Oct', recovered: 8800, admitted: 9400, deceased: 145 },
    { name: 'Nov', recovered: 9500, admitted: 10200, deceased: 130 },
    { name: 'Dec', recovered: 10200, admitted: 10900, deceased: 120 }
  ],
  
  hospitalData: [
    {
      id: 1,
      name: 'Kerala Medical College Hospital',
      type: 'Medical College',
      location: 'Thiruvananthapuram',
      district: 'Thiruvananthapuram',
      bedCapacity: 1200,
      availableBeds: 240,
      occupancyRate: 80,
      patientCount: 960,
      status: 'operational'
    },
    {
      id: 2,
      name: 'District General Hospital Ernakulam',
      type: 'District Hospital',
      location: 'Kochi',
      district: 'Ernakulam',
      bedCapacity: 850,
      availableBeds: 93,
      occupancyRate: 89,
      patientCount: 757,
      status: 'partial'
    },
    {
      id: 3,
      name: 'Kozhikode Community Health Center',
      type: 'Community Hospital',
      location: 'Kozhikode',
      district: 'Kozhikode',
      bedCapacity: 650,
      availableBeds: 182,
      occupancyRate: 72,
      patientCount: 468,
      status: 'operational'
    },
    {
      id: 4,
      name: 'Thrissur Medical Centre',
      type: 'Specialty Hospital',
      location: 'Thrissur',
      district: 'Thrissur',
      bedCapacity: 720,
      availableBeds: 36,
      occupancyRate: 95,
      patientCount: 684,
      status: 'critical'
    }
  ],
  
  diseaseData: [
    {
      name: 'Dengue Fever',
      cases: 824,
      trend: 12,
      severity: 'high',
      location: 'Thrissur'
    },
    {
      name: 'COVID-19',
      cases: 1267,
      trend: -8,
      severity: 'medium',
      location: 'Statewide'
    },
    {
      name: 'Leptospirosis',
      cases: 378,
      trend: 4,
      severity: 'medium',
      location: 'Alappuzha'
    },
    {
      name: 'H1N1 Influenza',
      cases: 156,
      trend: -2,
      severity: 'low',
      location: 'Kozhikode'
    },
    {
      name: 'Cholera',
      cases: 42,
      trend: 15,
      severity: 'critical',
      location: 'Malappuram'
    }
  ],
  
  resourceData: [
    {
      name: 'Ventilators',
      available: 187,
      total: 650,
      critical: true,
      district: 'Thiruvananthapuram'
    },
    {
      name: 'ICU Beds',
      available: 315,
      total: 820,
      critical: true,
      district: 'Ernakulam'
    },
    {
      name: 'Oxygen Cylinders',
      available: 1240,
      total: 1800,
      critical: false,
      district: 'Kozhikode'
    },
    {
      name: 'Ambulances',
      available: 78,
      total: 120,
      critical: false,
      district: 'Wayanad'
    }
  ],
  
  districtData: [
    { name: 'Thiruvananthapuram', cases: 2340, recovered: 2156, active: 142, deceased: 42 },
    { name: 'Kollam', cases: 1940, recovered: 1837, active: 89, deceased: 14 },
    { name: 'Pathanamthitta', cases: 1540, recovered: 1478, active: 52, deceased: 10 },
    { name: 'Alappuzha', cases: 1720, recovered: 1650, active: 58, deceased: 12 },
    { name: 'Kottayam', cases: 1620, recovered: 1552, active: 54, deceased: 14 },
    { name: 'Idukki', cases: 1180, recovered: 1152, active: 20, deceased: 8 },
    { name: 'Ernakulam', cases: 2280, recovered: 2156, active: 102, deceased: 22 },
    { name: 'Thrissur', cases: 1980, recovered: 1856, active: 94, deceased: 30 },
    { name: 'Palakkad', cases: 1740, recovered: 1668, active: 56, deceased: 16 },
    { name: 'Malappuram', cases: 2120, recovered: 2024, active: 76, deceased: 20 },
    { name: 'Kozhikode', cases: 2240, recovered: 2142, active: 76, deceased: 22 },
    { name: 'Wayanad', cases: 980, recovered: 952, active: 20, deceased: 8 },
    { name: 'Kannur', cases: 1640, recovered: 1568, active: 54, deceased: 18 },
    { name: 'Kasaragod', cases: 1340, recovered: 1290, active: 40, deceased: 10 }
  ]
};

export default mockData;
