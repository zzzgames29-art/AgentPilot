import { OPEN_STAGES, STAGES } from '@/lib/constants';
import type { Lead } from '@/lib/types';
import { format } from 'date-fns';

interface Props {
  leads: Lead[];
}

export function DashboardStats({ leads }: Props) {
  const today = new Date().toISOString().slice(0, 10);

  const overdue = leads.filter(
    (lead) => lead.next_followup_date && lead.next_followup_date < today && lead.stage !== 'Closed' && lead.stage !== 'Lost'
  );

  const dueToday = leads.filter(
    (lead) => lead.next_followup_date === today && lead.stage !== 'Closed' && lead.stage !== 'Lost'
  );

  const stageCounts = STAGES.map((stage) => ({
    stage,
    count: leads.filter((lead) => lead.stage === stage).length
  }));

  const pipelineValue = leads
    .filter((lead) => OPEN_STAGES.includes(lead.stage as (typeof OPEN_STAGES)[number]))
    .reduce((sum, lead) => sum + (lead.expected_price ?? 0), 0);

  const expectedCommission = leads
    .filter((lead) => OPEN_STAGES.includes(lead.stage as (typeof OPEN_STAGES)[number]))
    .reduce((sum, lead) => sum + (lead.expected_price ?? 0) * (lead.commission_percent ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Pipeline Value" value={`$${pipelineValue.toLocaleString()}`} />
        <Card title="Expected Commission" value={`$${expectedCommission.toLocaleString()}`} />
        <Card title="Overdue Follow-ups" value={`${overdue.length}`} />
        <Card title="Due Today" value={`${dueToday.length}`} />
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <ListCard title="Overdue follow-ups" leads={overdue} />
        <ListCard title="Follow-ups due today" leads={dueToday} />
      </section>

      <section className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 text-base font-semibold">Leads by stage</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {stageCounts.map((item) => (
            <div key={item.stage} className="rounded-md bg-slate-100 p-3">
              <p className="text-sm text-slate-600">{item.stage}</p>
              <p className="text-2xl font-bold">{item.count}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function ListCard({ title, leads }: { title: string; leads: Lead[] }) {
  return (
    <section className="rounded-lg border bg-white p-4">
      <h2 className="mb-2 text-base font-semibold">{title}</h2>
      {leads.length === 0 ? (
        <p className="text-sm text-slate-500">No leads in this section.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {leads.map((lead) => (
            <li key={lead.id} className="rounded bg-slate-100 p-2">
              <p className="font-medium">{lead.name}</p>
              <p className="text-slate-600">
                {lead.stage} • Follow-up {lead.next_followup_date ? format(new Date(lead.next_followup_date), 'PPP') : 'N/A'}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
