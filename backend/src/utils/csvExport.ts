// src/utils/csvExport.ts
import { ILeadDocument } from '../models/Lead';

export const generateCSV = (leads: ILeadDocument[]): string => {
  const headers = ['Name', 'Email', 'Status', 'Source', 'Notes', 'Created At'];

  const rows = leads.map((lead) => [
    `"${lead.name.replace(/"/g, '""')}"`,
    `"${lead.email}"`,
    `"${lead.status}"`,
    `"${lead.source}"`,
    `"${(lead.notes || '').replace(/"/g, '""')}"`,
    `"${new Date(lead.createdAt).toISOString()}"`,
  ]);

  const csvLines = [headers.join(','), ...rows.map((row) => row.join(','))];
  return csvLines.join('\n');
};
