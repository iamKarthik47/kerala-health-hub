
import React from 'react';
import { Github, Mail, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 bg-gray-50/50 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-health-500 to-health-700 flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="ml-2 text-lg font-semibold text-gray-900">
                Kerala Health Central
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              A comprehensive health monitoring system for Kerala state, providing real-time data and analytics on healthcare metrics.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Navigation</h3>
            <ul className="space-y-2">
              {['Dashboard', 'Hospitals', 'Diseases', 'Resources', 'Reports'].map((item) => (
                <li key={item}>
                  <a 
                    href={`/${item.toLowerCase()}`} 
                    className="text-gray-600 hover:text-health-600 text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              {['Documentation', 'API Access', 'Data Dictionary', 'Research', 'Help Center'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-600 hover:text-health-600 text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Data Policy', 'Accessibility', 'Contact Us'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-600 hover:text-health-600 text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Kerala Health Department. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-4 md:mt-0">
            Made with ♥ for better healthcare in Kerala
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
