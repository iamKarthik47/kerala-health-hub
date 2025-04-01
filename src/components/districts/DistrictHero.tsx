
import React from 'react';
import { motion } from 'framer-motion';

const DistrictHero: React.FC = () => {
  return (
    <section className="pt-32 pb-16 px-6 md:px-10 bg-gradient-to-b from-health-50 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block rounded-lg bg-health-100 px-3 py-1 text-sm font-medium text-health-800 mb-4"
          >
            District Overview
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight"
          >
            Kerala Health Districts
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-xl text-gray-600 max-w-3xl"
          >
            Explore health infrastructure and statistics across all districts in Kerala
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default DistrictHero;
