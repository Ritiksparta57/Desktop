import { useDark } from "../context/DarkContext";
import makeStyles from "../utils/makestyles";

const PAGE_TITLES = {
  dashboard:    "Overview",
  transactions: "Transactions",
  insights:     "Insights",
};

const Topbar = ({ activePage, role, onRoleChange, onToggleDark, onExport, onAdd }) => {
  const s = makeStyles(useDark());

  const btnBase = {
    padding: "6px 14px",
    borderRadius: 6,
    border: `1px solid ${s.border}`,
    background: s.surface,
    color: s.text,
    cursor: "pointer",
    fontFamily: "DM Mono, monospace",
    fontSize: 12,
  };

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: s.bg,
        borderBottom: `1px solid ${s.border}`,
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          fontFamily: "Fraunces, serif",
          fontSize: 20,
          fontWeight: 500,
          color: s.text,
        }}
      >
        {PAGE_TITLES[activePage]}
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <select
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          style={{ ...btnBase, cursor: "pointer" }}
        >
          <option value="admin">Admin</option>
          <option value="viewer">Viewer</option>
        </select>

        <button onClick={onToggleDark} style={{ ...btnBase, fontSize: 14 }} title="Toggle dark mode">
          ◑
        </button>

        <button onClick={onExport} style={btnBase}>
          ↓ Export
        </button>
        {role === "admin" && (
          <button
            onClick={onAdd}
            style={{
              ...btnBase,
              background: s.accent,
              color: "#fff",
              borderColor: s.accent,
            }}
          >
            + Add
          </button>
        )}
      </div>
    </div>
  );
};

export default Topbar;
