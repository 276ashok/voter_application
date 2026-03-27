import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';

import MainLayout from './components/layout/MainLayout';
import SummaryCards from './features/voter-data/SummaryCards';
import DataTable from './features/voter-data/DataTable';
import FilterBar from './features/voter-data/FilterBar';
import SummaryBar from './features/voter-data/SummaryBar';
import UploadZone from './features/voter-data/UploadZone';
import AddRecordModal from './features/voter-data/AddRecordModal';
import RecordDetailsModal from './features/voter-data/RecordDetailsModal';

import './index.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function App() {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [total, setTotal] = useState(0);
  const [filteredTotals, setFilteredTotals] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const initialFilters = {
    search: '', ward: '', part: '', street: '', area: '',
    min_votes: '', max_votes: '', min_total: '', max_total: ''
  };
  const [filters, setFilters] = useState(initialFilters);

  const [loadingRecords, setLoadingRecords] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const fetchSummary = useCallback(async () => {
    setLoadingSummary(true);
    try {
      const res = await fetch(`${API_BASE_URL}/records/summary`);
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
      }
    } catch (err) {
      console.error('Failed to fetch summary', err);
    }
    setLoadingSummary(false);
  }, []);

  const fetchRecords = useCallback(async (pageNum = 1) => {
    setLoadingRecords(true);
    try {
      const params = new URLSearchParams();
      params.append('page', pageNum);
      params.append('limit', limit);

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null) {
          params.append(key, value);
        }
      });

      const res = await fetch(`${API_BASE_URL}/records?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setRecords(data.data);
        setTotal(data.total_records);
        setPage(data.current_page);
        if (data.aggregations) {
          setFilteredTotals(data.aggregations);
        }
      }
    } catch (err) {
      console.error('Failed to fetch records', err);
    }
    setLoadingRecords(false);
  }, [limit, filters]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    fetchRecords(page);
  }, [page, fetchRecords, limit, filters]);

  const handleUploadSuccess = () => {
    fetchSummary();
    fetchRecords(1);
  };

  const handleManualAdd = async (formData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchSummary();
        fetchRecords(1);
      } else {
        alert('Failed to add record. Please check validation requirements.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to backend');
    }
  };

  return (
    <MainLayout
      onAddRecord={() => setIsModalOpen(true)}
      onUpload={() => setIsUploadOpen(true)}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Overview</h2>
        <p className="text-muted-foreground text-sm">A summary of the current electoral data.</p>
      </div>

      <SummaryCards summary={summary} loading={loadingSummary} />

      <div className="mt-8 mb-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-4">Voter Directory</h2>

        <FilterBar
          filters={filters}
          setFilters={(newFilters) => {
            // Only update page to 1 if the filters actually changed to avoid infinite fetch loops
            setFilters(prev => {
              if (JSON.stringify(prev) !== JSON.stringify(newFilters)) {
                setPage(1);
                return newFilters;
              }
              return prev;
            });
          }}
          onClear={() => {
            setFilters(initialFilters);
            setPage(1);
          }}
        />

        {filteredTotals && Object.values(filters).some(val => val !== '' && val !== null) && (
          <SummaryBar 
            totals={filteredTotals} 
            loading={loadingRecords} 
          />
        )}

        <DataTable
          data={records}
          loading={loadingRecords}
          page={page}
          total={total}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          onRowClick={(record) => setSelectedRecord(record)}
        />
      </div>

      <AnimatePresence>
        {isUploadOpen && (
          <UploadZone
            key="upload-zone"
            onClose={() => setIsUploadOpen(false)}
            onUploadSuccess={handleUploadSuccess}
          />
        )}

        {isModalOpen && (
          <AddRecordModal
            key="add-modal"
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleManualAdd}
          />
        )}

        {selectedRecord && (
          <RecordDetailsModal
            key="details-modal"
            record={selectedRecord}
            onClose={() => setSelectedRecord(null)}
          />
        )}
      </AnimatePresence>
    </MainLayout>
  );
}

export default App;
