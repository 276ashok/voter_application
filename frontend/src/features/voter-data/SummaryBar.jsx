import React from 'react';

const SummaryBar = ({ totals, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-border p-4 mb-6 shadow-sm animate-pulse">
        <div className="h-4 bg-muted/50 rounded w-48 mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-muted/50 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!totals) return null;

  return (
    <div className="bg-white rounded-xl border border-primary/20 p-5 mb-6 shadow-sm sticky top-0 z-20 backdrop-blur-xl bg-white/95">
      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
        Filtered Results Summary
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:divide-x divide-border">
        <div className="flex flex-col md:px-4 first:px-0">
          <span className="text-sm text-muted-foreground font-medium mb-1">Total Votes</span>
          <span className="text-2xl font-bold text-foreground">
            {Number(totals.total_votes || 0).toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col md:px-4">
          <span className="text-sm text-muted-foreground font-medium mb-1">Male</span>
          <span className="text-2xl font-bold text-foreground">
            {Number(totals.total_male || 0).toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col md:px-4">
          <span className="text-sm text-muted-foreground font-medium mb-1">Female</span>
          <span className="text-2xl font-bold text-foreground">
            {Number(totals.total_female || 0).toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col md:px-4">
          <span className="text-sm text-muted-foreground font-medium mb-1">Others</span>
          <span className="text-2xl font-bold text-foreground">
            {Number(totals.total_others || 0).toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col md:px-4 col-span-2 md:col-span-1 bg-primary/5 rounded-lg p-3 md:p-0 md:bg-transparent md:rounded-none">
          <span className="text-sm text-primary font-bold mb-1 uppercase tracking-wider">Grand Total</span>
          <span className="text-3xl font-black text-primary">
            {Number(totals.grand_total || 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SummaryBar;
