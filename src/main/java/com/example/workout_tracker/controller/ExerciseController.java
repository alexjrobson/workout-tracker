package com.example.workout_tracker.controller;

import com.example.workout_tracker.model.Exercise;
import com.example.workout_tracker.repository.ExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/exercises")
public class ExerciseController {

    @Autowired
    private ExerciseRepository repo;

    @GetMapping
    public List<Exercise> getAllExercises(){
        return repo.findAll();
    }
    @GetMapping
    public List<Exercise> getExercises(@RequestParam(required = false) Long workoutId){
        if(workoutId != null){
            return repo.findbyWorkoutId(workoutId);
        }
        else{
            return repo.findAll();
        }
    }

    @PostMapping
    public ResponseEntity<Exercise> createExercise(@RequestBody Exercise exercise) {
        Exercise saved = repo.save(exercise);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Exercise> updateExercise(@PathVariable Long id, @RequestBody Exercise updatedExercise) {
        return repo.findById(id)
                .map(exercise -> {
                    exercise.setName(updatedExercise.getName());
                    exercise.setReps(updatedExercise.getSets());
                    exercise.setSets(updatedExercise.getSets());
                    exercise.setWorkout(updatedExercise.getWorkout()); // Optional
                    Exercise saved = repo.save(exercise);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExercise(@PathVariable Long id){
        if(!repo.existsById(id)){
            return ResponseEntity.notFound().build();
        }
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
