import { useDark } from "../context/DarkContext";
import makeStyles from "../utils/makestyles";

const SummaryCard = ({ label, value, change, changeDir }) => {
  const s = makeStyles(useDark());

  return (
    <div
      style={{
        background: s.surface,
        border: `1px solid ${s.border}`,
        borderRadius: 10,
        padding: "16px 18px",
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: s.muted,
          textTransform: "uppercase",
          letterSpacing: "0.8px",
          marginBottom: 8,
          fontFamily: "DM Mono, monospace",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontFamily: "Fraunces, serif",
          fontSize: 24,
          fontWeight: 500,
          letterSpacing: "-1px",
          color: s.text,
        }}
      >
        {value}
      </div>

      {change && (
        <div
          style={{
            fontSize: 11,
            marginTop: 6,
            fontFamily: "DM Mono, monospace",
            color: changeDir === "up" ? s.incomeColor : s.expenseColor,
          }}
        >
          {change}
        </div>
      )}
    </div>
  );
};

export default SummaryCard;
