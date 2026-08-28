import { useEffect, useState, useCallback } from "react";
import PageContainer from "../components/layout/PageContainer";
import RandomExpenseList from "../components/expenses/RandomExpenseList";
import RandomExpenseForm from "../components/expenses/RandomExpenseForm";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import { api } from "../services/api";
import { currentMonthKey } from "../utils/format";

export default function RandomExpenses() {
  const month = currentMonthKey();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setExpenses(await api.listRandomExpenses(month));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [month]);

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
      await api.updateRandomExpense(editing.id, data);
    } else {
      await api.createRandomExpense(data);
    }
    await load();
  }

  async function handleDelete(expense) {
    if (!confirm(`Delete "${expense.description}"?`)) return;
    try {
      await api.deleteRandomExpense(expense.id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-lg text-ivory tracking-wide">Random Expenses</h2>
        {expenses.length > 0 && <Button onClick={openAdd}>+ ADD EXPENSE</Button>}
      </div>

      {error && <div className="mb-4"><Alert>{error}</Alert></div>}

      {loading ? (
        <p className="text-ash text-sm">Loading…</p>
      ) : (
        <RandomExpenseList
          expenses={expenses}
          onEdit={openEdit}
          onDelete={handleDelete}
          onAdd={openAdd}
        />
      )}

      <RandomExpenseForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initial={editing}
      />
    </PageContainer>
  );
}
