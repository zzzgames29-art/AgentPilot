import { z } from 'zod';
import { STAGES } from './constants';

const nullableNumber = z
  .union([z.string(), z.number(), z.null(), z.undefined()])
  .transform((value) => {
    if (value === null || value === undefined || value === '') return null;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  });

export const leadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().optional().or(z.literal('')),
  budget_min: nullableNumber,
  budget_max: nullableNumber,
  expected_price: nullableNumber,
  commission_percent: nullableNumber,
  property_interest: z.string().optional().or(z.literal('')),
  source: z.string().optional().or(z.literal('')),
  stage: z.enum(STAGES),
  next_followup_date: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal(''))
});

export type LeadFormValues = z.infer<typeof leadSchema>;
