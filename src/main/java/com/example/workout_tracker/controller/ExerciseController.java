package com.example.workout_tracker.controller;

import com.example.workout_tracker.dto.ExerciseRequest;
import com.example.workout_tracker.dto.ExerciseResponse;
import com.example.workout_tracker.model.Exercise;
import com.example.workout_tracker.model.Workout;
import com.example.workout_tracker.repository.ExerciseRepository;
import com.example.workout_tracker.repository.WorkoutRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

//REST controller for managing exercises. Handles creation, retrieval, update, and deletion of individual exercises.

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/exercises")
public class ExerciseController {

    @Autowired
    private WorkoutRepository workoutRepository;
    @Autowired
    private ExerciseRepository exerciseRepository;

    @GetMapping
    public List<ExerciseResponse> getExercises(@RequestParam(required = false) Long workoutId){
        List<Exercise> exercises = (workoutId != null)
                ? exerciseRepository.findByWorkoutId(workoutId)
                : exerciseRepository.findAll();

        return exercises.stream()
                .map(ex -> new ExerciseResponse(ex.getId(), ex.getName(), ex.getReps(), ex.getSets(), ex.getWeight(), ex.isSetError()))
                .collect(Collectors.toList());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExerciseResponse> updateExercise(@PathVariable Long id,@Valid @RequestBody ExerciseRequest updatedRequest) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercise not found"));
        ExerciseResponse response = new ExerciseResponse(exercise.getId(), exercise.getName(), exercise.getReps(), exercise.getSets(),exercise.getWeight(), exercise.isSetError());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExercise(@PathVariable Long id){
        if(!exerciseRepository.existsById(id)){
            return ResponseEntity.notFound().build();
        }
        exerciseRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<ExerciseResponse> createExercise(@Valid @RequestBody ExerciseRequest request) {

        Workout workout = workoutRepository.findById(request.getWorkoutId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Workout not found"));

        Exercise exercise = new Exercise(request.getName(), request.getReps(), request.getSets(), request.getWeight(), request.isSetError(), workout);
        Exercise saved = exerciseRepository.save(exercise);

        ExerciseResponse response = new ExerciseResponse(saved.getId(), saved.getName(), saved.getReps(), saved.getSets(), saved.getWeight(), saved.isSetError());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);

    }
    @GetMapping("/{id}")
    public ResponseEntity<ExerciseResponse> getExerciseById(@PathVariable Long id, @Valid @RequestBody ExerciseRequest updatedRequest){
        return exerciseRepository.findById(id)
                .map(exercise -> {
                    exercise.setName(updatedRequest.getName());
                    exercise.setReps(updatedRequest.getReps());
                    exercise.setSets(updatedRequest.getSets());
                    Exercise saved = exerciseRepository.save(exercise);
                    ExerciseResponse response = new ExerciseResponse(saved.getId(), saved.getName(), saved.getReps(), saved.getSets(), saved.getWeight(), saved.isSetError());
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
}

}
