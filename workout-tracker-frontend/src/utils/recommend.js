// Training "coach" helpers: weekly goal/streak math and autoregulated
// recommendations derived from how a session felt (session RPE) and the
// weights that were actually lifted. All pure functions so they're easy to
// test and reason about.

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

// Monday-based start of the week for a given date, at local midnight.
export function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day + 6) % 7;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Round to the nearest loadable plate increment (2.5 kg by default).
export function roundToPlate(kg, step = 2.5) {
  if (!kg || kg <= 0) return 0;
  return Math.round(kg / step) * step;
}

function isCompleted(w) {
  return w.status === "COMPLETED";
}

// Pull the working set (heaviest logged set), reps at that load, and how many
// sets were missed for a single exercise entry.
export function summarizeExercise(exercise) {
  let workWeight = 0;
  let repsAtTop = 0;
  let failed = 0;
  let logged = false;

  for (const set of exercise.sets || []) {
    if (set.failed) failed += 1;
    const w = Number(set.weight) || 0;
    const r = Number(set.reps) || 0;
    if (w > 0 || r > 0) logged = true;
    if (w > workWeight) {
      workWeight = w;
      repsAtTop = r;
    } else if (w === workWeight && r > repsAtTop) {
      repsAtTop = r;
    }
  }

  return { workWeight, repsAtTop, failed, sets: (exercise.sets || []).length, logged };
}

// The core autoregulation rule. Given a summary of the last time an exercise
// was performed plus the overall session RPE, decide whether to add load,
// hold, or back off, and by how much.
export function recommendForExercise(summary, sessionRpe) {
  const { workWeight, repsAtTop, failed, sets } = summary;
  const rpe = sessionRpe == null ? null : Number(sessionRpe);

  let direction = "hold";
  let reason = "Repeat the load and log how it feels.";
  let recWeight = workWeight;

  if (failed > 0) {
    direction = "down";
    reason = "You missed reps last time, so drop back and rebuild.";
    recWeight = workWeight * 0.95;
  } else if (rpe != null && rpe >= 9) {
    direction = "down";
    reason = "Last session was near-max, so deload a little to recover.";
    recWeight = workWeight * 0.95;
  } else if (rpe != null && rpe <= 6) {
    direction = "up";
    reason = "Felt easy last time, so add some load.";
    recWeight = Math.max(workWeight + 2.5, workWeight * 1.05);
  } else if (rpe != null && rpe <= 8) {
    direction = "up";
    reason = "Solid work, nudge the weight up.";
    recWeight = Math.max(workWeight + 2.5, workWeight * 1.025);
  }

  recWeight = roundToPlate(recWeight);
  if (direction === "up" && recWeight <= workWeight) {
    recWeight = roundToPlate(workWeight + 2.5);
  }
  if (direction === "down" && workWeight > 0 && recWeight >= workWeight) {
    recWeight = roundToPlate(workWeight - 2.5);
  }

  return {
    direction,
    reason,
    recWeight,
    recReps: repsAtTop || null,
    recSets: sets || null,
  };
}

// Build a recommended "next session" from the most recent completed workout,
// progressing each lift based on that session's RPE and the loads used.
export function buildNextSession(workouts) {
  const completed = (workouts || [])
    .filter(isCompleted)
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (completed.length === 0) return null;

  const base = completed[0];
  const rpe = base.sessionRpe ?? null;

  const exercises = (base.exercises || []).map((ex) => {
    const summary = summarizeExercise(ex);
    const rec = recommendForExercise(summary, rpe);
    return {
      catalogId: ex.catalogId ?? null,
      name: ex.name,
      muscleGroup: ex.muscleGroup || null,
      lastWeight: summary.workWeight,
      lastReps: summary.repsAtTop,
      failed: summary.failed,
      targetSets: rec.recSets || ex.targetSets || summary.sets || 3,
      targetReps: rec.recReps || ex.targetReps || summary.repsAtTop || 8,
      targetWeight: rec.recWeight,
      direction: rec.direction,
      reason: rec.reason,
    };
  });

  return {
    basedOnName: base.name,
    basedOnDate: base.date,
    basedOnRpe: rpe,
    exercises,
  };
}

