import { STAGES } from './constants';

export type LeadStage = (typeof STAGES)[number];

export interface Lead {
  id: string;
  user_id: string;
  name: string;
  phone: string | null;
  budget_min: number | null;
  budget_max: number | null;
  expected_price: number | null;
  commission_percent: number | null;
  property_interest: string | null;
  source: string | null;
  stage: LeadStage;
  next_followup_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
