import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save } from 'lucide-react';

const AddRecordModal = ({ onClose, onSubmit, initialFilters }) => {
  const [formData, setFormData] = useState({
    ward_no: initialFilters?.ward || '',
    part_no: initialFilters?.part || '',
    street: initialFilters?.street || '',
    serial_no: '',
    booth_address: '',
    voter_area: initialFilters?.area || '',
    vote_count: '',
    male_count: 0,
    female_count: 0,
    other_count: 0,
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value ? parseInt(value) : '') : value,
    }));
  };

  const currentTotal = 
    (parseInt(formData.male_count) || 0) + 
    (parseInt(formData.female_count) || 0) + 
    (parseInt(formData.other_count) || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex sm:items-center items-end justify-center sm:p-4 p-0 bg-background/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="bg-card w-full max-w-2xl border border-border sm:rounded-xl rounded-t-2xl shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/20 flex-shrink-0 sm:rounded-t-xl rounded-t-2xl">
          <h2 className="text-xl font-semibold text-foreground tracking-tight">Add New Record</h2>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1">
          <form id="add-record-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            
            <div className="space-y-1.5 focus-within:text-primary">
              <label className="text-sm font-medium text-foreground">Serial No</label>
              <input 
                type="number" name="serial_no" value={formData.serial_no} onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
              />
            </div>

            <div className="space-y-1.5 focus-within:text-primary">
              <label className="text-sm font-medium text-foreground">Part No *</label>
              <input 
                required type="number" name="part_no" value={formData.part_no} onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
              />
            </div>

            <div className="space-y-1.5 focus-within:text-primary">
              <label className="text-sm font-medium text-foreground">Ward No *</label>
              <input 
                required type="number" name="ward_no" value={formData.ward_no} onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
              />
            </div>

            <div className="space-y-1.5 focus-within:text-primary">
              <label className="text-sm font-medium text-foreground">Vote Count</label>
              <input 
                type="number" name="vote_count" value={formData.vote_count} onChange={handleChange} min="0" placeholder="0"
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2 focus-within:text-primary">
              <label className="text-sm font-medium text-foreground">Street / Location *</label>
              <input 
                required type="text" name="street" value={formData.street} onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2 focus-within:text-primary">
              <label className="text-sm font-medium text-foreground">Booth Address</label>
              <input 
                type="text" name="booth_address" value={formData.booth_address} onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2 focus-within:text-primary">
              <label className="text-sm font-medium text-foreground">Voter Area (Tamil)</label>
              <input 
                type="text" name="voter_area" value={formData.voter_area} onChange={handleChange}
                dir="auto"
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow font-tamil"
              />
            </div>

            <div className="col-span-1 md:col-span-2 border-t border-border pt-5 mt-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Voter Demographics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-emerald-600">Male</label>
                  <input 
                    type="number" name="male_count" value={formData.male_count} onChange={handleChange} min="0" placeholder="0"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-rose-600">Female</label>
                  <input 
                    type="number" name="female_count" value={formData.female_count} onChange={handleChange} min="0" placeholder="0"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-amber-600">Others</label>
                  <input 
                    type="number" name="other_count" value={formData.other_count} onChange={handleChange} min="0" placeholder="0"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
                <div className="space-y-1.5 pt-6">
                   <div className="flex items-center justify-between px-3 py-2 bg-primary/10 rounded-lg border border-primary/20">
                      <span className="text-sm font-medium text-primary">Total:</span>
                      <span className="text-base font-bold text-primary">{currentTotal}</span>
                   </div>
                </div>
              </div>
            </div>

          </form>
        </div>

        <div className="p-4 border-t border-border flex justify-end gap-3 bg-muted/20 flex-shrink-0">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-5 py-2 border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="add-record-form"
            className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Record
          </button>
        </div>

      </motion.div>
    </div>
  );
};

export default AddRecordModal;
