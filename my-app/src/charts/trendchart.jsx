import { useRef } from "react";
import { useDark } from "../context/DarkContext";
import makeStyles from "../utils/makestyles";
import useChart from "../utils/usechart";
import { MONTHS, MONTH_LABELS } from "../data/constants";

const TrendChart = ({ transactions }) => {
  const dark = useDark();
  const s    = makeStyles(dark);
  const ref  = useRef(null);

  const labels = MONTHS.map((m) => MONTH_LABELS[+m.split("-")[1]]);

  let running = 0;
  const data = MONTHS.map((m) => {
    const tx = transactions.filter((t) => t.date.startsWith(m));
    running += tx.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0);
    running -= tx.filter((t) => t.type === "expense").reduce((a, t) => a + t.amount, 0);
    running -= tx.filter((t) => t.type === "transfer").reduce((a, t) => a + t.amount, 0);
    return Math.round(running);
  });

  const config = {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Balance",
          data,
          borderColor: s.accent,
          backgroundColor: dark
            ? "rgba(123,191,111,0.08)"
            : "rgba(45,90,39,0.06)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: s.accent,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
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

export default TrendChart;
