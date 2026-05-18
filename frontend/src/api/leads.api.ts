// src/api/leads.api.ts
import { axiosInstance } from './axios';
import { ApiResponse, Lead, CreateLeadDto, UpdateLeadDto, LeadFilters } from '@/types';

export const leadsApi = {
  getLeads: (filters: Partial<LeadFilters>) => {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', String(filters.page));
    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);
    return axiosInstance.get<ApiResponse<Lead[]>>(`/leads?${params.toString()}`);
  },

  getLeadById: (id: string) =>
    axiosInstance.get<ApiResponse<Lead>>(`/leads/${id}`),

  createLead: (payload: CreateLeadDto) =>
    axiosInstance.post<ApiResponse<Lead>>('/leads', payload),

  updateLead: (id: string, payload: UpdateLeadDto) =>
    axiosInstance.put<ApiResponse<Lead>>(`/leads/${id}`, payload),

  deleteLead: (id: string) =>
    axiosInstance.delete<ApiResponse<null>>(`/leads/${id}`),

  exportCSV: async () => {
    const response = await axiosInstance.get('/leads/export', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
