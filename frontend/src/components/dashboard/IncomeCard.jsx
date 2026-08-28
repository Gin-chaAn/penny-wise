import { useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import { Input } from "../ui/Input";
import Alert from "../ui/Alert";
import { formatCurrency } from "../../utils/format";

export default function IncomeCard({ income, onSave }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(income || "");
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  function openModal() {
    setValue(income || "");
    setError(null);
    setOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const amount = parseFloat(value);
    if (isNaN(amount) || amount <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }
    setSaving(true);
    try {
      await onSave(amount);
      setOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Card className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-ash mb-1">Monthly Income</p>
          <p className="text-2xl font-semibold text-ivory">{formatCurrency(income)}</p>
        </div>
        <Button variant="secondary" onClick={openModal}>
          {income > 0 ? "Edit" : "Set Income"}
        </Button>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Monthly Income">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert>{error}</Alert>}
          <Input
            label="Amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              Save
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
