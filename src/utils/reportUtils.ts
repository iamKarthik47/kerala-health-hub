
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
  if (!element) {
    console.error("Element not found for PDF generation");
    return;
  }

  try {
    // Ensure all tabs content is visible before capturing
    const tabContents = element.querySelectorAll('[role="tabpanel"]');
    const originalDisplays: string[] = [];
    
    // Save original display styles and make all tabs visible
    tabContents.forEach((tab: Element) => {
      const tabElement = tab as HTMLElement;
      originalDisplays.push(tabElement.style.display);
      tabElement.style.display = 'block';
    });
    
    // Wait a moment for the DOM to update
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Capture the element with improved settings
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      useCORS: true,
      logging: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      windowWidth: 1200, // Standardize width
      onclone: (clonedDoc) => {
        // Ensure 3D visualizations are properly rendered in the cloned document
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          clonedElement.style.width = '1200px';
          clonedElement.style.height = 'auto';
        }
      }
    });
    
    // Create PDF with proper dimensions
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    // Add the image to the PDF
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    // Add additional pages if content exceeds one page
    if (pdfHeight > pdf.internal.pageSize.getHeight()) {
      let remainingHeight = pdfHeight;
      let currentPosition = -pdf.internal.pageSize.getHeight();
      
      while (remainingHeight > 0) {
        pdf.addPage();
        pdf.addImage(
          imgData, 'PNG', 
          0, currentPosition, 
          pdfWidth, pdfHeight
        );
        remainingHeight -= pdf.internal.pageSize.getHeight();
        currentPosition -= pdf.internal.pageSize.getHeight();
      }
    }
    
    // Restore original display styles
    tabContents.forEach((tab: Element, index: number) => {
      const tabElement = tab as HTMLElement;
      tabElement.style.display = originalDisplays[index];
    });
    
    // Save the PDF
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
