import Card from "../ui/Card";
import { formatCurrency } from "../../utils/format";

function Metric({ label, value, emphasis = false }) {
  return (
    <Card className={emphasis ? "border-crimson/40" : ""}>
      <p className="text-xs uppercase tracking-widest text-ash mb-2">{label}</p>
      <p className={`text-2xl font-semibold ${emphasis ? "text-ivory" : "text-ivory/90"}`}>
        {formatCurrency(value)}
      </p>
    </Card>
  );
}

export default function SummaryCards({ dashboard }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <Metric label="Monthly Income" value={dashboard.income} />
      <Metric label="Fixed Expenses" value={dashboard.fixed_total} />
      <Metric label="Random Expenses" value={dashboard.random_total} />
      <Metric label="Total Expenses" value={dashboard.total_expenses} />
      <Metric
        label="Remaining"
        value={dashboard.remaining_money}
        emphasis
      />
    </div>
  );
}
