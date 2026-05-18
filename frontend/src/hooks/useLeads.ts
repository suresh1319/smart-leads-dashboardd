// src/hooks/useLeads.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsApi } from '@/api/leads.api';
import { LeadFilters, CreateLeadDto, UpdateLeadDto } from '@/types';
import { toast } from 'react-hot-toast';

export const useLeads = (filters: Partial<LeadFilters>) => {
  return useQuery({
    queryKey: ['leads', filters],
    queryFn: () => leadsApi.getLeads(filters).then((r) => r.data),
    staleTime: 30000,
  });
};

export const useLeadById = (id: string) => {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadsApi.getLeadById(id).then((r) => r.data),
    enabled: !!id,
  });
};

export const useCreateLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLeadDto) => leadsApi.createLead(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead created successfully!');
    },
  });
};

export const useUpdateLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateLeadDto }) =>
      leadsApi.updateLead(id, payload),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      qc.invalidateQueries({ queryKey: ['lead', id] });
      toast.success('Lead updated successfully!');
    },
  });
};

export const useDeleteLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leadsApi.deleteLead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead deleted successfully!');
    },
  });
};

export const useExportLeads = () => {
  return useMutation({
    mutationFn: () => leadsApi.exportCSV(),
    onSuccess: () => toast.success('CSV exported successfully!'),
  });
};
