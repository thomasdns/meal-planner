type SummaryCardProps = {
  label: string;
  value: number;
  helper: string;
};

export function SummaryCard({ label, value, helper }: SummaryCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{helper}</p>
    </div>
  );
}
