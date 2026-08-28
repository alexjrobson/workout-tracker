package com.example.workout_tracker.controller;

import com.example.workout_tracker.dto.WorkoutRequest;
import com.example.workout_tracker.dto.WorkoutResponse;
import com.example.workout_tracker.model.User;
import com.example.workout_tracker.model.Workout;
import com.example.workout_tracker.repository.WorkoutRepository;
import com.example.workout_tracker.service.CurrentUserService;
import com.example.workout_tracker.service.WorkoutMapper;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/workouts")
@Transactional
public class WorkoutController {

    private final WorkoutRepository workoutRepository;
    private final CurrentUserService currentUserService;
    private final WorkoutMapper workoutMapper;

    public WorkoutController(WorkoutRepository workoutRepository,
                             CurrentUserService currentUserService,
                             WorkoutMapper workoutMapper) {
        this.workoutRepository = workoutRepository;
        this.currentUserService = currentUserService;
        this.workoutMapper = workoutMapper;
    }

    @GetMapping
    public List<WorkoutResponse> getAllWorkouts() {
        User user = currentUserService.requireUser();
        return workoutRepository.findByUserOrderByDateDescIdDesc(user).stream()
                .map(workoutMapper::toResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkoutResponse> getWorkoutById(@PathVariable Long id) {
        return ResponseEntity.ok(workoutMapper.toResponse(ownedWorkout(id)));
    }

    @PostMapping
    public ResponseEntity<WorkoutResponse> createWorkout(@Valid @RequestBody WorkoutRequest request) {
        User user = currentUserService.requireUser();
        Workout workout = new Workout();
        workout.setUser(user);
        workoutMapper.applyRequest(workout, request);
        Workout saved = workoutRepository.save(workout);
        return ResponseEntity.status(HttpStatus.CREATED).body(workoutMapper.toResponse(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkoutResponse> updateWorkout(
            @PathVariable Long id,
            @Valid @RequestBody WorkoutRequest request) {
        Workout workout = ownedWorkout(id);
        workoutMapper.applyRequest(workout, request);
        Workout saved = workoutRepository.save(workout);
        return ResponseEntity.ok(workoutMapper.toResponse(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkout(@PathVariable Long id) {
        Workout workout = ownedWorkout(id);
        workoutRepository.delete(workout);
        return ResponseEntity.noContent().build();
    }

    private Workout ownedWorkout(Long id) {
        User user = currentUserService.requireUser();
        return workoutRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Workout not found"));
    }
}
