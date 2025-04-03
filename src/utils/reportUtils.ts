
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
    // 1. Prepare Report Content for Capture
    // Show the PDF header that's normally hidden
    const pdfHeader = element.querySelector('.pdf-header');
    if (pdfHeader) {
      (pdfHeader as HTMLElement).style.display = 'block';
    }
    
    // Save original tab state
    const tabsList = element.querySelector('[role="tablist"]');
    const activeTabId = element.querySelector('[role="tab"][data-state="active"]')?.getAttribute('data-value') || 'overview';
    
    // Save original display styles of all tab panels
    const tabPanels = element.querySelectorAll('[role="tabpanel"]');
    const originalStyles: { element: HTMLElement, display: string }[] = [];
    
    // Make all tab panels visible for capturing
    tabPanels.forEach((panel: Element) => {
      const panelElement = panel as HTMLElement;
      originalStyles.push({ 
        element: panelElement, 
        display: panelElement.style.display 
      });
      
      // Force display block but with a specific position to stack them
      panelElement.style.display = 'block';
      panelElement.style.pageBreakBefore = 'always';
      panelElement.style.position = 'relative';
    });
    
    // Hide the tab list for PDF
    if (tabsList) {
      (tabsList as HTMLElement).style.display = 'none';
    }
    
    // Add page break markers between tabs
    tabPanels.forEach((panel, index) => {
      if (index > 0) {
        const marker = document.createElement('div');
        marker.className = 'pdf-page-break';
        marker.style.pageBreakBefore = 'always';
        marker.style.height = '20px';
        panel.parentNode?.insertBefore(marker, panel);
      }
    });

    // 2. For 3D visualization, handle specially
    const visualization3D = element.querySelector('[data-html2canvas-capture="true"]');
    if (visualization3D) {
      // Make sure 3D tab is visible
      const tab3D = element.querySelector('[role="tabpanel"][data-value="3d"]');
      if (tab3D) {
        (tab3D as HTMLElement).style.display = 'block';
      }
      
      // Force the 3D scene to render one more frame
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // 3. Wait for rendering to complete
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 4. Capture the content with improved settings
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: 1200,
      onclone: (clonedDoc) => {
        // Fix cloned document for better rendering
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          clonedElement.style.width = '1200px';
          clonedElement.style.height = 'auto';
          clonedElement.style.overflow = 'visible';
          
          // Force all tab panels to be visible in clone
          const clonedPanels = clonedElement.querySelectorAll('[role="tabpanel"]');
          clonedPanels.forEach((panel: Element) => {
            (panel as HTMLElement).style.display = 'block';
            (panel as HTMLElement).style.height = 'auto';
            (panel as HTMLElement).style.overflow = 'visible';
            (panel as HTMLElement).style.position = 'relative';
            (panel as HTMLElement).style.marginBottom = '40px';
          });

          // Add section titles for each tab in the PDF
          const tabNames = ['Overview', 'Detailed Data', 'Visual Analytics', '3D Visualization'];
          clonedPanels.forEach((panel: Element, index: number) => {
            if (index > 0) { // Skip first one as it already has title
              const sectionTitle = clonedDoc.createElement('h2');
              sectionTitle.textContent = tabNames[index];
              sectionTitle.style.fontSize = '18px';
              sectionTitle.style.fontWeight = 'bold';
              sectionTitle.style.marginTop = '40px';
              sectionTitle.style.paddingTop = '20px';
              sectionTitle.style.borderTop = '1px solid #eaeaea';
              panel.insertBefore(sectionTitle, panel.firstChild);
            }
          });
        }
      }
    });
    
    // 5. Create PDF with proper dimensions
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    // 6. Add content to PDF, handling multiple pages
    // First page
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    // Add additional pages if content exceeds one page
    const pageHeight = pdf.internal.pageSize.getHeight();
    if (pdfHeight > pageHeight) {
      let remainingHeight = pdfHeight;
      let currentPosition = -pageHeight;
      
      while (remainingHeight > pageHeight) {
        pdf.addPage();
        pdf.addImage(
          imgData, 'PNG', 
          0, currentPosition, 
          pdfWidth, pdfHeight
        );
        remainingHeight -= pageHeight;
        currentPosition -= pageHeight;
      }
    }
    
    // 7. Restore original styles
    if (pdfHeader) {
      (pdfHeader as HTMLElement).style.display = 'none';
    }
    
    if (tabsList) {
      (tabsList as HTMLElement).style.display = 'flex';
    }
    
    // Remove added page break markers
    const pageBreaks = element.querySelectorAll('.pdf-page-break');
    pageBreaks.forEach(marker => {
      marker.parentNode?.removeChild(marker);
    });
    
    // Restore original tab panel styles
    originalStyles.forEach(item => {
      item.element.style.display = item.display;
      item.element.style.position = '';
      item.element.style.pageBreakBefore = '';
      item.element.style.marginBottom = '';
    });
    
    // Restore original active tab
    const tabButtons = element.querySelectorAll('[role="tab"]');
    tabButtons.forEach((tab: Element) => {
      const tabValue = tab.getAttribute('data-value');
      if (tabValue === activeTabId) {
        (tab as HTMLElement).click();
      }
    });
    
    // 8. Save the PDF
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    // If there's an error, try a simplified version
    try {
      const canvas = await html2canvas(element, {
        scale: 1.5,
        useCORS: true,
        logging: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('portrait', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${filename}.pdf`);
    } catch (fallbackError) {
      console.error("Fallback PDF generation also failed:", fallbackError);
      throw new Error("Could not generate PDF");
    }
  }
};
