import { useRef } from "react";
import { useDark } from "../context/DarkContext";
import makeStyles from "../utils/makestyles";
import useChart from "../utils/usechart";
import { CAT_COLORS } from "../data/constants";
import { fmt } from "../utils/helpers";

const DonutChart = ({ transactions }) => {
  const s   = makeStyles(useDark());
  const ref = useRef(null);

  const catMap = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      catMap[t.category] = (catMap[t.category] || 0) + t.amount;
    });

  const entries = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const config = {
    type: "doughnut",
    data: {
      labels: entries.map((e) => e[0]),
      datasets: [
        {
          data: entries.map((e) => Math.round(e[1])),
          backgroundColor: CAT_COLORS,
          borderWidth: 0,
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "68%",
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: (ctx) => " " + fmt(ctx.raw) },
        },
      },
    },
  };

  useChart(ref, config);

  return (
    <>
      <canvas ref={ref} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
        {entries.map((e, i) => (
          <span
            key={e[0]}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11,
              color: s.muted,
              fontFamily: "DM Mono, monospace",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 2,
                background: CAT_COLORS[i],
                flexShrink: 0,
              }}
            />
            {e[0].split("&")[0].trim()}
          </span>
        ))}
      </div>
    </>
  );
};

export default DonutChart;
