'use client';

import { useRouter } from 'next/navigation';
import { LeadForm } from '@/components/LeadForm';
import { createClient } from '@/lib/supabase';
import type { LeadFormValues } from '@/lib/leadSchema';

export default function NewLeadPage() {
  const router = useRouter();

  const handleSubmit = async (values: LeadFormValues) => {
    const supabase = createClient();
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;

    if (!userId) throw new Error('No active session');

    const payload = {
      ...values,
      user_id: userId,
      phone: values.phone || null,
      property_interest: values.property_interest || null,
      source: values.source || null,
      next_followup_date: values.next_followup_date || null,
      notes: values.notes || null
    };

    const { error } = await supabase.from('leads').insert(payload);

    if (error) {
      throw new Error(error.message);
    }

    router.push('/leads');
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Create Lead</h1>
      <LeadForm onSubmit={handleSubmit} submitLabel="Create Lead" />
    </div>
  );
}
