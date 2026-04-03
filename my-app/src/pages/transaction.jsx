import { useState } from "react";
import { useDark } from "../context/DarkContext";
import makeStyles from "../utils/makestyles";
import Badge from "../components/badge";
import { fmt } from "../utils/helpers";
import { MONTH_LABELS } from "../data/constants";

const PER_PAGE = 10;

const SortArrow = ({ sortKey, active }) => (
  <span style={{ marginLeft: 4, opacity: active.key === sortKey ? 1 : 0.4 }}>
    {active.key === sortKey ? (active.dir === 1 ? "↑" : "↓") : "↕"}
  </span>
);

const TransactionsPage = ({ transactions, role, onEdit, onDelete }) => {
  const s = makeStyles(useDark());

  const [search,  setSearch]  = useState("");
  const [fType,   setFType]   = useState("");
  const [fCat,    setFCat]    = useState("");
  const [fMonth,  setFMonth]  = useState("");
  const [sort,    setSort]    = useState({ key: "date", dir: -1 });
  const [page,    setPage]    = useState(1);

  const cats   = [...new Set(transactions.map((t) => t.category))].sort();
  const months = [...new Set(transactions.map((t) => t.date.slice(0, 7)))].sort().reverse();

  const filtered = transactions
    .filter((t) => {
      const q = search.toLowerCase();
      if (q && !t.description.toLowerCase().includes(q) && !t.category.toLowerCase().includes(q)) return false;
      if (fType  && t.type !== fType)            return false;
      if (fCat   && t.category !== fCat)         return false;
      if (fMonth && !t.date.startsWith(fMonth))  return false;
      return true;
    })
    .sort((a, b) => {
      let va = a[sort.key];
      let vb = b[sort.key];
      if (sort.key === "amount") { va = +va; vb = +vb; }
      return va < vb ? -sort.dir : va > vb ? sort.dir : 0;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const slice = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSort = (key) =>
    setSort((prev) => ({ key, dir: prev.key === key ? -prev.dir : 1 }));

  const changeFilter = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  const inputStyle = {
    padding: "6px 10px",
    borderRadius: 6,
    border: `1px solid ${s.border}`,
    background: s.surface2,
    color: s.text,
    fontFamily: "DM Mono, monospace",
    fontSize: 12,
    outline: "none",
  };
  const thStyle = {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    color: s.muted,
    padding: "10px 18px",
    textAlign: "left",
    background: s.surface2,
    borderBottom: `1px solid ${s.border}`,
    cursor: "pointer",
    userSelect: "none",
    fontFamily: "DM Mono, monospace",
    whiteSpace: "nowrap",
  };
  const tdStyle = {
    padding: "12px 18px",
    fontSize: 12,
    borderBottom: `1px solid ${s.border}`,
    verticalAlign: "middle",
    color: s.text,
    fontFamily: "DM Mono, monospace",
  };

  return (
    <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 10 }}>

      <div
        style={{
          padding: "16px 18px",
          borderBottom: `1px solid ${s.border}`,
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          alignItems: "center",
        }}
      >
        <input
          style={{ ...inputStyle, width: 180 }}
          placeholder="Search..."
          value={search}
          onChange={changeFilter(setSearch)}
        />
        <select style={inputStyle} value={fType} onChange={changeFilter(setFType)}>
          <option value="">All Types</option>
          {["income", "expense", "transfer"].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select style={inputStyle} value={fCat} onChange={changeFilter(setFCat)}>
          <option value="">All Categories</option>
          {cats.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select style={inputStyle} value={fMonth} onChange={changeFilter(setFMonth)}>
          <option value="">All Months</option>
          {months.map((m) => {
            const [y, mo] = m.split("-");
            return (
              <option key={m} value={m}>
                {MONTH_LABELS[+mo]} {y}
              </option>
            );
          })}
        </select>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {[
                ["date",        "Date"],
                ["description", "Description"],
                ["category",    "Category"],
                ["type",        "Type"],
                ["amount",      "Amount"],
              ].map(([key, label]) => (
                <th key={key} style={thStyle} onClick={() => handleSort(key)}>
                  {label}
                  <SortArrow sortKey={key} active={sort} />
                </th>
              ))}
              {role === "admin" && <th style={thStyle}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {slice.length === 0 ? (
              <tr>
                <td
                  colSpan={role === "admin" ? 6 : 5}
                  style={{ textAlign: "center", padding: 40, color: s.muted, fontFamily: "DM Mono, monospace" }}
                >
                  No transactions match your filters
                </td>
              </tr>
            ) : (
              slice.map((t) => (
                <tr key={t.id}>
                  <td style={{ ...tdStyle, color: s.muted }}>{t.date}</td>
                  <td style={tdStyle}>{t.description}</td>
                  <td style={tdStyle}>{t.category}</td>
                  <td style={tdStyle}><Badge type={t.type} /></td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        fontFamily: "Fraunces, serif",
                        fontSize: 14,
                        fontWeight: 500,
                        color:
                          t.type === "income"   ? s.incomeColor  :
                          t.type === "transfer" ? s.muted        :
                          s.expenseColor,
                      }}
                    >
                      {t.type === "income" ? "+" : t.type === "transfer" ? "→" : "−"}
                      {fmt(t.amount)}
                    </span>
                  </td>
                  {role === "admin" && (
                    <td style={tdStyle}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => onEdit(t)}
                          style={{
                            padding: "3px 10px",
                            borderRadius: 4,
                            border: `1px solid ${s.border}`,
                            background: s.surface,
                            color: s.text,
                            cursor: "pointer",
                            fontFamily: "DM Mono, monospace",
                            fontSize: 11,
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => { if (window.confirm("Delete this transaction?")) onDelete(t.id); }}
                          style={{
                            padding: "3px 10px",
                            borderRadius: 4,
                            border: `1px solid ${s.danger}`,
                            background: s.dangerLight,
                            color: s.danger,
                            cursor: "pointer",
                            fontFamily: "DM Mono, monospace",
                            fontSize: 11,
                          }}
                        >
                          Del
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 18px",
          borderTop: `1px solid ${s.border}`,
        }}
      >
        <span style={{ fontSize: 11, color: s.muted, fontFamily: "DM Mono, monospace" }}>
          {filtered.length} transactions
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                padding: "4px 10px",
                borderRadius: 4,
                border: `1px solid ${p === page ? s.accent : s.border}`,
                background: p === page ? s.accent : s.surface,
                color: p === page ? "#fff" : s.text,
                cursor: "pointer",
                fontFamily: "DM Mono, monospace",
                fontSize: 11,
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
