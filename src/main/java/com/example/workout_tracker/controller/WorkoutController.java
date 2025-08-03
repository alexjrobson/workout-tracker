package com.example.workout_tracker.controller;

import com.example.workout_tracker.model.Workout;
import com.example.workout_tracker.repository.WorkoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/workouts")
public class WorkoutController {

    @Autowired
    private WorkoutRepository repo;

    @GetMapping
    public List<Workout> getAllWorkouts(){
        return repo.findAll();
    }

    @PostMapping
    public Workout createWorkout(@RequestBody Workout workout){
        return repo.save(workout);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Workout> updateWorkout(@PathVariable Long id, @RequestBody Workout updatedWorkout){
        return repo.findById(id)
                .map(workout -> {
                    workout.setName(updatedWorkout.getName());
                    workout.setDate(updatedWorkout.getDate());
                    Workout savedWorkout = repo.save(workout);
                    return ResponseEntity.ok(savedWorkout);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkout(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
