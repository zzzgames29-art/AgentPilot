'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { STAGES } from '@/lib/constants';
import { leadSchema, type LeadFormValues } from '@/lib/leadSchema';

interface LeadFormProps {
  defaultValues?: Partial<LeadFormValues>;
  onSubmit: (values: LeadFormValues) => Promise<void>;
  submitLabel: string;
}

export function LeadForm({ defaultValues, onSubmit, submitLabel }: LeadFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      stage: 'New',
      ...defaultValues
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg border bg-white p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label>Name</label>
          <input {...register('name')} />
          {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label>Phone</label>
          <input {...register('phone')} />
        </div>
        <div>
          <label>Budget Min</label>
          <input type="number" {...register('budget_min')} />
        </div>
        <div>
          <label>Budget Max</label>
          <input type="number" {...register('budget_max')} />
        </div>
        <div>
          <label>Expected Price</label>
          <input type="number" {...register('expected_price')} />
        </div>
        <div>
          <label>Commission Percent (e.g. 0.02)</label>
          <input type="number" step="0.001" {...register('commission_percent')} />
        </div>
        <div>
          <label>Property Interest</label>
          <input {...register('property_interest')} />
        </div>
        <div>
          <label>Source</label>
          <input {...register('source')} />
        </div>
        <div>
          <label>Stage</label>
          <select {...register('stage')}>
            {STAGES.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Next Follow-up Date</label>
          <input type="date" {...register('next_followup_date')} />
        </div>
      </div>
      <div>
        <label>Notes</label>
        <textarea rows={4} {...register('notes')} />
      </div>
      <button disabled={isSubmitting} className="bg-sky-600 text-white hover:bg-sky-500 disabled:opacity-60">
        {isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
