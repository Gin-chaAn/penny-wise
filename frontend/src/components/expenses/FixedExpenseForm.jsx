import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { Input, Select } from "../ui/Input";
import CategorySelect from "./CategorySelect";
import Button from "../ui/Button";
import Alert from "../ui/Alert";

const FREQUENCIES = ["monthly", "weekly", "yearly"];

export default function FixedExpenseForm({ open, onClose, onSubmit, initial }) {
  const [form, setForm] = useState({ name: "", amount: "", category: "Other", frequency: "monthly" });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name,
        amount: initial.amount,
        category: initial.category,
        frequency: initial.frequency,
      });
    } else {
      setForm({ name: "", amount: "", category: "Other", frequency: "monthly" });
    }
    setError(null);
  }, [initial, open]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const amount = parseFloat(form.amount);
    if (!form.name.trim()) return setError("Name is required.");
    if (isNaN(amount) || amount <= 0) return setError("Amount must be a number greater than zero.");

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
    <Modal open={open} onClose={onClose} title={initial ? "Edit Fixed Expense" : "Add Fixed Expense"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert>{error}</Alert>}
        <Input
          label="Name"
          placeholder="e.g. Rent"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
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
        <Select
          label="Frequency"
          value={form.frequency}
          onChange={(e) => setForm({ ...form, frequency: e.target.value })}
        >
          {FREQUENCIES.map((f) => (
            <option key={f} value={f}>
              {f[0].toUpperCase() + f.slice(1)}
            </option>
          ))}
        </Select>
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
