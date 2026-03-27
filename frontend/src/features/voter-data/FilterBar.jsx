import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';

const FilterBar = ({ filters, setFilters, onClear }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [isExpanded, setIsExpanded] = useState(false);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(localFilters);
    }, 500);
    return () => clearTimeout(timer);
  }, [localFilters, setFilters]);

  // Sync if external clear happens
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-xl border border-border p-4 mb-6 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Global Search */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            name="search"
            value={localFilters.search || ''}
            onChange={handleChange}
            placeholder="Search by Street, Area or Booth address..."
            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm bg-background"
          />
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm font-medium transition-colors ${isExpanded ? 'bg-secondary text-foreground' : 'bg-white hover:bg-secondary'}`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Advanced Filters</span>
          </button>
          
          <button 
            onClick={onClear}
            className="flex items-center gap-2 px-4 py-2.5 text-destructive hover:bg-destructive/10 border border-transparent rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-border animate-in fade-in slide-in-from-top-2">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Ward Number</label>
            <input type="number" name="ward" value={localFilters.ward || ''} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="e.g. 1" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Part Number</label>
            <input type="number" name="part" value={localFilters.part || ''} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="e.g. 195" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Street</label>
            <input type="text" name="street" value={localFilters.street || ''} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Search street..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Area</label>
            <input type="text" name="area" value={localFilters.area || ''} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Search area..." />
          </div>
          
          {/* Vote Ranges */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Votes Range</label>
            <div className="flex gap-2">
              <input type="number" name="min_votes" value={localFilters.min_votes || ''} onChange={handleChange} className="flex-1 w-full px-3 py-2 border border-border rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Min" />
              <span className="text-muted-foreground self-center">-</span>
              <input type="number" name="max_votes" value={localFilters.max_votes || ''} onChange={handleChange} className="flex-1 w-full px-3 py-2 border border-border rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Max" />
            </div>
          </div>
          
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Total Voters Range</label>
            <div className="flex gap-2">
              <input type="number" name="min_total" value={localFilters.min_total || ''} onChange={handleChange} className="flex-1 w-full px-3 py-2 border border-border rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Min" />
              <span className="text-muted-foreground self-center">-</span>
              <input type="number" name="max_total" value={localFilters.max_total || ''} onChange={handleChange} className="flex-1 w-full px-3 py-2 border border-border rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Max" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
