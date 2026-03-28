import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Maximize2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const COLORS = ['#10b981', '#f43f5e', '#f59e0b', '#3b82f6', '#8b5cf6', '#06b6d4', '#8b5cf6'];

const DashboardView = () => {
  const [data, setData] = useState({
    gender_distribution: [],
    ward_distribution: [],
    top_areas: []
  });
  const [loading, setLoading] = useState(true);
  const [expandedChart, setExpandedChart] = useState(null); // 'gender' | 'ward' | 'area' | null

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/records/analytics`);
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderGenderChart = (isExpanded = false) => (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data.gender_distribution}
          cx="50%"
          cy="50%"
          innerRadius={isExpanded ? 100 : 60}
          outerRadius={isExpanded ? 140 : 80}
          paddingAngle={5}
          dataKey="value"
          nameKey="name"
          minAngle={15}
        >
          {data.gender_distribution.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
        />
        <Legend verticalAlign="bottom" height={isExpanded ? 60 : 36} wrapperStyle={isExpanded ? { fontSize: '14px', paddingTop: '20px' } : {}}/>
      </PieChart>
    </ResponsiveContainer>
  );

  const renderWardChart = (isExpanded = false) => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data.ward_distribution} margin={{ top: 20, right: 30, left: 20, bottom: isExpanded ? 40 : 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: isExpanded ? 14 : 12, fill: 'hsl(var(--muted-foreground))' }} 
          angle={isExpanded ? -45 : 0}
          textAnchor={isExpanded ? 'end' : 'middle'}
        />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: isExpanded ? 14 : 12, fill: 'hsl(var(--muted-foreground))' }} />
        <Tooltip 
          cursor={{ fill: 'hsl(var(--primary))', opacity: 0.1 }}
          contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
        />
        <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={isExpanded ? 60 : 40} />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderAreaChart = (isExpanded = false) => {
    // If expanded and many top areas, dynamically scale height to prevent crunched labels
    const dynamicHeight = isExpanded ? Math.max(500, data.top_areas.length * 60) : "100%";
    return (
      <ResponsiveContainer width="100%" height={dynamicHeight}>
        <BarChart data={data.top_areas} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis type="number" hide />
          <YAxis 
            type="category" 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: isExpanded ? 14 : 12, fill: 'hsl(var(--foreground))' }} 
            width={isExpanded ? 250 : 180} 
          />
          <Tooltip 
             cursor={{ fill: 'hsl(var(--primary))', opacity: 0.1 }}
             contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
          />
          <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={isExpanded ? 32 : 24}>
            {data.top_areas.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 mb-8 relative">
        
        {/* Gender Distribution Donut Chart */}
        <div className="glass-panel p-6 rounded-xl shadow-sm border border-border bg-card relative group">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">Electorate Demographics</h3>
            <button 
              onClick={() => setExpandedChart('gender')}
              className="p-1.5 text-muted-foreground hover:bg-muted rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              title="Expand Chart"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
          <div className="h-64 w-full">
            {renderGenderChart(false)}
          </div>
        </div>

        {/* Ward Distribution Bar Chart */}
        <div className="glass-panel p-6 rounded-xl shadow-sm border border-border bg-card relative group">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">Top Wards by Voter Density</h3>
            <button 
              onClick={() => setExpandedChart('ward')}
              className="p-1.5 text-muted-foreground hover:bg-muted rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              title="Expand Chart"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
          <div className="h-64 w-full">
            {renderWardChart(false)}
          </div>
        </div>

        {/* Top Areas Horizontal Bar Chart */}
        <div className="glass-panel p-6 rounded-xl shadow-sm border border-border bg-card md:col-span-2 relative group">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">Highest Density Localities</h3>
            <button 
              onClick={() => setExpandedChart('area')}
              className="p-1.5 text-muted-foreground hover:bg-muted rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              title="Expand Chart"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
          <div className="h-80 w-full overflow-hidden">
            {renderAreaChart(false)}
          </div>
        </div>

      </div>

      {/* Expanded Chart Modal */}
      <AnimatePresence>
        {expandedChart && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-card w-full max-w-6xl h-[85vh] border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/20 flex-shrink-0">
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  {expandedChart === 'gender' && 'Electorate Demographics'}
                  {expandedChart === 'ward' && 'Top Wards by Voter Density'}
                  {expandedChart === 'area' && 'Highest Density Localities'}
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-md hidden sm:block">
                    Expanded View
                  </span>
                  <button 
                    onClick={() => setExpandedChart(null)} 
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Chart Body (Scrollable if internal chart stretches) */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                <div className="w-full h-full min-h-[400px]">
                  {expandedChart === 'gender' && renderGenderChart(true)}
                  {expandedChart === 'ward' && renderWardChart(true)}
                  {expandedChart === 'area' && renderAreaChart(true)}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardView;
