import { useState } from "react";
import { useDark } from "../context/DarkContext";
import makeStyles from "../utils/makestyles";
import { CATEGORIES } from "../data/constants";

const Modal = ({ tx, onClose, onSave }) => {
  const s = makeStyles(useDark());
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState(
    tx
      ? {
          description: tx.description,
          amount:      tx.amount,
          type:        tx.type,
          category:    tx.category,
          date:        tx.date,
        }
      : {
          description: "",
          amount:      "",
          type:        "expense",
          category:    "Food & Dining",
          date:        today,
        }
  );

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSave = () => {
    if (!form.description.trim() || !form.amount || !form.date) {
      alert("Please fill in all fields");
      return;
    }
    onSave({ ...form, amount: parseFloat(form.amount) });
  };

  const inputStyle = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: 6,
    border: `1px solid ${s.border}`,
    background: s.surface2,
    color: s.text,
    fontFamily: "DM Mono, monospace",
    fontSize: 12,
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle = {
    fontSize: 11,
    color: s.muted,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    marginBottom: 6,
    display: "block",
    fontFamily: "DM Mono, monospace",
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <div
        style={{
          background: s.surface,
          border: `1px solid ${s.border}`,
          borderRadius: 12,
          padding: 24,
          width: 380,
          maxWidth: "95vw",
        }}
      >
        <div
          style={{
            fontFamily: "Fraunces, serif",
            fontSize: 18,
            fontWeight: 500,
            color: s.text,
            marginBottom: 20,
          }}
        >
          {tx ? "Edit Transaction" : "Add Transaction"}
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Description</label>
          <input
            type="text"
            value={form.description}
            onChange={set("description")}
            placeholder="e.g. Grocery shopping"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Amount (₹)</label>
          <input
            type="number"
            value={form.amount}
            onChange={set("amount")}
            placeholder="0"
            style={inputStyle}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Type</label>
            <select value={form.type} onChange={set("type")} style={inputStyle}>
              <option value="expense">expense</option>
              <option value="income">income</option>
              <option value="transfer">transfer</option>
            </select>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Category</label>
            <select value={form.category} onChange={set("category")} style={inputStyle}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Date</label>
          <input type="date" value={form.date} onChange={set("date")} style={inputStyle} />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              padding: "6px 14px",
              borderRadius: 6,
              border: `1px solid ${s.border}`,
              background: s.surface,
              color: s.text,
              cursor: "pointer",
              fontFamily: "DM Mono, monospace",
              fontSize: 12,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: "6px 14px",
              borderRadius: 6,
              border: `1px solid ${s.accent}`,
              background: s.accent,
              color: "#fff",
              cursor: "pointer",
              fontFamily: "DM Mono, monospace",
              fontSize: 12,
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
