import React, { useState, useRef } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function FileUpload({ onUploadSuccess }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (file) => {
    if (!file.name.match(/\.(xlsx|xls|csv)$/)) {
      setMessage("Please upload an Excel or CSV file.");
      setIsError(true);
      return;
    }

    setUploading(true);
    setMessage('');
    setIsError(false);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      if (res.ok) {
        setMessage(`Success: ${data.records_added} records added.`);
        setIsError(false);
        onUploadSuccess();
      } else {
        setMessage(`Error: ${data.detail || 'Upload failed'}`);
        setIsError(true);
      }
    } catch (err) {
      setMessage('Error connecting to server. Is the backend running?');
      setIsError(true);
    }
    
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="glass-panel">
      <h3 style={{ marginBottom: '1rem' }}>Data Import</h3>
      <div 
        className={`upload-zone ${isDragActive ? 'active' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        {uploading ? (
          <div className="loading-spinner" />
        ) : (
          <>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📁</div>
            <p style={{ color: 'var(--text-secondary)' }}>
              Click or drag an Excel/CSV file here. <br/><br/>
              <small>Includes Tamil column parsing.</small>
            </p>
          </>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept=".xlsx,.xls,.csv" 
          onChange={handleChange}
        />
      </div>
      {message && (
        <p style={{ marginTop: '1rem', padding: '0.5rem', borderRadius: '4px', background: 'rgba(0,0,0,0.2)', color: isError ? 'var(--error)' : 'var(--success)' }}>
          {message}
        </p>
      )}
    </div>
  );
}
