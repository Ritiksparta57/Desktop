import { useRef } from "react";
import { useDark } from "../context/DarkContext";
import makeStyles from "../utils/makestyles";
import useChart from "../utils/usechart";

const WeeklyChart = ({ transactions }) => {
  const dark = useDark();
  const s    = makeStyles(dark);
  const ref  = useRef(null);

  const dayTotals = [0, 0, 0, 0, 0, 0, 0];
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const day = new Date(t.date).getDay();
      dayTotals[day] += t.amount;
    });

  const config = {
    type: "bar",
    data: {
      labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      datasets: [
        {
          label: "Spending",
          data: dayTotals.map(Math.round),
          backgroundColor: dark
            ? "rgba(123,191,111,0.5)"
            : "rgba(45,90,39,0.5)",
          borderRadius: 4,
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

export default WeeklyChart;
