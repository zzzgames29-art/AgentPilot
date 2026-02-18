'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import type { Lead } from '@/lib/types';
import { LeadFilters, type LeadFilterState } from '@/components/LeadFilters';

const initialFilters: LeadFilterState = {
  stage: '',
  source: '',
  followup: 'all'
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLeads = async () => {
      const supabase = createClient();
      const { data, error: queryError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (queryError) {
        setError(queryError.message);
      } else {
        setLeads(data as Lead[]);
      }
      setLoading(false);
    };

    void loadLeads();
  }, []);

  const filtered = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return leads.filter((lead) => {
      const stageMatch = !filters.stage || lead.stage.toLowerCase().includes(filters.stage.toLowerCase());
      const sourceMatch = !filters.source || (lead.source ?? '').toLowerCase().includes(filters.source.toLowerCase());

      let followupMatch = true;
      if (filters.followup === 'overdue') followupMatch = !!lead.next_followup_date && lead.next_followup_date < today;
      if (filters.followup === 'today') followupMatch = lead.next_followup_date === today;
      if (filters.followup === 'none') followupMatch = !lead.next_followup_date;

      return stageMatch && sourceMatch && followupMatch;
    });
  }, [filters, leads]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Leads</h1>
        <Link href="/leads/new" className="bg-sky-600 text-white hover:bg-sky-500 rounded-md px-3 py-2 text-sm">
          + Add Lead
        </Link>
      </div>

      <LeadFilters filters={filters} onChange={setFilters} />

      {loading && <p>Loading leads...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Stage</th>
              <th className="px-3 py-2">Source</th>
              <th className="px-3 py-2">Follow-up</th>
              <th className="px-3 py-2">Expected Price</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <tr key={lead.id} className="border-t">
                <td className="px-3 py-2">
                  <Link href={`/leads/${lead.id}`} className="text-sky-700 underline">
                    {lead.name}
                  </Link>
                </td>
                <td className="px-3 py-2">{lead.stage}</td>
                <td className="px-3 py-2">{lead.source || '-'}</td>
                <td className="px-3 py-2">{lead.next_followup_date || '-'}</td>
                <td className="px-3 py-2">{lead.expected_price ? `$${lead.expected_price.toLocaleString()}` : '-'}</td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td className="px-3 py-3 text-slate-500" colSpan={5}>
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
