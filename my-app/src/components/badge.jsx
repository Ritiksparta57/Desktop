import { useDark } from "../context/DarkContext";
import makeStyles from "../utils/makestyles";

const Badge = ({ type }) => {
  const s = makeStyles(useDark());

  const variants = {
    income:   { bg: s.accentLight,  color: s.incomeColor  },
    expense:  { bg: s.dangerLight,  color: s.expenseColor },
    transfer: { bg: s.warningLight, color: s.warning      },
  };

  const { bg, color } = variants[type] || variants.expense;

  return (
    <span
      style={{
        display: "inline-flex",
        padding: "3px 9px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 500,
        fontFamily: "DM Mono, monospace",
        background: bg,
        color,
      }}
    >
      {type}
    </span>
  );
};

export default Badge;
