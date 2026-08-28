export function formatVolume(kg) {
  if (!kg) return "0";
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)}k`;
  return Math.round(kg).toLocaleString();
}

export function formatTarget(sets, reps, weight) {
  const w = Number(weight);
  const weightPart = w > 0 ? ` @ ${w} kg` : "";
  return `${sets} × ${reps}${weightPart}`;
}

export function rpeDescription(value) {
  if (value <= 3) return "Easy — plenty left in the tank";
  if (value <= 5) return "Moderate — could do several more reps";
  if (value <= 7) return "Hard — 3 reps or fewer left";
  if (value <= 9) return "Very hard — 1–2 reps left";
  return "Max effort — nothing left";
}

export function trendLabel(vsPrevious) {
  if (vsPrevious === "up") return "Stronger";
  if (vsPrevious === "down") return "Down";
  return "Same";
}
