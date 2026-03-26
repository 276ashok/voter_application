import React from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Users, Hash } from 'lucide-react';

const RecordDetailsModal = ({ record, onClose }) => {
  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-panel w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden relative my-8 border border-white/10"
      >
        <div className="px-6 py-5 border-b border-border/50 flex justify-between items-center bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 text-primary p-2 rounded-lg">
              <Hash className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground tracking-tight">Record Details</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Serial No: {record.serial_no || '-'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Location Details */}
          <div>
            <div className="flex items-center gap-2 mb-4 px-1">
              <MapPin className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Location Profile</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-background/50 border border-border/50 p-4 rounded-xl">
                <span className="text-xs text-muted-foreground block mb-1">Ward Number</span>
                <span className="font-medium text-foreground">{record.ward_no ?? '-'}</span>
              </div>
              <div className="bg-background/50 border border-border/50 p-4 rounded-xl">
                <span className="text-xs text-muted-foreground block mb-1">Part Number</span>
                <span className="font-medium text-foreground">{record.part_no ?? '-'}</span>
              </div>
              <div className="bg-background/50 border border-border/50 p-4 rounded-xl md:col-span-2">
                <span className="text-xs text-muted-foreground block mb-1">Street</span>
                <span className="font-medium text-foreground leading-relaxed font-tamil">{record.street || '-'}</span>
              </div>
              <div className="bg-background/50 border border-border/50 p-4 rounded-xl md:col-span-2">
                <span className="text-xs text-muted-foreground block mb-1">Votes Distributed</span>
                <span className="font-medium text-foreground leading-relaxed">{record.vote_count || 0}</span>
              </div>
              <div className="bg-background/50 border border-border/50 p-4 rounded-xl md:col-span-2">
                <span className="text-xs text-muted-foreground block mb-1">Booth Address</span>
                <span className="font-medium text-foreground leading-relaxed font-tamil">{record.booth_address || '-'}</span>
              </div>
              <div className="bg-background/50 border border-border/50 p-4 rounded-xl md:col-span-2">
                <span className="text-xs text-muted-foreground block mb-1">Voter Area</span>
                <span className="font-medium text-foreground leading-relaxed font-tamil">{record.voter_area || '-'}</span>
              </div>
            </div>
          </div>

          {/* Demographics Overview */}
          <div>
            <div className="flex items-center gap-2 mb-4 px-1">
              <Users className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Demographics Overview</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl text-center">
                <span className="text-xs text-emerald-600 block mb-1 font-medium">Male</span>
                <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{record.male_count || 0}</span>
              </div>
              <div className="bg-rose-500/5 border border-rose-500/20 p-4 rounded-xl text-center">
                <span className="text-xs text-rose-600 block mb-1 font-medium">Female</span>
                <span className="text-xl font-bold text-rose-700 dark:text-rose-400">{record.female_count || 0}</span>
              </div>
              <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl text-center">
                <span className="text-xs text-amber-600 block mb-1 font-medium">Others</span>
                <span className="text-xl font-bold text-amber-700 dark:text-amber-400">{record.other_count || 0}</span>
              </div>
              <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl text-center shadow-inner pt-4">
                <span className="text-xs text-primary block mb-1 font-bold">TOTAL</span>
                <span className="text-xl font-black text-primary">{record.total_voters || 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border/50 bg-muted/10 flex justify-end">
          <button 
            onClick={onClose} 
            className="px-6 py-2 bg-background border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
          >
            Close Details
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RecordDetailsModal;
