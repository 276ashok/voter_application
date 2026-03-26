import React from 'react';

export default function DataGrid({ data, loading, page, total, setPage }) {
  const limit = 10;
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ marginBottom: '1rem' }}>Voter Directory</h3>
      
      <div className="table-container" style={{ flex: 1 }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Ward</th>
                <th>Part</th>
                <th>Serial</th>
                <th>M</th>
                <th>F</th>
                <th>O</th>
                <th>Total</th>
                <th>Area / Address</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    No records found
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id}>
                    <td>{row.ward_no}</td>
                    <td>{row.part_no}</td>
                    <td>{row.serial_no || '-'}</td>
                    <td>{row.male_count}</td>
                    <td>{row.female_count}</td>
                    <td>{row.other_count}</td>
                    <td style={{ fontWeight: 'bold' }}>{row.total_voters}</td>
                    <td>
                      <div style={{ fontSize: '0.9rem' }}>{row.voter_area || '-'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{row.booth_address || '-'}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="pagination">
        <span style={{ color: 'var(--text-secondary)' }}>Total: {total} records</span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="btn" 
            disabled={page === 1 || loading}
            onClick={() => setPage(p => p - 1)}
          >
            Prev
          </button>
          <span style={{ display: 'flex', alignItems: 'center', padding: '0 0.5rem' }}>
            {page} / {totalPages}
          </span>
          <button 
            className="btn" 
            disabled={page === totalPages || loading}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
