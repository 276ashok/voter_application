import React, { useState } from 'react';

export default function ManualAddModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    ward_no: '',
    part_no: '',
    serial_no: '',
    street: '',
    booth_address: '',
    voter_area: '',
    male_count: 0,
    female_count: 0,
    other_count: 0
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (['ward_no', 'part_no', 'serial_no', 'male_count', 'female_count', 'other_count'].includes(name)) {
      value = value ? parseInt(value, 10) : '';
    }
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      street: form.street || 'Default Street', // Ensuring required field
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-panel modal-content" onClick={e => e.stopPropagation()}>
        <h2 style={{ marginBottom: '1.5rem' }}>Add Voter Record</h2>
        <form onSubmit={handleSubmit}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Ward No *</label>
              <input type="number" required name="ward_no" value={form.ward_no} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Part No *</label>
              <input type="number" required name="part_no" value={form.part_no} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Street Name *</label>
            <input type="text" required name="street" value={form.street} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Voter Area / Locality</label>
            <input type="text" name="voter_area" value={form.voter_area} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Booth Address</label>
            <input type="text" name="booth_address" value={form.booth_address} onChange={handleChange} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
            <div className="form-group">
              <label>Male Count</label>
              <input type="number" name="male_count" value={form.male_count} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Female Count</label>
              <input type="number" name="female_count" value={form.female_count} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Other Count</label>
              <input type="number" name="other_count" value={form.other_count} onChange={handleChange} />
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary">Save Record</button>
          </div>
        </form>
      </div>
    </div>
  );
}
