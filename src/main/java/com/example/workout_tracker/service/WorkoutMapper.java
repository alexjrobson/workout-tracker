package com.example.workout_tracker.service;

import com.example.workout_tracker.dto.WorkoutExerciseRequest;
import com.example.workout_tracker.dto.WorkoutExerciseResponse;
import com.example.workout_tracker.dto.WorkoutRequest;
import com.example.workout_tracker.dto.WorkoutResponse;
import com.example.workout_tracker.dto.WorkoutSetRequest;
import com.example.workout_tracker.dto.WorkoutSetResponse;
import com.example.workout_tracker.model.ExerciseCatalog;
import com.example.workout_tracker.model.Workout;
import com.example.workout_tracker.model.WorkoutExercise;
import com.example.workout_tracker.model.WorkoutSet;
import com.example.workout_tracker.model.WorkoutStatus;
import com.example.workout_tracker.repository.ExerciseCatalogRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class WorkoutMapper {

    private final ExerciseCatalogRepository catalogRepository;

    public WorkoutMapper(ExerciseCatalogRepository catalogRepository) {
        this.catalogRepository = catalogRepository;
    }

    public void applyRequest(Workout workout, WorkoutRequest request) {
        workout.setName(request.getName());
        workout.setDate(request.getDate());
        workout.setStatus(request.getStatus() != null ? request.getStatus() : WorkoutStatus.PLANNED);
        workout.setSessionRpe(request.getSessionRpe());
        workout.setNotes(request.getNotes());

        workout.getExercises().clear();
        List<WorkoutExerciseRequest> exerciseRequests =
                request.getExercises() == null ? Collections.emptyList() : request.getExercises();

        int order = 0;
        for (WorkoutExerciseRequest exReq : exerciseRequests) {
            WorkoutExercise exercise = new WorkoutExercise();
            exercise.setSortOrder(exReq.getSortOrder() != null ? exReq.getSortOrder() : order);
            exercise.setTargetSets(exReq.getTargetSets());
            exercise.setTargetReps(exReq.getTargetReps());
            exercise.setTargetWeight(exReq.getTargetWeight());

            if (exReq.getCatalogId() != null) {
                ExerciseCatalog catalog = catalogRepository.findById(exReq.getCatalogId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Catalog exercise not found"));
                exercise.setCatalog(catalog);
                exercise.setName(exReq.getName() != null && !exReq.getName().isBlank()
                        ? exReq.getName() : catalog.getName());
            } else {
                if (exReq.getName() == null || exReq.getName().isBlank()) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Exercise name is required");
                }
                exercise.setName(exReq.getName());
            }

            List<WorkoutSetRequest> setRequests = exReq.getSets();
            if (setRequests == null || setRequests.isEmpty()) {
                int planned = exReq.getTargetSets() != null ? exReq.getTargetSets() : 0;
                for (int i = 1; i <= planned; i++) {
                    WorkoutSet set = new WorkoutSet();
                    set.setSetNumber(i);
                    set.setReps(exReq.getTargetReps());
                    set.setWeight(exReq.getTargetWeight());
                    set.setFailed(false);
                    exercise.addSet(set);
                }
            } else {
                int n = 1;
                for (WorkoutSetRequest setReq : setRequests) {
                    WorkoutSet set = new WorkoutSet();
                    set.setSetNumber(setReq.getSetNumber() != null ? setReq.getSetNumber() : n);
                    set.setReps(setReq.getReps() != null ? setReq.getReps() : exReq.getTargetReps());
                    set.setWeight(setReq.getWeight() != null ? setReq.getWeight() : exReq.getTargetWeight());
                    set.setFailed(Boolean.TRUE.equals(setReq.getFailed()));
                    exercise.addSet(set);
                    n++;
                }
            }

            workout.addExercise(exercise);
            order++;
        }
    }

    public WorkoutResponse toResponse(Workout workout) {
        List<WorkoutExerciseResponse> exercises = new ArrayList<>();
        int failed = 0;
        int total = 0;
        double volume = 0;

        for (WorkoutExercise exercise : workout.getExercises()) {
            List<WorkoutSetResponse> sets = new ArrayList<>();
            for (WorkoutSet set : exercise.getSets()) {
                total++;
                if (Boolean.TRUE.equals(set.getFailed())) {
                    failed++;
                }
                if (set.getWeight() != null && set.getReps() != null) {
                    volume += set.getWeight() * set.getReps();
                }
                sets.add(new WorkoutSetResponse(
                        set.getId(),
                        set.getSetNumber(),
                        set.getReps(),
                        set.getWeight(),
                        Boolean.TRUE.equals(set.getFailed())
                ));
            }
            Long catalogId = exercise.getCatalog() != null ? exercise.getCatalog().getId() : null;
            String muscleGroup = exercise.getCatalog() != null ? exercise.getCatalog().getMuscleGroup() : null;
            exercises.add(new WorkoutExerciseResponse(
                    exercise.getId(),
                    catalogId,
                    exercise.getName(),
                    muscleGroup,
                    exercise.getSortOrder(),
                    exercise.getTargetSets(),
                    exercise.getTargetReps(),
                    exercise.getTargetWeight(),
                    sets
            ));
        }

        return new WorkoutResponse(
                workout.getId(),
                workout.getName(),
                workout.getDate(),
                workout.getStatus(),
                workout.getSessionRpe(),
                workout.getNotes(),
                failed,
                total,
                volume,
                exercises
        );
    }
}
