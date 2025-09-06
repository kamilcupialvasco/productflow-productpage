import React, { useState, useMemo, FC } from 'react';

export interface Column<T> {
    Header: string;
    accessor: keyof T;
    className?: string;
    Cell?: (props: { value: any, row: { original: T } }) => JSX.Element;
}

interface AdvancedTableProps<T extends object> {
    columns: Column<T>[];
    data: T[];
    title: string;
    onRowClick: (item: T) => void;
    renderActions: () => JSX.Element;
}

const SortIcon: FC<{ direction: 'asc' | 'desc' | null }> = ({ direction }) => {
    if (!direction) return null;
    return direction === 'asc' ? <span className="text-xs ml-1">▲</span> : <span className="text-xs ml-1">▼</span>;
};

function AdvancedTable<T extends { id: any },>({
    columns,
    data,
    title,
    onRowClick,
    renderActions
}: AdvancedTableProps<T>) {
    const [globalFilter, setGlobalFilter] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof T; dir: 'asc' | 'desc' } | null>(null);
    const [visibleColumns, setVisibleColumns] = useState<Set<keyof T>>(() => new Set(columns.map(c => c.accessor)));

    const filteredData = useMemo(() => {
        let filtered = data;
        if (globalFilter) {
            filtered = data.filter(item =>
                Object.values(item).some(value =>
                    String(value).toLowerCase().includes(globalFilter.toLowerCase())
                )
            );
        }
        return filtered;
    }, [data, globalFilter]);

    const sortedData = useMemo(() => {
        let sortableItems = [...filteredData];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const valA = a[sortConfig.key];
                const valB = b[sortConfig.key];
                if (valA === undefined || valB === undefined) return 0;
                if (valA < valB) return sortConfig.dir === 'asc' ? -1 : 1;
                if (valA > valB) return sortConfig.dir === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [filteredData, sortConfig]);

    const handleSort = (key: keyof T) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.dir === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, dir: direction });
    };

    const toggleColumn = (accessor: keyof T) => {
        setVisibleColumns(prev => {
            const newSet = new Set(prev);
            if (newSet.has(accessor)) {
                newSet.delete(accessor);
            } else {
                newSet.add(accessor);
            }
            return newSet;
        });
    };
    
    const visibleHeaders = useMemo(() => columns.filter(c => visibleColumns.has(c.accessor)), [columns, visibleColumns]);

    return (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center">
                <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
                <div className="flex items-center space-x-4">
                     {renderActions()}
                </div>
            </div>
            <div className="p-4 flex justify-between items-center">
                <input
                    value={globalFilter}
                    onChange={e => setGlobalFilter(e.target.value)}
                    placeholder="Search all columns..."
                    className="bg-background border border-border rounded-md px-3 py-1.5 text-sm"
                />
                 <div className="relative group">
                    <button className="px-3 py-1.5 text-sm rounded-md border border-border">Columns</button>
                     <div className="absolute z-10 right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                        {columns.map(c => (
                            <label key={String(c.accessor)} className="flex items-center px-3 py-2 text-sm hover:bg-card/50 cursor-pointer">
                                <input type="checkbox" checked={visibleColumns.has(c.accessor)} onChange={() => toggleColumn(c.accessor)} className="mr-2 bg-card border-border rounded text-primary focus:ring-primary"/>
                                {c.Header}
                            </label>
                        ))}
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-text-secondary">
                    <thead className="text-xs text-text-secondary uppercase bg-zinc-900">
                        <tr>
                            {visibleHeaders.map(col => (
                                <th key={String(col.accessor)} scope="col" className="px-6 py-3 cursor-pointer select-none" onClick={() => handleSort(col.accessor)}>
                                    <div className="flex items-center">
                                      {col.Header} {sortConfig?.key === col.accessor && <SortIcon direction={sortConfig.dir} />}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map(item => (
                            <tr key={item.id} className="border-b border-border hover:bg-zinc-900/50 cursor-pointer" onClick={() => onRowClick(item)}>
                                {visibleHeaders.map(col => {
                                    const value = item[col.accessor];
                                    return (
                                        <td key={String(col.accessor)} className={`px-6 py-4 ${col.className || ''}`}>
                                            {col.Cell ? col.Cell({ value, row: { original: item } }) : String(value === null || value === undefined ? '' : value)}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdvancedTable;
