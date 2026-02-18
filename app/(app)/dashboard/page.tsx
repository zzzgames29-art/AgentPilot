'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import type { Lead } from '@/lib/types';
import { DashboardStats } from '@/components/DashboardStats';

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
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

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <DashboardStats leads={leads} />
    </div>
  );
}
