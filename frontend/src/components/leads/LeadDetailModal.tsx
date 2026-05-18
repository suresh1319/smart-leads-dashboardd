// src/components/leads/LeadDetailModal.tsx
import React from 'react';
import { Lead } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge, SourceBadge } from '@/components/ui/Badge';
import { Mail, User, Calendar, MessageSquare, Edit } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (lead: Lead) => void;
}

const Detail: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-500 flex-shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-xs text-slate-400 dark:text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-0.5">{value}</p>
    </div>
  </div>
);

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, isOpen, onClose, onEdit }) => {
  const { user } = useAuth();
  if (!lead) return null;

  const isAdmin = user?.role === 'admin';
  const canEdit = isAdmin || (typeof lead.createdBy === 'object' && lead.createdBy.id === user?.id);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lead Details" size="md">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{lead.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{lead.email}</p>
          </div>
          <div className="flex flex-col gap-1.5 items-end">
            <StatusBadge status={lead.status} />
            <SourceBadge source={lead.source} />
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
          <Detail icon={<Mail className="w-4 h-4" />} label="Email" value={lead.email} />
          <Detail
            icon={<User className="w-4 h-4" />}
            label="Created By"
            value={typeof lead.createdBy === 'object' ? lead.createdBy.name : 'Unknown'}
          />
          <Detail
            icon={<Calendar className="w-4 h-4" />}
            label="Created At"
            value={new Date(lead.createdAt).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}
          />
          {lead.notes && (
            <Detail icon={<MessageSquare className="w-4 h-4" />} label="Notes" value={lead.notes} />
          )}
        </div>

        {canEdit && (
          <div className="flex justify-end">
            <Button
              onClick={() => { onClose(); onEdit(lead); }}
              leftIcon={<Edit className="w-4 h-4" />}
            >
              Edit Lead
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
