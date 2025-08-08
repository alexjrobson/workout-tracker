package com.example.workout_tracker.controller;

import com.example.workout_tracker.dto.WorkoutRequest;
import com.example.workout_tracker.model.Workout;
import com.example.workout_tracker.repository.WorkoutRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/workouts")
public class WorkoutController {

    @Autowired
    private WorkoutRepository workoutRepository;

    @GetMapping
    public List<Workout> getAllWorkouts(){
        return workoutRepository.findAll();
    }


    @GetMapping("/{id}")
    public ResponseEntity<Workout> getWorkoutById(@PathVariable Long id){
        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Workout not found"));
        return ResponseEntity.ok(workout);
    }
    @PostMapping
    public ResponseEntity<Workout> createWorkout(@Valid @RequestBody WorkoutRequest request){
        Workout workout = new Workout();
        workout.setName(request.getName());
        workout.setDate(request.getDate());

        Workout saved = workoutRepository.save(workout);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Workout> updateWorkout(@PathVariable Long id, @Valid @RequestBody WorkoutRequest updatedRequest){
        return workoutRepository.findById(id)
                .map(workout -> {
                    workout.setName(updatedRequest.getName());
                    workout.setDate(updatedRequest.getDate());
                    Workout savedWorkout = workoutRepository.save(workout);
                    return ResponseEntity.ok(savedWorkout);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkout(@PathVariable Long id) {
        if (!workoutRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        workoutRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
