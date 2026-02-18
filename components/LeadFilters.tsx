'use client';

export interface LeadFilterState {
  stage: string;
  source: string;
  followup: 'all' | 'overdue' | 'today' | 'none';
}

interface Props {
  filters: LeadFilterState;
  onChange: (next: LeadFilterState) => void;
}

export function LeadFilters({ filters, onChange }: Props) {
  return (
    <div className="grid gap-4 rounded-lg border bg-white p-4 md:grid-cols-3">
      <div>
        <label>Stage</label>
        <input
          value={filters.stage}
          onChange={(e) => onChange({ ...filters, stage: e.target.value })}
          placeholder="e.g. Viewing"
        />
      </div>
      <div>
        <label>Source</label>
        <input
          value={filters.source}
          onChange={(e) => onChange({ ...filters, source: e.target.value })}
          placeholder="e.g. Referral"
        />
      </div>
      <div>
        <label>Follow-up Due</label>
        <select
          value={filters.followup}
          onChange={(e) => onChange({ ...filters, followup: e.target.value as LeadFilterState['followup'] })}
        >
          <option value="all">All</option>
          <option value="overdue">Overdue</option>
          <option value="today">Due today</option>
          <option value="none">No follow-up date</option>
        </select>
      </div>
    </div>
  );
}
