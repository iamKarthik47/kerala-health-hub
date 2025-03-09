
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardHero: React.FC = () => {
  return (
    <section className="pt-32 pb-20 px-6 md:px-10 bg-gradient-to-b from-health-50 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block rounded-lg bg-health-100 px-3 py-1 text-sm font-medium text-health-800 mb-4"
          >
            Kerala Health Dashboard
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight"
          >
            Kerala Health Central
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-xl text-gray-600 max-w-3xl"
          >
            Comprehensive real-time health monitoring system for Kerala state's healthcare infrastructure and disease surveillance.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <button className="px-5 py-3 rounded-lg bg-health-600 text-white font-medium hover:bg-health-700 transition-colors flex items-center">
              Explore Dashboard
              <ChevronRight className="ml-1 h-4 w-4" />
            </button>
            <button className="px-5 py-3 rounded-lg bg-white text-health-600 font-medium border border-health-200 hover:bg-health-50 transition-colors">
              View Reports
            </button>
          </motion.div>
        </div>
        
        <div className="absolute right-0 top-0 -z-10 mask-radial-faded pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-health-100 via-health-200/40 to-health-300/20 opacity-50 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  );
};

export default DashboardHero;
