'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { LeadForm } from '@/components/LeadForm';
import { createClient } from '@/lib/supabase';
import type { Lead } from '@/lib/types';
import type { LeadFormValues } from '@/lib/leadSchema';
import { STAGES } from '@/lib/constants';

export default function LeadDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLead = async () => {
      const supabase = createClient();
      const { data, error: queryError } = await supabase.from('leads').select('*').eq('id', params.id).single();

      if (queryError) {
        setError(queryError.message);
      } else {
        setLead(data as Lead);
      }
      setLoading(false);
    };

    void loadLead();
  }, [params.id]);

  const updateLead = async (values: LeadFormValues) => {
    const supabase = createClient();
    const payload = {
      ...values,
      phone: values.phone || null,
      property_interest: values.property_interest || null,
      source: values.source || null,
      next_followup_date: values.next_followup_date || null,
      notes: values.notes || null
    };

    const { error: updateError } = await supabase.from('leads').update(payload).eq('id', params.id);

    if (updateError) throw new Error(updateError.message);
    router.push('/leads');
  };

  const quickStageUpdate = async (stage: (typeof STAGES)[number]) => {
    const supabase = createClient();
    const { error: updateError } = await supabase.from('leads').update({ stage }).eq('id', params.id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setLead((prev) => (prev ? { ...prev, stage } : prev));
  };

  const markContacted = async () => quickStageUpdate('Contacted');

  const setFollowupTomorrow = async () => {
    const supabase = createClient();
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const { error: updateError } = await supabase
      .from('leads')
      .update({ next_followup_date: tomorrow })
      .eq('id', params.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }
    setLead((prev) => (prev ? { ...prev, next_followup_date: tomorrow } : prev));
  };

  if (loading) return <p>Loading lead...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!lead) return <p>Lead not found.</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Lead Details: {lead.name}</h1>

      <div className="flex flex-wrap gap-2 rounded-lg border bg-white p-3">
        <button onClick={markContacted} className="bg-slate-900 text-white hover:bg-slate-700">
          Mark Contacted
        </button>
        <button onClick={setFollowupTomorrow} className="bg-sky-600 text-white hover:bg-sky-500">
          Set Follow-up (Tomorrow)
        </button>
        {STAGES.map((stage) => (
          <button
            key={stage}
            onClick={() => quickStageUpdate(stage)}
            className="border border-slate-300 bg-white text-slate-800 hover:bg-slate-100"
          >
            Move to {stage}
          </button>
        ))}
      </div>

      <LeadForm
        submitLabel="Save Changes"
        onSubmit={updateLead}
        defaultValues={{
          name: lead.name,
          phone: lead.phone ?? '',
          budget_min: lead.budget_min,
          budget_max: lead.budget_max,
          expected_price: lead.expected_price,
          commission_percent: lead.commission_percent,
          property_interest: lead.property_interest ?? '',
          source: lead.source ?? '',
          stage: lead.stage,
          next_followup_date: lead.next_followup_date ?? '',
          notes: lead.notes ?? ''
        }}
      />
    </div>
  );
}
