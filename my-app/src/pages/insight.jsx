import { useDark } from "../context/DarkContext";
import makeStyles from "../utils/makestyles";
import MonthlyChart from "../charts/monthly";
import WeeklyChart from "../charts/weekly";
import { fmt, sumByType, buildCatMap, buildMonthMap } from "../utils/helpers";
import { CAT_COLORS } from "../data/constants";

const InsightsPage = ({ transactions }) => {
  const s = makeStyles(useDark());

  const catMap   = buildCatMap(transactions);
  const monthMap = buildMonthMap(transactions);

  const catEntries = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
  const topCat     = catEntries[0];
  const maxVal     = topCat ? topCat[1] : 1;

  const sortedMonths = Object.keys(monthMap).sort();
  const [m0Str, m1Str] = sortedMonths.slice(-2);
  const m0 = monthMap[m0Str] || {};
  const m1 = monthMap[m1Str] || {};

  const expChange = m0.expense > 0
    ? Math.round(((m1.expense - m0.expense) / m0.expense) * 100)
    : 0;

  const totalInc = sumByType(transactions, "income");
  const totalExp = sumByType(transactions, "expense");
  const avgSR    = totalInc > 0 ? Math.round(((totalInc - totalExp) / totalInc) * 100) : 0;

  const cardStyle  = { background: s.surface, border: `1px solid ${s.border}`, borderRadius: 10, padding: "16px 18px" };
  const chartTitle = { fontSize: 11, textTransform: "uppercase", letterSpacing: "0.8px", color: s.muted, marginBottom: 16, fontFamily: "DM Mono, monospace" };

  const insightCards = [
    {
      icon:  "◎",
      title: "Top Spending Category",
      value: topCat ? topCat[0] : "—",
      desc:  topCat ? `${fmt(topCat[1])} total across all months` : "No expense data",
      color: s.text,
    },
    {
      icon:  expChange <= 0 ? "▼" : "▲",
      title: "MoM Expense Change",
      value: `${expChange >= 0 ? "+" : ""}${expChange}%`,
      desc:  `${expChange <= 0 ? "Spending decreased" : "Spending increased"} from ${m0Str || "—"} to ${m1Str || "—"}`,
      color: expChange <= 0 ? s.incomeColor : s.expenseColor,
    },
    {
      icon:  "◈",
      title: "Avg Savings Rate",
      value: `${avgSR}%`,
      desc:  avgSR >= 20 ? "Healthy! Above 20% benchmark" : "Below 20% — consider reducing expenses",
      color: avgSR >= 20 ? s.incomeColor : s.expenseColor,
    },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
        {insightCards.map((card) => (
          <div key={card.title} style={cardStyle}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>{card.icon}</div>
            <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4, fontFamily: "DM Mono, monospace" }}>
              {card.title}
            </div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: 16, fontWeight: 500, marginBottom: 4, color: card.color }}>
              {card.value}
            </div>
            <div style={{ fontSize: 11, color: s.muted, lineHeight: 1.5, fontFamily: "DM Mono, monospace" }}>
              {card.desc}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
        <div style={cardStyle}>
          <div style={chartTitle}>Monthly Income vs Expenses</div>
          <div style={{ position: "relative", height: 240 }}>
            <MonthlyChart transactions={transactions} />
          </div>
        </div>

        <div style={cardStyle}>
          <div style={chartTitle}>Top Spending Categories</div>
          {catEntries.slice(0, 6).map((entry, i) => (
            <div key={entry[0]} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div
                style={{
                  fontSize: 11,
                  color: s.muted,
                  width: 90,
                  textAlign: "right",
                  flexShrink: 0,
                  fontFamily: "DM Mono, monospace",
                }}
              >
                {entry[0].split("&")[0].trim().split(" ").slice(0, 2).join(" ")}
              </div>
              <div style={{ flex: 1, height: 6, background: s.surface2, borderRadius: 3, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${Math.round((entry[1] / maxVal) * 100)}%`,
                    background: CAT_COLORS[i],
                    borderRadius: 3,
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
              <div style={{ fontSize: 11, fontFamily: "Fraunces, serif", minWidth: 70, color: s.text }}>
                {fmt(entry[1])}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={cardStyle}>
        <div style={chartTitle}>Weekly Spending Pattern</div>
        <div style={{ position: "relative", height: 200 }}>
          <WeeklyChart transactions={transactions} />
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;
