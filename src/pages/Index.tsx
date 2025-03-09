
import React from 'react';
import PageTransition from '../components/transitions/PageTransition';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Dashboard from '../components/dashboard/Dashboard';
import { HealthDataProvider } from '../context/HealthDataContext';

const Index: React.FC = () => {
  return (
    <PageTransition>
      <HealthDataProvider>
        <div className="min-h-screen bg-white">
          <Header />
          <Dashboard />
          <Footer />
        </div>
      </HealthDataProvider>
    </PageTransition>
  );
};

export default Index;