// Aggregate completed-session stats for a single week (offset 0 = this week,
// 1 = last week, ...).
export function weeklyStats(workouts, weeksAgo = 0, now = new Date()) {
  const start = startOfWeek(now).getTime() - weeksAgo * MS_PER_WEEK;

  let sessions = 0;
  let volume = 0;
  let rpeSum = 0;
  let rpeCount = 0;

  for (const w of workouts || []) {
    if (!isCompleted(w)) continue;
    const t = startOfWeek(w.date).getTime();
    if (t !== start) continue;
    sessions += 1;
    volume += w.volume || 0;
    if (w.sessionRpe) {
      rpeSum += w.sessionRpe;
      rpeCount += 1;
    }
  }

  return {
    sessions,
    volume,
    avgRpe: rpeCount ? rpeSum / rpeCount : null,
  };
}

// Consecutive weeks (counting back from this week) with at least one completed
// session. The current, in-progress week is allowed to be empty without
// breaking a run that's still alive from last week.
export function weekStreak(workouts, now = new Date()) {
  const weeksWithSessions = new Set();
  for (const w of workouts || []) {
    if (!isCompleted(w)) continue;
    weeksWithSessions.add(startOfWeek(w.date).getTime());
  }
  if (weeksWithSessions.size === 0) return 0;

  let cursor = startOfWeek(now).getTime();
  if (!weeksWithSessions.has(cursor)) cursor -= MS_PER_WEEK; // grace for this week
  let streak = 0;
  while (weeksWithSessions.has(cursor)) {
    streak += 1;
    cursor -= MS_PER_WEEK;
  }
  return streak;
}

// Map a muscle group to a training category for push/pull/legs balance.
const CATEGORY_BY_MUSCLE = {
  Chest: "Push",
  Shoulders: "Push",
  Triceps: "Push",
  Back: "Pull",
  Biceps: "Pull",
  "Rear delts": "Pull",
  Legs: "Legs",
  Quads: "Legs",
  Hamstrings: "Legs",
  Glutes: "Legs",
  Calves: "Legs",
  Posterior: "Legs",
  Core: "Core",
  "Full body": "Core",
};

const CATEGORIES = ["Push", "Pull", "Legs", "Core"];

const EQUIPMENT_RANK = {
  Barbell: 0,
  Bodyweight: 1,
  Dumbbell: 2,
  Kettlebell: 2,
  Cable: 3,
  Machine: 4,
};

function categoryOf(muscleGroup) {
  return CATEGORY_BY_MUSCLE[muscleGroup] || "Core";
}

// Suggest fresh exercises, biased toward the training category the user has
// worked least recently, so the program stays balanced.
export function recommendExercises(workouts, catalog, count = 3) {
  const cat = catalog || [];
  if (cat.length === 0) return { reason: "", items: [] };

  const trainedIds = new Set();
  const setsByCategory = { Push: 0, Pull: 0, Legs: 0, Core: 0 };
  let hasHistory = false;

  for (const w of workouts || []) {
    for (const ex of w.exercises || []) {
      if (ex.catalogId != null) trainedIds.add(ex.catalogId);
      if (isCompleted(w)) {
        hasHistory = true;
        const c = categoryOf(ex.muscleGroup);
        setsByCategory[c] += (ex.sets || []).length || 0;
      }
    }
  }

  let reason;
  let targetCategories;
  if (!hasHistory) {
    reason = "New here? Start with a few big compound lifts.";
    targetCategories = CATEGORIES;
  } else {
    const laggard = CATEGORIES.reduce((min, c) =>
      setsByCategory[c] < setsByCategory[min] ? c : min
    );
    const busiest = CATEGORIES.reduce((max, c) =>
      setsByCategory[c] > setsByCategory[max] ? c : max
    );
    reason =
      setsByCategory[laggard] === 0
        ? `You haven't trained ${laggard.toLowerCase()} yet. Time to add some balance.`
        : `More ${busiest.toLowerCase()} than ${laggard.toLowerCase()} lately. Time to even it out.`;
    targetCategories = [laggard];
  }

  const pool = cat
    .filter((item) => !trainedIds.has(item.id))
    .filter((item) => targetCategories.includes(categoryOf(item.muscleGroup)))
    .sort(
      (a, b) =>
        (EQUIPMENT_RANK[a.equipment] ?? 5) - (EQUIPMENT_RANK[b.equipment] ?? 5)
    );

  // De-duplicate by muscle group so suggestions feel varied.
  const items = [];
  const seenMuscles = new Set();
  for (const item of pool) {
    if (seenMuscles.has(item.muscleGroup)) continue;
    seenMuscles.add(item.muscleGroup);
    items.push(item);
    if (items.length >= count) break;
  }
  if (items.length < count) {
    for (const item of pool) {
      if (items.includes(item)) continue;
      items.push(item);
      if (items.length >= count) break;
    }
  }

  return { reason, items };
}
