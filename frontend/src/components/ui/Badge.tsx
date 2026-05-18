// src/components/ui/Badge.tsx
import React from 'react';
import { LeadStatus, LeadSource } from '@/types';

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  New: { label: 'New', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  Contacted: { label: 'Contacted', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  Qualified: { label: 'Qualified', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  Lost: { label: 'Lost', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

const sourceConfig: Record<LeadSource, { label: string; className: string }> = {
  Website: { label: 'Website', className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  Instagram: { label: 'Instagram', className: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' },
  Referral: { label: 'Referral', className: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
};

interface StatusBadgeProps { status: LeadStatus }
interface SourceBadgeProps { source: LeadSource }

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
      {config.label}
    </span>
  );
};

export const SourceBadge: React.FC<SourceBadgeProps> = ({ source }) => {
  const config = sourceConfig[source];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};
