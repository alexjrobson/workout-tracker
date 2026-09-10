import {
  roundToPlate,
  summarizeExercise,
  recommendForExercise,
  buildNextSession,
  weeklyStats,
  weekStreak,
  recommendExercises,
} from "./recommend";

describe("roundToPlate", () => {
  it("rounds to the nearest 2.5kg", () => {
    expect(roundToPlate(61)).toBe(60);
    expect(roundToPlate(63.7)).toBe(62.5);
    expect(roundToPlate(64)).toBe(65);
    expect(roundToPlate(0)).toBe(0);
  });
});

describe("summarizeExercise", () => {
  it("finds the heaviest logged set and counts misses", () => {
    const s = summarizeExercise({
      sets: [
        { weight: 60, reps: 8, failed: false },
        { weight: 80, reps: 5, failed: false },
        { weight: 80, reps: 3, failed: true },
      ],
    });
    expect(s.workWeight).toBe(80);
    expect(s.repsAtTop).toBe(5);
    expect(s.failed).toBe(1);
    expect(s.sets).toBe(3);
  });
});

describe("recommendForExercise (autoregulation)", () => {
  const base = { workWeight: 100, repsAtTop: 5, failed: 0, sets: 3 };

  it("adds load when the session felt easy (low RPE)", () => {
    const r = recommendForExercise(base, 5);
    expect(r.direction).toBe("up");
    expect(r.recWeight).toBeGreaterThan(100);
  });

  it("makes a small increase for a solid session (RPE 7-8)", () => {
    const r = recommendForExercise(base, 7);
    expect(r.direction).toBe("up");
    expect(r.recWeight).toBeGreaterThan(100);
  });

  it("deloads after a near-max session (high RPE)", () => {
    const r = recommendForExercise(base, 9);
    expect(r.direction).toBe("down");
    expect(r.recWeight).toBeLessThan(100);
  });

  it("backs off when reps were missed, regardless of RPE", () => {
    const r = recommendForExercise({ ...base, failed: 1 }, 5);
    expect(r.direction).toBe("down");
    expect(r.recWeight).toBeLessThan(100);
  });

  it("holds and asks for feedback when no RPE was recorded", () => {
    const r = recommendForExercise(base, null);
    expect(r.direction).toBe("hold");
    expect(r.recWeight).toBe(100);
  });
});

describe("buildNextSession", () => {
  it("progresses the most recent completed session based on its RPE", () => {
    const workouts = [
      {
        status: "COMPLETED",
        name: "Push day",
        date: "2026-09-01",
        sessionRpe: 5,
        exercises: [
          {
            catalogId: 11,
            name: "Barbell Bench Press",
            muscleGroup: "Chest",
            sets: [
              { weight: 60, reps: 8, failed: false },
              { weight: 60, reps: 8, failed: false },
            ],
          },
        ],
      },
      {
        status: "COMPLETED",
        date: "2026-08-20",
        sessionRpe: 9,
        exercises: [
          { catalogId: 11, name: "Barbell Bench Press", muscleGroup: "Chest", sets: [{ weight: 55, reps: 8 }] },
        ],
      },
    ];
    const next = buildNextSession(workouts);
    expect(next.basedOnName).toBe("Push day");
    expect(next.exercises[0].name).toBe("Barbell Bench Press");
    expect(next.exercises[0].direction).toBe("up"); // RPE 5 → add load
    expect(next.exercises[0].targetWeight).toBeGreaterThan(60);
  });

  it("returns null with no completed sessions", () => {
    expect(buildNextSession([{ status: "PLANNED", exercises: [] }])).toBeNull();
  });
});

describe("weeklyStats + weekStreak", () => {
  const now = new Date("2026-09-10T12:00:00"); // a Thursday
  const workouts = [
    { status: "COMPLETED", date: "2026-09-08", volume: 1000, sessionRpe: 7 }, // this week
    { status: "COMPLETED", date: "2026-09-09", volume: 500, sessionRpe: 5 }, // this week
    { status: "COMPLETED", date: "2026-09-01", volume: 800, sessionRpe: 8 }, // last week
    { status: "PLANNED", date: "2026-09-10", volume: 0 },
  ];

  it("sums this week's completed sessions and volume", () => {
    const s = weeklyStats(workouts, 0, now);
    expect(s.sessions).toBe(2);
    expect(s.volume).toBe(1500);
    expect(s.avgRpe).toBeCloseTo(6);
  });

  it("counts consecutive active weeks", () => {
    expect(weekStreak(workouts, now)).toBe(2);
  });
});

describe("recommendExercises", () => {
  const catalog = [
    { id: 11, name: "Barbell Bench Press", muscleGroup: "Chest", equipment: "Barbell" },
    { id: 21, name: "Pull-Up", muscleGroup: "Back", equipment: "Bodyweight" },
    { id: 22, name: "Barbell Row", muscleGroup: "Back", equipment: "Barbell" },
    { id: 30, name: "Back Squat", muscleGroup: "Legs", equipment: "Barbell" },
  ];

  it("suggests the lagging category and excludes trained lifts", () => {
    const workouts = [
      {
        status: "COMPLETED",
        date: "2026-09-08",
        exercises: [
          { catalogId: 11, muscleGroup: "Chest", sets: [{}, {}, {}] },
        ],
      },
    ];
    const { items } = recommendExercises(workouts, catalog, 2);
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((i) => i.id !== 11)).toBe(true); // not already trained
    expect(items.some((i) => i.muscleGroup === "Back")).toBe(true); // pull is lagging
  });

  it("suggests compounds for a brand-new user", () => {
    const { items } = recommendExercises([], catalog, 3);
    expect(items.length).toBe(3);
  });
});
