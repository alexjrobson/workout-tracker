package com.example.workout_tracker.controller;

import com.example.workout_tracker.dto.ExerciseRequest;
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

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/exercises")
public class ExerciseController {

    @Autowired
    private WorkoutRepository workoutRepository;
    @Autowired
    private ExerciseRepository exerciseRepository;

    @GetMapping
    public List<Exercise> getExercises(@RequestParam(required = false) Long workoutId){
        if(workoutId != null){
            return exerciseRepository.findByWorkoutId(workoutId);
        }
        else{
            return exerciseRepository.findAll();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Exercise> updateExercise(@PathVariable Long id,@Valid @RequestBody ExerciseRequest updatedRequest) {
        return exerciseRepository.findById(id)
                .map(exercise -> {
                    exercise.setName(updatedRequest.getName());
                    exercise.setReps(updatedRequest.getReps());
                    exercise.setSets(updatedRequest.getSets());
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
    public ResponseEntity<Exercise> createExercise(@Valid @RequestBody ExerciseRequest request) {

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
    @GetMapping("/{id}")
    public ResponseEntity<Exercise> getExerciseById(@PathVariable Long id){
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND ,"Exercise not found"));
        return ResponseEntity.ok(exercise);
}

}
