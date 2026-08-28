import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import { formatCurrency, formatDate } from "../../utils/format";

export default function RecentExpenses({ randomExpenses, fixedExpenses }) {
  const recentRandom = [...randomExpenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <Card>
      <p className="text-xs uppercase tracking-widest text-ash mb-4">Recent Activity</p>

      {recentRandom.length === 0 && fixedExpenses.length === 0 ? (
        <EmptyState
          title="NO ACTIVITY YET"
          description="Your recent expenses will appear here."
        />
      ) : (
        <div className="space-y-4">
          {recentRandom.length > 0 && (
            <div>
              <p className="text-[11px] uppercase tracking-wider text-smoke mb-2">Random Spending</p>
              <ul className="space-y-2">
                {recentRandom.map((e) => (
                  <li key={e.id} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-ivory">{e.description}</span>
                      <span className="text-smoke text-xs ml-2">{e.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-ivory">{formatCurrency(e.amount)}</div>
                      <div className="text-smoke text-xs">{formatDate(e.date)}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {fixedExpenses.length > 0 && (
            <div>
              <p className="text-[11px] uppercase tracking-wider text-smoke mb-2 mt-2">
                Fixed Commitments
              </p>
              <ul className="space-y-2">
                {fixedExpenses.slice(0, 4).map((e) => (
                  <li key={e.id} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-ivory">{e.name}</span>
                      <span className="text-smoke text-xs ml-2">{e.category}</span>
                    </div>
                    <div className="text-ivory">{formatCurrency(e.amount)}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
