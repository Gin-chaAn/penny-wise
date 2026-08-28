import Card from "../ui/Card";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";
import { formatCurrency } from "../../utils/format";

export default function FixedExpenseList({ expenses, onEdit, onDelete, onAdd }) {
  if (expenses.length === 0) {
    return (
      <EmptyState
        title="NO FIXED EXPENSES"
        description="Your recurring commitments will appear here."
        action={<Button onClick={onAdd}>+ ADD FIXED EXPENSE</Button>}
      />
    );
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <p className="text-xs uppercase tracking-widest text-ash">
          {expenses.length} {expenses.length === 1 ? "expense" : "expenses"}
        </p>
        <p className="text-sm text-ivory">
          Total: <span className="font-semibold">{formatCurrency(total)}</span>
        </p>
      </div>

      {expenses.map((e) => (
        <Card key={e.id} className="flex items-center justify-between !py-3">
          <div>
            <p className="text-ivory font-medium">{e.name}</p>
            <p className="text-xs text-ash mt-0.5">
              {e.category} · {e.frequency}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-ivory font-medium">{formatCurrency(e.amount)}</p>
            <div className="flex gap-1">
              <button
                onClick={() => onEdit(e)}
                className="text-xs text-ash hover:text-ivory px-2 py-1 transition duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(e)}
                className="text-xs text-ash hover:text-blood px-2 py-1 transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
