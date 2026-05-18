// src/pages/DashboardPage.tsx
import React, { useState, useCallback } from 'react';
import { Plus, Download, Users, TrendingUp, Target, XCircle } from 'lucide-react';
import { useLeads, useCreateLead, useUpdateLead, useDeleteLead, useExportLeads } from '@/hooks/useLeads';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuth } from '@/context/AuthContext';
import { Lead, LeadFilters, CreateLeadDto } from '@/types';
import { Navbar } from '@/components/layout/Navbar';
import { LeadCard } from '@/components/leads/LeadCard';
import { LeadForm } from '@/components/leads/LeadForm';
import { LeadFiltersBar } from '@/components/leads/LeadFilters';
import { LeadDetailModal } from '@/components/leads/LeadDetailModal';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { LeadCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';


const DEFAULT_FILTERS: LeadFilters = { status: '', source: '', search: '', sort: 'latest', page: 1 };

const StatCard: React.FC<{ label: string; value: number; icon: React.ReactNode; color: string }> = ({ label, value, icon, color }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
      </div>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
    </div>
  </div>
);

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [filters, setFilters] = useState<LeadFilters>(DEFAULT_FILTERS);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 400);

  const queryFilters = { ...filters, search: debouncedSearch };
  const { data, isLoading, isError } = useLeads(queryFilters);
  const leads = data?.data || [];
  const meta = data?.meta;

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [viewLead, setViewLead] = useState<Lead | null>(null);
  const [deleteLead, setDeleteLead] = useState<Lead | null>(null);

  const createMutation = useCreateLead();
  const updateMutation = useUpdateLead();
  const deleteMutation = useDeleteLead();
  const exportMutation = useExportLeads();

  const handleFilterChange = useCallback((key: keyof LeadFilters, val: string) => {
    setFilters((prev) => ({ ...prev, [key]: val, page: 1 }));
  }, []);

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchInput('');
  };

  const handleCreate = async (data: CreateLeadDto) => {
    await createMutation.mutateAsync(data);
    setIsCreateOpen(false);
  };

  const handleUpdate = async (data: CreateLeadDto) => {
    if (!editLead) return;
    await updateMutation.mutateAsync({ id: editLead._id, payload: data });
    setEditLead(null);
  };

  const handleDelete = async () => {
    if (!deleteLead) return;
    await deleteMutation.mutateAsync(deleteLead._id);
    setDeleteLead(null);
  };

  // Stats from meta
  const totalLeads = meta?.totalLeads ?? 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Leads Dashboard
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {isAdmin ? 'Manage all company leads' : 'Manage your assigned leads'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={() => exportMutation.mutate()}
                isLoading={exportMutation.isPending}
              >
                Export CSV
              </Button>
            )}
            <Button
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsCreateOpen(true)}
              id="create-lead-btn"
            >
              Add Lead
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total Leads" value={totalLeads} icon={<Users className="w-5 h-5 text-blue-500" />} color="bg-blue-50 dark:bg-blue-900/20" />
          <StatCard label="Qualified" value={leads.filter((l) => l.status === 'Qualified').length} icon={<Target className="w-5 h-5 text-green-500" />} color="bg-green-50 dark:bg-green-900/20" />
          <StatCard label="New" value={leads.filter((l) => l.status === 'New').length} icon={<TrendingUp className="w-5 h-5 text-primary-500" />} color="bg-primary-50 dark:bg-primary-900/20" />
          <StatCard label="Lost" value={leads.filter((l) => l.status === 'Lost').length} icon={<XCircle className="w-5 h-5 text-red-500" />} color="bg-red-50 dark:bg-red-900/20" />
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <LeadFiltersBar
            filters={filters}
            searchInput={searchInput}
            onSearchChange={(val) => { setSearchInput(val); setFilters((p) => ({ ...p, page: 1 })); }}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />
        </div>

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-600 dark:text-red-400">
            Failed to load leads. Please try again.
          </div>
        )}

        {/* Leads Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <LeadCardSkeleton key={i} />)}
          </div>
        ) : leads.length === 0 ? (
          <EmptyState
            title="No leads found"
            description={
              queryFilters.search || queryFilters.status || queryFilters.source
                ? "Try adjusting your filters or search term."
                : "Get started by adding your first lead."
            }
            action={
              <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsCreateOpen(true)}>
                Add First Lead
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {leads.map((lead) => (
              <LeadCard
                key={lead._id}
                lead={lead}
                onEdit={(l) => setEditLead(l)}
                onDelete={(l) => setDeleteLead(l)}
                onView={(l) => setViewLead(l)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <Pagination meta={meta} onPageChange={(page) => setFilters((p) => ({ ...p, page }))} />
        )}
      </main>

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Add New Lead">
        <LeadForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateOpen(false)}
          isLoading={createMutation.isPending}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editLead} onClose={() => setEditLead(null)} title="Edit Lead">
        {editLead && (
          <LeadForm
            initialData={editLead}
            onSubmit={handleUpdate}
            onCancel={() => setEditLead(null)}
            isLoading={updateMutation.isPending}
          />
        )}
      </Modal>

      {/* View Modal */}
      <LeadDetailModal
        lead={viewLead}
        isOpen={!!viewLead}
        onClose={() => setViewLead(null)}
        onEdit={(l) => { setViewLead(null); setEditLead(l); }}
      />

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteLead} onClose={() => setDeleteLead(null)} title="Delete Lead" size="sm">
        {deleteLead && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-slate-900 dark:text-white">{deleteLead.name}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteLead(null)}>Cancel</Button>
              <Button variant="danger" onClick={handleDelete} isLoading={deleteMutation.isPending}>
                Delete Lead
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
