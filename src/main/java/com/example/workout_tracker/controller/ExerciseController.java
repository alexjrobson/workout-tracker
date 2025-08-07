package com.example.workout_tracker.controller;

import com.example.workout_tracker.dto.ExerciseRequest;
import com.example.workout_tracker.model.Exercise;
import com.example.workout_tracker.model.Workout;
import com.example.workout_tracker.repository.ExerciseRepository;
import com.example.workout_tracker.repository.WorkoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/exercises")
public class ExerciseController {

    @Autowired
    private WorkoutRepository workoutRepository;
    @Autowired
    private ExerciseRepository exerciseRepository;

    @GetMapping
    public List<Exercise> getAllExercises(){
        return exerciseRepository.findAll();
    }
    @GetMapping
    public List<Exercise> getExercises(@RequestParam(required = false) Long workoutId){
        if(workoutId != null){
            return exerciseRepository.findbyWorkoutId(workoutId);
        }
        else{
            return exerciseRepository.findAll();
        }
    }

    @PostMapping
    public ResponseEntity<Exercise> createExercise(@RequestBody Exercise exercise) {
        Exercise saved = exerciseRepository.save(exercise);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Exercise> updateExercise(@PathVariable Long id, @RequestBody Exercise updatedExercise) {
        return exerciseRepository.findById(id)
                .map(exercise -> {
                    exercise.setName(updatedExercise.getName());
                    exercise.setReps(updatedExercise.getSets());
                    exercise.setSets(updatedExercise.getSets());
                    exercise.setWorkout(updatedExercise.getWorkout()); // Optional
                    Exercise saved = exerciseRepository.save(exercise);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
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
    public ResponseEntity<Exercise> createExercise(@RequestBody ExerciseRequest request) {

        Optional<Workout> workoutOptional = workoutRepository.findById(request.getWorkoutId()); // might contain a Workout, or might be empty

        if (workoutOptional.isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Workout not found");
        }
            Workout workout = workoutOptional.get();
            Exercise exercise = new Exercise(
                    request.getName(),
                    request.getReps(),
                    request.getSets(),
                    workout);

           Exercise savedExercise = exerciseRepository.save(exercise);

           return ResponseEntity.status(HttpStatus.CREATED).body(savedExercise);


}

}
