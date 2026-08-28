package com.example.workout_tracker.controller;

import com.example.workout_tracker.dto.ProgressPointResponse;
import com.example.workout_tracker.model.User;
import com.example.workout_tracker.model.Workout;
import com.example.workout_tracker.model.WorkoutExercise;
import com.example.workout_tracker.model.WorkoutSet;
import com.example.workout_tracker.model.WorkoutStatus;
import com.example.workout_tracker.repository.WorkoutRepository;
import com.example.workout_tracker.service.CurrentUserService;
import jakarta.transaction.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/progress")
@Transactional
public class ProgressController {

    private final WorkoutRepository workoutRepository;
    private final CurrentUserService currentUserService;

    public ProgressController(WorkoutRepository workoutRepository, CurrentUserService currentUserService) {
        this.workoutRepository = workoutRepository;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    public List<ProgressPointResponse> progress(@RequestParam Long catalogId) {
        User user = currentUserService.requireUser();
        List<Workout> workouts = workoutRepository.findByUserAndStatusOrderByDateDescIdDesc(
                user, WorkoutStatus.COMPLETED);

        List<ProgressPointResponse> chronological = new ArrayList<>();
        List<Workout> oldestFirst = new ArrayList<>(workouts);
        oldestFirst.sort(Comparator.comparing(Workout::getDate).thenComparing(Workout::getId));

        Double previousE1rm = null;
        for (Workout workout : oldestFirst) {
            WorkoutExercise match = workout.getExercises().stream()
                    .filter(ex -> ex.getCatalog() != null && catalogId.equals(ex.getCatalog().getId()))
                    .findFirst()
                    .orElse(null);
            if (match == null) {
                continue;
            }

            double volume = 0;
            Double topWeight = null;
            Integer topReps = null;
            double topE1rm = 0;

            for (WorkoutSet set : match.getSets()) {
                if (set.getWeight() == null || set.getReps() == null) {
                    continue;
                }
                volume += set.getWeight() * set.getReps();
                double e1rm = set.getWeight() * (1 + set.getReps() / 30.0);
                if (e1rm >= topE1rm) {
                    topE1rm = e1rm;
                    topWeight = set.getWeight();
                    topReps = set.getReps();
                }
            }

            if (topWeight == null) {
                continue;
            }

            String vsPrevious = "same";
            if (previousE1rm != null) {
                if (topE1rm > previousE1rm + 0.5) {
                    vsPrevious = "up";
                } else if (topE1rm < previousE1rm - 0.5) {
                    vsPrevious = "down";
                }
            }
            previousE1rm = topE1rm;

            chronological.add(new ProgressPointResponse(
                    workout.getDate(),
                    workout.getId(),
                    workout.getName(),
                    topWeight,
                    topReps,
                    volume,
                    Math.round(topE1rm * 10.0) / 10.0,
                    vsPrevious
            ));
        }

        int from = Math.max(0, chronological.size() - 12);
        List<ProgressPointResponse> latest = chronological.subList(from, chronological.size());
        return new ArrayList<>(latest);
    }
}
