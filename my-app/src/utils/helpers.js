
export const fmt = (n) => "₹" + Math.abs(n).toLocaleString("en-IN");

export const fmtShort = (n) =>
  n >= 100000
    ? "₹" + (n / 100000).toFixed(1) + "L"
    : "₹" + Math.round(n / 1000) + "K";
export const sumByType = (transactions, type) =>
  transactions.filter((t) => t.type === type).reduce((acc, t) => acc + t.amount, 0);
export const txForMonth = (transactions, month) =>
  transactions.filter((t) => t.date.startsWith(month));
export const buildCatMap = (transactions) => {
  const map = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
  return map;
};
export const buildMonthMap = (transactions) => {
  const map = {};
  transactions.forEach((t) => {
    const m = t.date.slice(0, 7);
    if (!map[m]) map[m] = { income: 0, expense: 0 };
    if (t.type === "income")  map[m].income  += t.amount;
    if (t.type === "expense") map[m].expense += t.amount;
  });
  return map;
};
export const exportToCSV = (transactions) => {
  const rows = [
    ["Date", "Description", "Category", "Type", "Amount"],
    ...transactions.map((t) => [t.date, t.description, t.category, t.type, t.amount]),
  ];
  const csv = rows.map((r) => r.join(",")).join("\n");
  const a   = document.createElement("a");
  a.href    = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
  a.download = "ledger_transactions.csv";
  a.click();
};
