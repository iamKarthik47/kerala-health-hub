
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export interface ReportData {
  title: string;
  subtitle: string;
  date: string;
  type: string;
  data: any;
}

export const generateReportData = (districtName: string, districtData: any, hospitals: any[]): ReportData => {
  // Calculate report metrics
  const districtHospitals = hospitals.filter(h => h.district === districtName);
  const totalBeds = districtHospitals.reduce((sum, h) => sum + h.bedCapacity, 0);
  const availableBeds = districtHospitals.reduce((sum, h) => sum + h.availableBeds, 0);
  const totalDoctors = districtHospitals.reduce((sum, h) => sum + h.doctors, 0);
  const availableDoctors = districtHospitals.reduce((sum, h) => sum + h.availableDoctors, 0);
  const totalStaff = districtHospitals.reduce((sum, h) => sum + h.staff, 0);
  const availableStaff = districtHospitals.reduce((sum, h) => sum + h.availableStaff, 0);
  
  return {
    title: `${districtName} District Health Report`,
    subtitle: "Comprehensive Health Infrastructure Analysis",
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    type: "District",
    data: {
      ...districtData,
      hospitals: districtHospitals,
      totalBeds,
      availableBeds,
      totalDoctors,
      availableDoctors,
      totalStaff,
      availableStaff
    }
  };
};

export const downloadPDF = async (elementId: string, filename: string): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2,
    logging: false,
    useCORS: true,
  });
  
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  const imgWidth = 210;
  const imgHeight = canvas.height * imgWidth / canvas.width;
  
  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  pdf.save(`${filename}.pdf`);
};
