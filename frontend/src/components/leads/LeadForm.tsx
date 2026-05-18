// src/components/leads/LeadForm.tsx
import React, { useState } from 'react';
import { Lead, CreateLeadDto } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';

interface LeadFormProps {
  initialData?: Lead;
  onSubmit: (data: CreateLeadDto) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const STATUS_OPTIONS = [
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Lost', label: 'Lost' },
];

const SOURCE_OPTIONS = [
  { value: 'Website', label: 'Website' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Referral', label: 'Referral' },
];

interface FormErrors {
  name?: string;
  email?: string;
  source?: string;
}

export const LeadForm: React.FC<LeadFormProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [form, setForm] = useState<CreateLeadDto>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    status: initialData?.status || 'New',
    source: initialData?.source || 'Website',
    notes: initialData?.notes || '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim() || form.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Valid email is required';
    if (!form.source) newErrors.source = 'Source is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof CreateLeadDto) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="lead-name"
        label="Full Name *"
        placeholder="e.g. Rahul Sharma"
        value={form.name}
        onChange={handleChange('name')}
        error={errors.name}
      />
      <Input
        id="lead-email"
        label="Email Address *"
        type="email"
        placeholder="e.g. rahul@example.com"
        value={form.email}
        onChange={handleChange('email')}
        error={errors.email}
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          id="lead-status"
          label="Status"
          value={form.status}
          onChange={handleChange('status')}
          options={STATUS_OPTIONS}
        />
        <Select
          id="lead-source"
          label="Source *"
          value={form.source}
          onChange={handleChange('source')}
          options={SOURCE_OPTIONS}
          error={errors.source}
        />
      </div>
      <div>
        <label htmlFor="lead-notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Notes
        </label>
        <textarea
          id="lead-notes"
          rows={3}
          placeholder="Add any additional notes..."
          value={form.notes}
          onChange={handleChange('notes')}
          maxLength={500}
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2.5 text-sm
            bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
            placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500
            focus:border-transparent transition-all duration-200 resize-none"
        />
        <p className="mt-1 text-xs text-slate-400">{(form.notes || '').length}/500</p>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Update Lead' : 'Create Lead'}
        </Button>
      </div>
    </form>
  );
};
