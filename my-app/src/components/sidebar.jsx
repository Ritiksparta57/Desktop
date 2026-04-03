import { useDark } from "../context/DarkContext";
import makeStyles from "../utils/makestyles";

const NAV_ITEMS = [
  { id: "dashboard",    icon: "▦", label: "Dashboard"    },
  { id: "transactions", icon: "≡", label: "Transactions" },
  { id: "insights",     icon: "◈", label: "Insights"     },
];

const Sidebar = ({ activePage, onNavigate, role }) => {
  const s = makeStyles(useDark());

  return (
    <div
      style={{
        width: 200,
        minWidth: 200,
        background: s.surface,
        borderRight: `1px solid ${s.border}`,
        display: "flex",
        flexDirection: "column",
        padding: "20px 0",
        height: "100vh",
      }}
    >
      <div
        style={{
          padding: "0 20px 24px",
          borderBottom: `1px solid ${s.border}`,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontFamily: "Fraunces, serif",
            fontSize: 18,
            fontWeight: 500,
            letterSpacing: "-0.5px",
            color: s.text,
          }}
        >
          Ledger
        </div>
        <div
          style={{
            fontSize: 10,
            color: s.muted,
            textTransform: "uppercase",
            letterSpacing: 1,
            marginTop: 2,
            fontFamily: "DM Mono, monospace",
          }}
        >
          Finance OS
        </div>
      </div>

      {NAV_ITEMS.map((item) => {
        const isActive = activePage === item.id;
        return (
          <div
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 20px",
              cursor: "pointer",
              fontSize: 12,
              fontFamily: "DM Mono, monospace",
              color: isActive ? s.text : s.muted,
              borderLeft: `2px solid ${isActive ? s.accent : "transparent"}`,
              background: isActive ? s.accentLight : "transparent",
              transition: "all 0.15s",
            }}
          >
            <span style={{ fontSize: 14, width: 16, textAlign: "center" }}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        );
      })}

      <div
        style={{
          marginTop: "auto",
          padding: "16px 20px",
          borderTop: `1px solid ${s.border}`,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 500,
            fontFamily: "DM Mono, monospace",
            background: role === "admin" ? s.accentLight : s.surface2,
            color:      role === "admin" ? s.accent      : s.muted,
          }}
        >
          {role === "admin" ? "● Admin" : "○ Viewer"}
        </span>
      </div>
    </div>
  );
};

export default Sidebar;
