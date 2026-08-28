import { useEffect, useState, useCallback } from "react";
import PageContainer from "../components/layout/PageContainer";
import FixedExpenseList from "../components/expenses/FixedExpenseList";
import FixedExpenseForm from "../components/expenses/FixedExpenseForm";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import { api } from "../services/api";

export default function FixedExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setExpenses(await api.listFixedExpenses());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(expense) {
    setEditing(expense);
    setFormOpen(true);
  }

  async function handleSubmit(data) {
    if (editing) {
      await api.updateFixedExpense(editing.id, data);
    } else {
      await api.createFixedExpense(data);
    }
    await load();
  }

  async function handleDelete(expense) {
    if (!confirm(`Delete "${expense.name}"?`)) return;
    try {
      await api.deleteFixedExpense(expense.id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-lg text-ivory tracking-wide">Fixed Expenses</h2>
        {expenses.length > 0 && <Button onClick={openAdd}>+ ADD EXPENSE</Button>}
      </div>

      {error && <div className="mb-4"><Alert>{error}</Alert></div>}

      {loading ? (
        <p className="text-ash text-sm">Loading…</p>
      ) : (
        <FixedExpenseList
          expenses={expenses}
          onEdit={openEdit}
          onDelete={handleDelete}
          onAdd={openAdd}
        />
      )}

      <FixedExpenseForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initial={editing}
      />
    </PageContainer>
  );
}
