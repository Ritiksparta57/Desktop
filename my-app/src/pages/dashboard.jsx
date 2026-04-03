import { useDark } from "../context/DarkContext";
import makeStyles from "../utils/makestyles";
import SummaryCard from "../components/summary";
import TrendChart from "../charts/trendchart";
import DonutChart from "../charts/donut";
import { fmt, fmtShort, sumByType, txForMonth } from "../utils/helpers";
import { CURRENT_MONTH, PREV_MONTH } from "../data/constants";

const DashboardPage = ({ transactions }) => {
  const s = makeStyles(useDark());

  const curTx  = txForMonth(transactions, CURRENT_MONTH);
  const prevTx = txForMonth(transactions, PREV_MONTH);

  const curInc  = sumByType(curTx,  "income");
  const curExp  = sumByType(curTx,  "expense");
  const prevInc = sumByType(prevTx, "income");
  const prevExp = sumByType(prevTx, "expense");

  const balance  = sumByType(transactions, "income") - sumByType(transactions, "expense") - sumByType(transactions, "transfer");
  const sr       = curInc > 0 ? Math.round(((curInc - curExp) / curInc) * 100) : 0;
  const incChg   = prevInc > 0 ? Math.round(((curInc - prevInc) / prevInc) * 100) : 0;
  const expChg   = prevExp > 0 ? Math.round(((curExp - prevExp) / prevExp) * 100) : 0;

  const recent = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  const cardStyle  = { background: s.surface, border: `1px solid ${s.border}`, borderRadius: 10, padding: 18 };
  const chartTitle = { fontSize: 11, textTransform: "uppercase", letterSpacing: "0.8px", color: s.muted, marginBottom: 16, fontFamily: "DM Mono, monospace" };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        <SummaryCard
          label="Total Balance"
          value={fmtShort(balance)}
          change="4-month running total"
          changeDir="up"
        />
        <SummaryCard
          label="Monthly Income"
          value={fmtShort(curInc)}
          change={`${incChg >= 0 ? "▲ +" : "▼ "}${Math.abs(incChg)}% vs last month`}
          changeDir={incChg >= 0 ? "up" : "down"}
        />
        <SummaryCard
          label="Monthly Expenses"
          value={fmtShort(curExp)}
          change={`${expChg >= 0 ? "▲ +" : "▼ "}${Math.abs(expChg)}% vs last month`}
          changeDir={expChg <= 0 ? "up" : "down"}
        />
        <SummaryCard
          label="Savings Rate"
          value={`${sr}%`}
          change={sr >= 20 ? "▲ On track" : "▼ Below 20% goal"}
          changeDir={sr >= 20 ? "up" : "down"}
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 14, marginBottom: 24 }}>
        <div style={cardStyle}>
          <div style={chartTitle}>Balance Trend — 6 months</div>
          <div style={{ position: "relative", height: 220 }}>
            <TrendChart transactions={transactions} />
          </div>
        </div>
        <div style={cardStyle}>
          <div style={chartTitle}>Spending by Category</div>
          <div style={{ position: "relative", height: 180 }}>
            <DonutChart transactions={transactions} />
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={chartTitle}>Recent Transactions</div>
        {recent.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: s.muted, fontFamily: "DM Mono, monospace" }}>
            No transactions yet
          </div>
        ) : (
          recent.map((t) => (
            <div
              key={t.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: `1px solid ${s.border}`,
              }}
            >
              <div>
                <div style={{ fontSize: 13, color: s.text, fontFamily: "DM Mono, monospace" }}>
                  {t.description}
                </div>
                <div style={{ fontSize: 11, color: s.muted, marginTop: 2, fontFamily: "DM Mono, monospace" }}>
                  {t.date} · {t.category}
                </div>
              </div>
              <div
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
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
