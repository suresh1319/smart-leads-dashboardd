// src/components/leads/LeadCard.tsx
import React from 'react';
import { Lead } from '@/types';
import { StatusBadge, SourceBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Pencil, Trash2, Calendar, Mail, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onView: (lead: Lead) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onEdit, onDelete, onView }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div
      className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700
        hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all duration-200
        cursor-pointer animate-fade-in"
      onClick={() => onView(lead)}
    >
      <div className="p-5 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {lead.name}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{lead.email}</span>
            </div>
          </div>
          <StatusBadge status={lead.status} />
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <SourceBadge source={lead.source} />
          {lead.createdBy && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              <User className="w-3 h-3" />
              {typeof lead.createdBy === 'object' ? lead.createdBy.name : 'Unknown'}
            </span>
          )}
        </div>

        {lead.notes && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{lead.notes}</p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar className="w-3 h-3" />
            {formatDate(lead.createdAt)}
          </div>
          <div
            className="flex gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="sm"
              className="!p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onEdit(lead)}
              title="Edit lead"
            >
              <Pencil className="w-3.5 h-3.5 text-slate-500" />
            </Button>
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                className="!p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:!bg-red-50 dark:hover:!bg-red-900/20"
                onClick={() => onDelete(lead)}
                title="Delete lead"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
