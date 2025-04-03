import React, { useState } from 'react';
import { 
  FileText, Download, ChevronLeft, ChevronRight, 
  Printer, File, Share2, Eye, BarChart, PieChart
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { downloadPDF } from '@/utils/reportUtils';
import { toast } from "@/components/ui/use-toast";
import ReportVisualization3D from './ReportVisualization3D';

interface ReportData {
  title: string;
  subtitle: string;
  date: string;
  type: string;
  data: any;
}

interface ReportViewerProps {
  isOpen: boolean;
  onClose: () => void;
  report: ReportData | null;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ isOpen, onClose, report }) => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  if (!report) return null;
  
  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      toast({
        title: "Preparing report for download",
        description: "Please wait while we generate your PDF..."
      });
      
      // Small delay to ensure the toast is shown
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await downloadPDF('report-to-download', `${report.title.replace(/\s+/g, '_')}_report`);
      
      toast({
        title: "Report downloaded",
        description: "Your PDF has been successfully generated and downloaded."
      });
    } catch (error) {
      console.error("Error downloading report:", error);
      toast({
        title: "Download failed",
        description: "There was an issue generating your PDF report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const printReport = () => {
    window.print();
  };

  // Function to prepare 3D visualization data
  const prepare3DData = () => {
    if (report.type === "State") {
      return report.data.districtVisualizationData || {
        cases: [],
        recovered: [],
        active: [],
        labels: []
      };
    }
    
    // For district reports, use a simpler format
    return {
      cases: [report.data.cases],
      recovered: [report.data.recovered],
      active: [report.data.active],
      labels: [report.title.split(' ')[0]] // First word of the title (district name)
    };
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4 mb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{report.title}</DialogTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={printReport}>
                <Printer className="h-4 w-4 mr-1" />
                Print
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
              >
                <File className="h-4 w-4 mr-1" />
                {isGeneratingPDF ? "Generating..." : "PDF"}
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <Eye className="h-4 w-4 mr-1" />
                Close
              </Button>
            </div>
          </div>
          <div className="text-sm text-gray-500 flex items-center justify-between mt-2">
            <span>{report.subtitle}</span>
            <span>Generated on: {report.date}</span>
          </div>
        </DialogHeader>
        
        <div id="report-to-download" className="p-2 bg-white">
          {/* Title section that will appear in the PDF */}
          <div className="print-only mb-6 pdf-header">
            <h1 className="text-2xl font-bold">{report.title}</h1>
            <p className="text-gray-500">{report.subtitle}</p>
            <p className="text-gray-500">Generated on: {report.date}</p>
            <div className="h-1 bg-health-500 w-1/4 mt-2"></div>
          </div>
          
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Detailed Data</TabsTrigger>
              <TabsTrigger value="charts">Visual Analytics</TabsTrigger>
              <TabsTrigger value="3d">3D Visualization</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Executive Summary</h3>
                <p className="text-gray-700">
                  This report provides a comprehensive analysis of health metrics for {report.title.includes("State") ? "Kerala State" : report.title.split(' ')[0]}.
                  It includes data on cases, recoveries, hospital infrastructure, and healthcare personnel.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-white p-4 rounded-md border border-gray-200">
                    <h4 className="font-medium mb-2">Key Statistics</h4>
                    <ul className="space-y-1">
                      <li className="text-sm flex justify-between">
                        <span>Total Cases:</span> 
                        <span className="font-medium">{report.data.cases?.toLocaleString()}</span>
                      </li>
                      <li className="text-sm flex justify-between">
                        <span>Recovered:</span> 
                        <span className="font-medium">{report.data.recovered?.toLocaleString()}</span>
                      </li>
                      <li className="text-sm flex justify-between">
                        <span>Active Cases:</span> 
                        <span className="font-medium">{report.data.active?.toLocaleString()}</span>
                      </li>
                      <li className="text-sm flex justify-between">
                        <span>Recovery Rate:</span> 
                        <span className="font-medium">
                          {((report.data.recovered / report.data.cases) * 100).toFixed(1)}%
                        </span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md border border-gray-200">
                    <h4 className="font-medium mb-2">Healthcare Infrastructure</h4>
                    <ul className="space-y-1">
                      <li className="text-sm flex justify-between">
                        <span>Total Hospitals:</span> 
                        <span className="font-medium">{report.data.hospitals?.length || 0}</span>
                      </li>
                      <li className="text-sm flex justify-between">
                        <span>Total Beds:</span> 
                        <span className="font-medium">{report.data.totalBeds}</span>
                      </li>
                      <li className="text-sm flex justify-between">
                        <span>Available Beds:</span> 
                        <span className="font-medium">{report.data.availableBeds}</span>
                      </li>
                      <li className="text-sm flex justify-between">
                        <span>Occupancy Rate:</span> 
                        <span className="font-medium">
                          {((1 - (report.data.availableBeds / report.data.totalBeds)) * 100).toFixed(1)}%
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Summary Analysis</h3>
                <p className="text-gray-700 mb-4">
                  Based on the current health metrics and infrastructure data, 
                  {report.title.includes("State") ? " Kerala State" : " " + report.title.split(' ')[0]}
                  {" " + (((report.data.recovered / report.data.cases) * 100) > 85 ? 
                    "shows a positive trend in recovery rates with efficient management of cases." : 
                    "faces challenges in recovery rates requiring additional healthcare interventions.")
                  }
                </p>
                <div className="flex items-center justify-between text-sm bg-white p-3 rounded-md border border-gray-200">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Report ID: KH-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</span>
                  </div>
                  <span className="text-gray-500">Classification: Standard Analysis</span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 overflow-x-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Health Infrastructure Data</h3>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hospital Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Bed Capacity</TableHead>
                      <TableHead>Available Beds</TableHead>
                      <TableHead>Occupancy</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.data.hospitals?.slice(0, 10).map((hospital: any) => (
                      <TableRow key={hospital.id}>
                        <TableCell className="font-medium">{hospital.name}</TableCell>
                        <TableCell>{hospital.type}</TableCell>
                        <TableCell>{hospital.location}</TableCell>
                        <TableCell>{hospital.bedCapacity}</TableCell>
                        <TableCell>{hospital.availableBeds}</TableCell>
                        <TableCell>
                          {((1 - (hospital.availableBeds / hospital.bedCapacity)) * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {report.data.hospitals && report.data.hospitals.length > 10 && (
                  <p className="text-xs text-gray-500 mt-2 text-right">
                    Showing 10 of {report.data.hospitals.length} hospitals
                  </p>
                )}
                
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Healthcare Personnel Distribution</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-md border border-gray-200">
                      <h5 className="font-medium mb-2 text-sm">Medical Staff</h5>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Available</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Doctors</TableCell>
                            <TableCell>{report.data.totalDoctors || 0}</TableCell>
                            <TableCell>{report.data.availableDoctors || 0}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Nurses</TableCell>
                            <TableCell>{report.data.totalStaff ? Math.floor(report.data.totalStaff * 0.6) : 0}</TableCell>
                            <TableCell>{report.data.availableStaff ? Math.floor(report.data.availableStaff * 0.6) : 0}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Support Staff</TableCell>
                            <TableCell>{report.data.totalStaff ? Math.floor(report.data.totalStaff * 0.4) : 0}</TableCell>
                            <TableCell>{report.data.availableStaff ? Math.floor(report.data.availableStaff * 0.4) : 0}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="bg-white p-4 rounded-md border border-gray-200">
                      <h5 className="font-medium mb-2 text-sm">Case Management</h5>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Status</TableHead>
                            <TableHead>Count</TableHead>
                            <TableHead>Percentage</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Active Cases</TableCell>
                            <TableCell>{report.data.active?.toLocaleString()}</TableCell>
                            <TableCell>{((report.data.active / report.data.cases) * 100).toFixed(1)}%</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Recovered</TableCell>
                            <TableCell>{report.data.recovered?.toLocaleString()}</TableCell>
                            <TableCell>{((report.data.recovered / report.data.cases) * 100).toFixed(1)}%</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Deceased</TableCell>
                            <TableCell>{report.data.deceased?.toLocaleString()}</TableCell>
                            <TableCell>{((report.data.deceased / report.data.cases) * 100).toFixed(1)}%</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="charts" className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Visual Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-md border border-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart className="h-10 w-10 mx-auto text-health-500 mb-2" />
                      <p className="text-sm text-gray-500">
                        Case Distribution Chart would render here.
                        The chart would show case distribution by categories.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md border border-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <PieChart className="h-10 w-10 mx-auto text-health-500 mb-2" />
                      <p className="text-sm text-gray-500">
                        Recovery Rate Pie Chart would render here.
                        The chart would show recovery percentage vs active cases.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="3d" className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 mb-4">3D Health Metrics Visualization</h3>
                <p className="text-sm text-gray-600 mb-4">
                  This interactive 3D visualization represents health metrics across {report.type === "State" ? "districts" : "this district"}. 
                  Click and drag to rotate the view, and use the scroll wheel to zoom in/out.
                </p>
                
                <div className="bg-white rounded-lg border border-gray-200 p-2">
                  <ReportVisualization3D data={prepare3DData()} height={400} />
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
                  <h4 className="text-sm font-medium text-blue-800">How to interpret this visualization</h4>
                  <ul className="mt-2 space-y-1 text-xs text-blue-700">
                    <li>• Red bars represent total cases</li>
                    <li>• Green bars represent recovered cases</li>
                    <li>• Yellow bars represent active cases</li>
                    <li>• Bar heights are proportional to the values they represent</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter className="border-t pt-4 mt-4">
          <div className="flex items-center justify-between w-full">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous Report
            </Button>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => {
                const tabs = ["overview", "details", "charts", "3d"];
                const currentIndex = tabs.indexOf(activeTab);
                const nextIndex = (currentIndex + 1) % tabs.length;
                setActiveTab(tabs[nextIndex]);
              }}>
                Next Section
              </Button>
              <Button 
                onClick={handleDownloadPDF} 
                disabled={isGeneratingPDF}
              >
                <Download className="h-4 w-4 mr-1" />
                {isGeneratingPDF ? "Generating..." : "Download Report"}
              </Button>
            </div>
            <Button variant="ghost" size="sm">
              Next Report
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportViewer;
