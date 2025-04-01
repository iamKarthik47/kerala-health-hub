
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DistrictSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const DistrictSearch: React.FC<DistrictSearchProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <section className="px-6 md:px-10 py-6 border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search districts by name"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DistrictSearch;
