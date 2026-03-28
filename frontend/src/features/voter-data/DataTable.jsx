import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, Inbox, MoreVertical, Eye, Edit2, Trash2 } from 'lucide-react';

const ActionMenu = ({ record, onView, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button 
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className="p-1.5 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
        title="Actions"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-md shadow-xl ring-1 ring-border/50 divide-y divide-border/50 z-[100] focus:outline-none border border-border bg-white" onClick={e => e.stopPropagation()}>
          <div className="py-1">
            <button 
              onClick={() => { setIsOpen(false); onView && onView(record); }}
              className="group flex w-full items-center px-4 py-2 text-sm text-foreground hover:bg-muted/50 hover:text-primary transition-colors cursor-pointer"
            >
              <Eye className="mr-3 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" /> View
            </button>
            <button 
              onClick={() => { setIsOpen(false); onEdit && onEdit(record); }}
              className="group flex w-full items-center px-4 py-2 text-sm text-foreground hover:bg-muted/50 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <Edit2 className="mr-3 h-4 w-4 text-muted-foreground group-hover:text-blue-600 transition-colors" /> Edit
            </button>
          </div>
          <div className="py-1">
            <button 
              onClick={() => { setIsOpen(false); onDelete && onDelete(record); }}
              className="group flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-medium cursor-pointer"
            >
              <Trash2 className="mr-3 h-4 w-4" /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const DataTable = ({ data, loading, page, total, setPage, limit = 20, setLimit, onRowClick, onEditClick, onDeleteClick, filteredTotals }) => {
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
          return <div className="max-w-[150px] md:max-w-[200px] truncate mx-auto text-left" title={val}>{val}</div>;
        }
      },
      { 
        accessorKey: 'vote_count', 
        header: () => <div className="text-right pr-2">Votes</div>, 
        cell: info => <div className="text-right pr-2 font-medium">{info.getValue() || 0}</div> 
      },
      { 
        accessorKey: 'booth_address', 
        header: 'Booth Address',
        cell: info => {
          const val = info.getValue() || '-';
          return <div className="max-w-[150px] md:max-w-[200px] truncate mx-auto text-left" title={val}>{val}</div>;
        }
      },
      { 
        accessorKey: 'voter_area', 
        header: 'Area',
        cell: info => {
          const val = info.getValue() || '-';
          return <div className="max-w-[120px] md:max-w-[180px] truncate mx-auto text-left" title={val}>{val}</div>;
        }
      },
      { 
        accessorKey: 'male_count', 
        header: () => <div className="text-right pr-2">Male</div>,  
        cell: info => <div className="text-right pr-2">{info.getValue() || 0}</div> 
      },
      { 
        accessorKey: 'female_count', 
        header: () => <div className="text-right pr-2">Female</div>,  
        cell: info => <div className="text-right pr-2">{info.getValue() || 0}</div> 
      },
      { 
        accessorKey: 'other_count', 
        header: () => <div className="text-right pr-2">Others</div>,  
        cell: info => <div className="text-right pr-2">{info.getValue() || 0}</div>  
      },
      { 
        accessorKey: 'total_voters', 
        header: () => <div className="text-right pr-2 font-bold text-primary whitespace-nowrap">Total</div>, 
        cell: info => <div className="text-right pr-2 font-bold text-primary"><span className="bg-primary/10 px-2 py-1 rounded inline-block min-w-[2.5rem] text-center">{info.getValue() || 0}</span></div> 
      },
      { 
        accessorKey: 'actions', 
        header: () => <div className="text-center font-bold text-muted-foreground whitespace-nowrap">Actions</div>, 
        cell: info => (
          <div className="flex justify-center items-center w-full">
            <ActionMenu 
              record={info.row.original} 
              onView={onRowClick} 
              onEdit={onEditClick} 
              onDelete={onDeleteClick} 
            />
          </div>
        ) 
      },
    ],
    [onRowClick, onEditClick, onDeleteClick]
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
      <div className="overflow-x-auto relative">
        <table className="w-full text-sm text-left border-collapse min-w-[1000px]">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, idx, arr) => {
                  const isLast = idx === arr.length - 1;
                  const isTotal = idx === arr.length - 2;
                  
                  let customClasses = "";
                  if (isLast) {
                     customClasses = "w-[80px] min-w-[80px] sticky right-0 z-20 border-l border-l-border shadow-[-4px_0_10px_-4px_rgba(0,0,0,0.1)] bg-muted/90 backdrop-blur-md";
                  } else if (isTotal) {
                     customClasses = "border-r border-border bg-muted/50";
                  } else {
                     customClasses = "bg-muted/50";
                  }

                  return (
                    <th key={header.id} className={`px-4 py-2 font-medium tracking-wider whitespace-nowrap text-center border border-border ${customClasses}`}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  );
                })}
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

                      const isLast = cell.column.id === 'actions';
                      const isTotal = cell.column.id === 'total_voters';
                      
                      let customClass = "";
                      if (isLast) {
                        customClass = "w-[80px] min-w-[80px] sticky right-0 z-10 bg-white/100 border-l border-l-border shadow-[-4px_0_10px_-4px_rgba(0,0,0,0.05)]";
                      } else if (isTotal) {
                        customClass = "border-r border-r-border";
                      }

                      if (isMergeable) {
                        if (!isFirstInBlock) return null; // Omit TD completely for rowSpan to work!
                        
                        return (
                          <td 
                            key={cell.id} 
                            rowSpan={rowSpan} 
                            onClick={() => onRowClick && onRowClick(row.original)}
                            className={`px-4 py-2 whitespace-nowrap text-center border border-border ${customClass}`}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        );
                      } else {
                        // Regular columns like Ward, Street
                        return (
                          <td 
                            key={cell.id} 
                            onClick={() => !isLast && onRowClick && onRowClick(row.original)}
                            className={`px-4 py-2 whitespace-nowrap text-center text-foreground border border-border ${customClass}`}
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

      <div className="border-t border-border p-4 flex flex-col sm:flex-row items-center justify-between bg-white text-sm gap-4">
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
