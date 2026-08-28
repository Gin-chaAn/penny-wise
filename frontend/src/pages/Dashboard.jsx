import { useEffect, useState, useCallback } from "react";
import PageContainer from "../components/layout/PageContainer";
import IncomeCard from "../components/dashboard/IncomeCard";
import SummaryCards from "../components/dashboard/SummaryCards";
import SpendingLimitCard from "../components/dashboard/SpendingLimitCard";
import SpendingLimitModal from "../components/dashboard/SpendingLimitModal";
import CategoryBreakdown from "../components/dashboard/CategoryBreakdown";
import RecentExpenses from "../components/dashboard/RecentExpenses";
import Alert from "../components/ui/Alert";
import { api } from "../services/api";
import { currentMonthKey } from "../utils/format";

export default function Dashboard() {
  const month = currentMonthKey();
  const [dashboard, setDashboard] = useState(null);
  const [fixedExpenses, setFixedExpenses] = useState([]);
  const [randomExpenses, setRandomExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [limitModalOpen, setLimitModalOpen] = useState(false);

  const loadAll = useCallback(async () => {
    setError(null);
    try {
      const [dash, fixed, random] = await Promise.all([
        api.getDashboard(month),
        api.listFixedExpenses(),
        api.listRandomExpenses(month),
      ]);
      setDashboard(dash);
      setFixedExpenses(fixed);
      setRandomExpenses(random);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  async function handleIncomeSave(amount) {
    await api.setIncome(amount, month);
    await loadAll();
  }

  async function handleLimitSave(amount) {
    await api.updateSettings(amount);
    await loadAll();
  }

  if (loading) {
    return (
      <PageContainer>
        <p className="text-ash text-sm">Loading dashboard…</p>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Alert>{error}</Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <IncomeCard income={dashboard.income} onSave={handleIncomeSave} />

        <SummaryCards dashboard={dashboard} />

        <div className="grid md:grid-cols-2 gap-6">
          <SpendingLimitCard dashboard={dashboard} onEditLimit={() => setLimitModalOpen(true)} />
          <CategoryBreakdown items={dashboard.category_breakdown} />
        </div>

        <RecentExpenses fixedExpenses={fixedExpenses} randomExpenses={randomExpenses} />
      </div>

      <SpendingLimitModal
        open={limitModalOpen}
        onClose={() => setLimitModalOpen(false)}
        currentLimit={dashboard.monthly_limit}
        onSave={handleLimitSave}
      />
    </PageContainer>
  );
}
