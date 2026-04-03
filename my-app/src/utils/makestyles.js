const makeStyles = (dark) => ({
  bg:           dark ? "#111110" : "#f7f5f0",
  surface:      dark ? "#1c1c1a" : "#ffffff",
  surface2:     dark ? "#252522" : "#f0ede6",
  border:       dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
  text:         dark ? "#f0ede6" : "#1a1a18",
  muted:        dark ? "#8a8a80" : "#6b6b62",
  accent:       dark ? "#7bbf6f" : "#2d5a27",
  accentLight:  dark ? "#1a2e18" : "#e8f0e6",
  danger:       dark ? "#d47070" : "#8b2a2a",
  dangerLight:  dark ? "#2a1818" : "#faeaea",
  warning:      dark ? "#d4b660" : "#7a5c00",
  warningLight: dark ? "#2a2510" : "#fdf6e3",
  incomeColor:  dark ? "#7bbf6f" : "#2d5a27",
  expenseColor: dark ? "#d47070" : "#8b2a2a",
  gridColor:    dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
  tickColor:    dark ? "#8a8a80" : "#6b6b62",
});

export default makeStyles;
