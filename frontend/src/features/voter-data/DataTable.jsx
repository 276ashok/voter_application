import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

const DataTable = ({ data, loading, page, total, setPage, limit = 20, setLimit, onRowClick }) => {
  const columns = useMemo(
    () => [
      { accessorKey: 'serial_no', header: 'Serial', cell: info => info.getValue() || '-' },
      { accessorKey: 'part_no', header: 'Part', cell: info => info.getValue() },
      { accessorKey: 'ward_no', header: 'Ward', cell: info => info.getValue() },
      { 
        accessorKey: 'street', 
        header: 'Street',
        cell: info => {
          const val = info.getValue() || '-';
          return <div className="max-w-[170px] truncate mx-auto text-center" title={val}>{val}</div>;
        }
      },
      { 
        accessorKey: 'vote_count', 
        header: 'Votes', 
        cell: info => info.getValue() || 0 
      },
      { 
        accessorKey: 'booth_address', 
        header: 'Booth Address',
        cell: info => {
          const val = info.getValue() || '-';
          return <div className="max-w-[170px] truncate mx-auto text-center" title={val}>{val}</div>;
        }
      },
      { 
        accessorKey: 'voter_area', 
        header: 'Area',
        cell: info => {
          const val = info.getValue() || '-';
          return <div className="max-w-[150px] truncate mx-auto text-center" title={val}>{val}</div>;
        }
      },
      { 
        accessorKey: 'male_count', 
        header: 'Male', 
        cell: info => info.getValue() || 0 
      },
      { 
        accessorKey: 'female_count', 
        header: 'Female', 
        cell: info => info.getValue() || 0 
      },
      { 
        accessorKey: 'other_count', 
        header: 'Others', 
        cell: info => info.getValue() || 0 
      },
      { 
        accessorKey: 'total_voters', 
        header: () => <div className="font-bold text-primary">Total</div>, 
        cell: info => <div className="font-bold text-primary bg-primary/10 px-2 py-1 rounded inline-block min-w-[2rem]">{info.getValue()}</div> 
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(total / limit),
  });

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex flex-col glass-panel rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto relative min-h-[400px]">
        <table className="w-full text-sm text-center border-collapse">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-3 py-4 font-medium tracking-wider whitespace-nowrap text-center border border-border bg-muted/50">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 15 }).map((_, i) => (
                <tr key={i} className="animate-pulse border-b border-border">
                  {columns.map((c, j) => (
                    <td key={j} className="px-6 py-4 border border-border">
                      <div className="h-4 bg-muted/50 rounded w-full"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-32 text-center text-muted-foreground border border-border">
                  <Inbox className="w-12 h-12 mx-auto mb-3 text-muted" />
                  <p className="text-lg font-medium">No records found</p>
                  <p className="text-sm mt-1">Upload data or add a new record to see them here.</p>
                </td>
              </tr>
            ) : (() => {
              const rows = table.getRowModel().rows;
              
              // Precompute rowspans for each part_no group
              const spans = {};
              rows.forEach(r => {
                const p = r.original.part_no;
                spans[p] = (spans[p] || 0) + 1;
              });

              let currentBlock = 0;
              return rows.map((row, i, arr) => {
                const isFirstInBlock = i === 0 || row.original.part_no !== arr[i - 1].original.part_no;
                const rowSpan = spans[row.original.part_no];
                
                if (isFirstInBlock) {
                  currentBlock++;
                }

                return (
                  <tr 
                    key={row.id} 
                    className={`hover:bg-primary/5 transition-colors cursor-pointer ${
                      currentBlock % 2 === 0 ? 'bg-background/20' : 'bg-muted/5'
                    }`}
                  >
                    {row.getVisibleCells().map(cell => {
                      const colId = cell.column.id;
                      const mergeableCols = ['serial_no', 'part_no', 'booth_address', 'voter_area', 'male_count', 'female_count', 'other_count', 'total_voters'];
                      const isMergeable = mergeableCols.includes(colId);

                      if (isMergeable) {
                        if (!isFirstInBlock) return null; // Omit TD completely for rowSpan to work!
                        
                        return (
                          <td 
                            key={cell.id} 
                            rowSpan={rowSpan} 
                            onClick={() => onRowClick && onRowClick(row.original)}
                            className="px-4 py-3.5 whitespace-nowrap text-center border border-border"
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        );
                      } else {
                        // Regular columns like Ward, Street
                        return (
                          <td 
                            key={cell.id} 
                            onClick={() => onRowClick && onRowClick(row.original)}
                            className="px-3 py-3 whitespace-nowrap align-middle text-center border border-border"
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        );
                      }
                    })}
                  </tr>
                );
              });
            })()}
          </tbody>
        </table>
      </div>

      <div className="border-t border-white/5 p-4 flex items-center justify-between bg-card/40 text-sm">
        <div className="text-muted-foreground flex items-center gap-4">
          <div>
            Showing <span className="font-medium text-foreground">{total === 0 ? 0 : (page - 1) * limit + 1}</span> to <span className="font-medium text-foreground">{Math.min(page * limit, total)}</span> of <span className="font-medium text-foreground">{total}</span> results
          </div>
          <div className="flex items-center gap-2 border-l border-white/10 pl-4">
            <span>Rows per page:</span>
            <select
               value={limit}
               onChange={(e) => {
                 setLimit(Number(e.target.value));
                 setPage(1);
               }}
               className="bg-background border border-border rounded px-2 py-1 text-xs focus:ring-primary outline-none"
            >
               {[10, 20, 50, 100].map(val => (
                 <option key={val} value={val}>{val}</option>
               ))}
            </select>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading || totalPages === 0}
            className="p-2 border border-border bg-background rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center justify-center min-w-[3rem] font-medium bg-secondary/50 rounded-md py-1">
            {page} / {totalPages || 1}
          </div>
          
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0 || loading}
            className="p-2 border border-border bg-background rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
