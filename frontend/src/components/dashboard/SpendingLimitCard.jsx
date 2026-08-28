import Card from "../ui/Card";
import ProgressBar from "../ui/ProgressBar";
import { formatCurrency } from "../../utils/format";

export default function SpendingLimitCard({ dashboard, onEditLimit }) {
  const hasLimit = dashboard.monthly_limit > 0;

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase tracking-widest text-ash">Spending Limit</p>
        <button
          onClick={onEditLimit}
          className="text-xs text-crimson hover:text-rose transition duration-200"
        >
          EDIT
        </button>
      </div>

      {hasLimit ? (
        <>
          <p className="text-lg text-ivory font-medium mb-3">
            {formatCurrency(dashboard.total_expenses)} / {formatCurrency(dashboard.monthly_limit)}
          </p>
          <ProgressBar percentage={dashboard.limit_used_percentage} status={dashboard.limit_status} />
          {dashboard.limit_status === "exceeded" && (
            <p className="text-xs text-blood mt-3">
              You've exceeded your monthly spending limit.
            </p>
          )}
          {dashboard.limit_status === "warning" && (
            <p className="text-xs text-rose mt-3">
              You're close to your monthly spending limit.
            </p>
          )}
        </>
      ) : (
        <p className="text-sm text-smoke">No spending limit set yet.</p>
      )}
    </Card>
  );
}
