

import React, { useMemo } from 'react';
import { UpstreamInitiative, UpstreamStatus } from '../../types';
import AdvancedTable, { Column } from '../common/AdvancedTable';

const StatusBadge: React.FC<{ status: UpstreamStatus }> = ({ status }) => {
    const colorMap: Record<string, string> = {
        'Backlog': 'bg-slate-500/20 text-slate-400',
        'Analysing Opportunity': 'bg-purple-500/20 text-purple-400',
        'Initial Research': 'bg-yellow-500/20 text-yellow-400',
        'Deep Research': 'bg-amber-500/20 text-amber-400',
        'Input for Discussion': 'bg-cyan-500/20 text-cyan-400',
        'Parked': 'bg-gray-500/20 text-gray-400',
        'Waiting for Development': 'bg-orange-500/20 text-orange-400',
        'In Development': 'bg-blue-500/20 text-blue-400',
        'Released': 'bg-teal-500/20 text-teal-400',
        'Done': 'bg-green-500/20 text-green-400',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorMap[status]}`}>{status}</span>;
};


interface InitiativesTableProps {
    initiatives: UpstreamInitiative[];
    onSelectInitiative: (initiative: UpstreamInitiative) => void;
}

const InitiativesTable: React.FC<InitiativesTableProps> = ({ initiatives, onSelectInitiative }) => {

    const columns = useMemo((): Column<UpstreamInitiative>[] => [
        { Header: 'Title', accessor: 'title', className: 'font-medium text-vasco-text-primary' },
        { Header: 'Jira ID', accessor: 'jiraId', Cell: ({ value }: { value: string }) => <>{value || 'N/A'}</> },
        { Header: 'Summary', accessor: 'summary', className: 'text-xs max-w-md' },
        { Header: 'Linked Insights', accessor: 'linkedInsights', className: 'text-center' },
        {
            Header: 'Status',
            accessor: 'status',
            Cell: ({ value }: { value: UpstreamStatus }) => <StatusBadge status={value} />
        },
    ], []);

    return (
        <AdvancedTable<UpstreamInitiative>
            columns={columns}
            data={initiatives}
            title="" // Title is handled by parent component
            onRowClick={onSelectInitiative}
            renderActions={() => <></>} // Actions are handled by parent component
        />
    );
};

export default InitiativesTable;