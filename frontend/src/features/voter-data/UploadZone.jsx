import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, File, X, CheckCircle, Eye } from 'lucide-react';
import * as XLSX from 'xlsx';

const UploadZone = ({ onUploadSuccess, onClose }) => {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      const selected = acceptedFiles[0];
      setFile(selected);
      generatePreview(selected);
    }
  }, []);

  const generatePreview = (f) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        // Grab first 3 rows of data (including header) for a small preview
        setPreviewData(json.slice(0, 4));
      } catch (err) {
        console.error("Preview failed", err);
      }
    };
    reader.readAsArrayBuffer(f);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          onUploadSuccess();
          onClose();
        }, 1500);
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass-panel w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:bg-secondary p-1 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-semibold mb-1 text-foreground">Upload Data</h2>
          <p className="text-sm text-muted-foreground mb-6">Drag and drop your Excel file here. A preview will be shown before confirmation.</p>

          {!success ? (
            <>
              {!file ? (
                <div 
                  {...getRootProps()} 
                  className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                    isDragActive ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border hover:bg-secondary/40'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="mx-auto w-16 h-16 bg-secondary/80 rounded-full flex items-center justify-center mb-4">
                    <UploadCloud className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-base font-medium mb-1">
                    {isDragActive ? "Drop the file here" : "Click or drag file to this area"}
                  </p>
                  <p className="text-xs text-muted-foreground">Support for a single or bulk upload .xlsx</p>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="mb-4 p-4 bg-secondary/50 rounded-lg flex items-center justify-between border border-white/5">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <File className="w-6 h-6 text-primary flex-shrink-0" />
                      <div>
                        <span className="text-sm font-semibold truncate block">{file.name}</span>
                        <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
                      </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setFile(null); setPreviewData([]); }} className="text-muted-foreground hover:text-destructive p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {previewData.length > 0 && (
                     <div className="mb-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                          <Eye className="w-4 h-4" />
                          <span>File Preview (First 3 Rows)</span>
                        </div>
                        <div className="overflow-x-auto rounded-lg border border-border">
                          <table className="w-full text-left text-xs">
                             <thead className="bg-muted/50 border-b border-border">
                               <tr>
                                  {previewData[0].map((header, i) => (
                                    <th key={i} className="px-3 py-2 font-medium">{String(header)}</th>
                                  ))}
                               </tr>
                             </thead>
                             <tbody>
                               {previewData.slice(1).map((row, i) => (
                                 <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-secondary/30">
                                    {previewData[0].map((_, col) => (
                                      <td key={col} className="px-3 py-2 text-muted-foreground">
                                        {row[col] !== undefined ? String(row[col]) : ''}
                                      </td>
                                    ))}
                                 </tr>
                               ))}
                             </tbody>
                          </table>
                        </div>
                     </div>
                  )}

                  <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-secondary transition-colors">
                      Cancel
                    </button>
                    <button 
                      onClick={handleUpload}
                      disabled={uploading}
                      className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-primary/20"
                    >
                      {uploading ? (
                        <><div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> Uploading...</>
                      ) : "Confirm & Upload"}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center animate-in zoom-in duration-300">
              <div
                className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/10"
              >
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Upload Complete!</h3>
              <p className="text-sm text-muted-foreground mt-2">The dataset has been successfully integrated into the system.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default UploadZone;
