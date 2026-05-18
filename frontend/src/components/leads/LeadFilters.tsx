// src/components/leads/LeadFilters.tsx
import React from 'react';
import { Search, X } from 'lucide-react';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LeadFilters as FilterType } from '@/types';

interface LeadFiltersProps {
  filters: FilterType;
  searchInput: string;
  onSearchChange: (val: string) => void;
  onFilterChange: (key: keyof FilterType, val: string) => void;
  onReset: () => void;
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Lost', label: 'Lost' },
];

const SOURCE_OPTIONS = [
  { value: '', label: 'All Sources' },
  { value: 'Website', label: 'Website' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Referral', label: 'Referral' },
];

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest First' },
  { value: 'oldest', label: 'Oldest First' },
];

const hasActiveFilters = (f: FilterType) =>
  !!f.status || !!f.source || !!f.search || f.sort !== 'latest';

export const LeadFiltersBar: React.FC<LeadFiltersProps> = ({
  filters,
  searchInput,
  onSearchChange,
  onFilterChange,
  onReset,
}) => (
  <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-end">
    <div className="flex-1 min-w-[200px]">
      <Input
        id="lead-search"
        placeholder="Search by name or email..."
        value={searchInput}
        onChange={(e) => onSearchChange(e.target.value)}
        leftIcon={<Search className="w-4 h-4" />}
        rightIcon={
          searchInput ? (
            <button onClick={() => onSearchChange('')} className="pointer-events-auto hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <X className="w-4 h-4" />
            </button>
          ) : null
        }
      />
    </div>

    <div className="flex flex-wrap gap-2 items-center">
      <Select
        id="filter-status"
        value={filters.status || ''}
        onChange={(e) => onFilterChange('status', e.target.value)}
        options={STATUS_OPTIONS}
        className="w-36"
      />
      <Select
        id="filter-source"
        value={filters.source || ''}
        onChange={(e) => onFilterChange('source', e.target.value)}
        options={SOURCE_OPTIONS}
        className="w-36"
      />
      <Select
        id="filter-sort"
        value={filters.sort}
        onChange={(e) => onFilterChange('sort', e.target.value)}
        options={SORT_OPTIONS}
        className="w-36"
      />
      {hasActiveFilters(filters) && (
        <Button variant="ghost" size="sm" onClick={onReset} leftIcon={<X className="w-3.5 h-3.5" />}>
          Reset
        </Button>
      )}
    </div>
  </div>
);
