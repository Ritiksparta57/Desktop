import { useRef } from "react";
import { useDark } from "../context/DarkContext";
import makeStyles from "../utils/makestyles";
import useChart from "../utils/usechart";
import { MONTHS, MONTH_LABELS } from "../data/constants";

const MonthlyChart = ({ transactions }) => {
  const dark = useDark();
  const s    = makeStyles(dark);
  const ref  = useRef(null);

  const labels   = MONTHS.map((m) => MONTH_LABELS[+m.split("-")[1]]);
  const incomes  = MONTHS.map((m) =>
    Math.round(
      transactions
        .filter((t) => t.date.startsWith(m) && t.type === "income")
        .reduce((a, t) => a + t.amount, 0)
    )
  );
  const expenses = MONTHS.map((m) =>
    Math.round(
      transactions
        .filter((t) => t.date.startsWith(m) && t.type === "expense")
        .reduce((a, t) => a + t.amount, 0)
    )
  );

  const config = {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Income",
          data: incomes,
          backgroundColor: dark ? "rgba(123,191,111,0.7)" : "rgba(45,90,39,0.7)",
          borderRadius: 4,
        },
        {
          label: "Expenses",
          data: expenses,
          backgroundColor: dark ? "rgba(212,112,112,0.7)" : "rgba(139,42,42,0.7)",
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: s.tickColor,
            font: { family: "DM Mono", size: 11 },
            boxWidth: 10,
          },
        },
      },
      scales: {
        x: {
          grid: { color: s.gridColor },
          ticks: { color: s.tickColor, font: { family: "DM Mono", size: 11 } },
        },
        y: {
          grid: { color: s.gridColor },
          ticks: {
            color: s.tickColor,
            font: { family: "DM Mono", size: 11 },
            callback: (v) => "₹" + Math.round(v / 1000) + "K",
          },
        },
      },
    },
  };

  useChart(ref, config);

  return <canvas ref={ref} />;
};

export default MonthlyChart;
