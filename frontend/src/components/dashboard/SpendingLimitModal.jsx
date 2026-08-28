import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { Input } from "../ui/Input";
import Alert from "../ui/Alert";

export default function SpendingLimitModal({ open, onClose, currentLimit, onSave }) {
  const [value, setValue] = useState(currentLimit || "");
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValue(currentLimit || "");
    setError(null);
  }, [currentLimit, open]);

  async function handleSubmit(e) {
    e.preventDefault();
    const amount = parseFloat(value);
    if (isNaN(amount) || amount < 0) {
      setError("Enter a valid amount (zero or more).");
      return;
    }
    setSaving(true);
    try {
      await onSave(amount);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Monthly Spending Limit">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert>{error}</Alert>}
        <Input
          label="Limit"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}
