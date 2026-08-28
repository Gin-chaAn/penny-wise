/**
 * Thin fetch wrapper for the Penny Wise API.
 * No state management library — just fetch + React state, per spec
 * section 26 ("do not build an unnecessarily complicated state
 * management system").
 */
const BASE_URL = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    let detail = "Something went wrong.";
    try {
      const body = await res.json();
      detail = body.detail
        ? Array.isArray(body.detail)
          ? body.detail.map((d) => d.msg).join(", ")
          : body.detail
        : detail;
    } catch (_) {
      // response wasn't JSON — keep the generic message
    }
    throw new Error(detail);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // Income
  getIncome: (month) => request(`/income?month=${month}`),
  setIncome: (amount, month) =>
    request(`/income`, { method: "POST", body: JSON.stringify({ amount, month }) }),
  updateIncome: (amount, month) =>
    request(`/income?month=${month}`, { method: "PUT", body: JSON.stringify({ amount }) }),

  // Fixed expenses
  listFixedExpenses: () => request(`/fixed-expenses`),
  createFixedExpense: (data) =>
    request(`/fixed-expenses`, { method: "POST", body: JSON.stringify(data) }),
  updateFixedExpense: (id, data) =>
    request(`/fixed-expenses/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteFixedExpense: (id) => request(`/fixed-expenses/${id}`, { method: "DELETE" }),

  // Random expenses
  listRandomExpenses: (month) => request(`/random-expenses?month=${month}`),
  createRandomExpense: (data) =>
    request(`/random-expenses`, { method: "POST", body: JSON.stringify(data) }),
  updateRandomExpense: (id, data) =>
    request(`/random-expenses/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteRandomExpense: (id) => request(`/random-expenses/${id}`, { method: "DELETE" }),

  // Settings
  getSettings: () => request(`/settings`),
  updateSettings: (monthly_limit) =>
    request(`/settings`, { method: "PUT", body: JSON.stringify({ monthly_limit }) }),

  // Dashboard
  getDashboard: (month) => request(`/dashboard?month=${month}`),
};
