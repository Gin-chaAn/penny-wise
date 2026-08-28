import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { Input } from "../ui/Input";
import CategorySelect from "./CategorySelect";
import Button from "../ui/Button";
import Alert from "../ui/Alert";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function RandomExpenseForm({ open, onClose, onSubmit, initial }) {
  const [form, setForm] = useState({ description: "", amount: "", category: "Other", date: todayStr() });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        description: initial.description,
        amount: initial.amount,
        category: initial.category,
        date: initial.date,
      });
    } else {
      setForm({ description: "", amount: "", category: "Other", date: todayStr() });
    }
    setError(null);
  }, [initial, open]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const amount = parseFloat(form.amount);
    if (!form.description.trim()) return setError("Description is required.");
    if (isNaN(amount) || amount <= 0) return setError("Amount must be a number greater than zero.");
    if (!form.date) return setError("Date is required.");

    setSubmitting(true);
    try {
      await onSubmit({ ...form, amount });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Expense" : "Add Expense"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert>{error}</Alert>}
        <Input
          label="Description"
          placeholder="e.g. Coffee with a friend"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <Input
          label="Amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        <CategorySelect
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <Input
          label="Date"
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {initial ? "Save Changes" : "Add Expense"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
