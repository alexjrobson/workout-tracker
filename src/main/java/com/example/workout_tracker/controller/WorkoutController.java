package com.example.workout_tracker.controller;

import com.example.workout_tracker.dto.ExerciseRequest;
import com.example.workout_tracker.dto.ExerciseResponse;
import com.example.workout_tracker.dto.WorkoutRequest;
import com.example.workout_tracker.dto.WorkoutResponse;
import com.example.workout_tracker.model.Workout;
import com.example.workout_tracker.repository.WorkoutRepository;
import com.example.workout_tracker.model.Exercise;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Arrays.stream;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/workouts")
public class WorkoutController {

    @Autowired
    private WorkoutRepository workoutRepository;

    @GetMapping
    public List<WorkoutResponse> getAllWorkouts(){
        return workoutRepository.findAll()
                .stream()
                .map(this::mapWorkoutToResponse)
                .collect(Collectors.toList());
    }


    @GetMapping("/{id}")
    public ResponseEntity<WorkoutResponse> getWorkoutById(@PathVariable Long id){
        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Workout not found"));
        return ResponseEntity.ok(mapWorkoutToResponse(workout));
    }
    @PostMapping
    public ResponseEntity<WorkoutResponse> createWorkout(@Valid @RequestBody WorkoutRequest request){
        Workout workout = new Workout();
        workout.setName(request.getName());
        workout.setDate(request.getDate());

        if (request.getExercises() != null) {
            List<Exercise> exercises = request.getExercises().stream()
                    .map(exReq -> {
                        Exercise ex = new Exercise();
                        ex.setName(exReq.getName());
                        ex.setReps(exReq.getReps());
                        ex.setSets(exReq.getSets());
                        ex.setWeight(exReq.getWeight());
                        ex.setSetError(exReq.isSetError());
                        ex.setWorkout(workout); // set the link back
                        return ex;
                    })
                    .collect(Collectors.toList());
            workout.setExercises(exercises);
        }

        Workout saved = workoutRepository.save(workout);

        return ResponseEntity.status(HttpStatus.CREATED).body(mapWorkoutToResponse(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkoutResponse> updateWorkout(@PathVariable Long id, @Valid @RequestBody WorkoutRequest updatedRequest){
        return workoutRepository.findById(id)
                .map(workout -> {
                    if(updatedRequest.getName() !=null){
                    workout.setName(updatedRequest.getName());
                    }
                    if(updatedRequest.getDate() !=null){
                    workout.setDate(updatedRequest.getDate());
                    }

                    List<Exercise> updatedExercises = new ArrayList<>();

                    if(updatedRequest.getExercises() !=null){
                        for(ExerciseRequest exerciseRequest : updatedRequest.getExercises()) {
                            if (exerciseRequest.getWorkoutId() != null){

                                workout.getExercises().stream()
                                        .filter(exercise -> exercise.getId().equals(exerciseRequest.getWorkoutId()))
                                                .findFirst()
                                        .ifPresent(exercise -> {
                                            exercise.setName(exerciseRequest.getName());
                                            exercise.setReps(exerciseRequest.getReps());
                                            exercise.setSets(exerciseRequest.getSets());
                                            exercise.setWeight(exerciseRequest.getWeight());
                                            exercise.setSetError(exerciseRequest.isSetError());
                                                });

                            }

                            else{
                            Exercise exerciseNew = new Exercise(
                                    exerciseRequest.getName(),
                                    exerciseRequest.getReps(),
                                    exerciseRequest.getSets(),
                                    exerciseRequest.getWeight(),
                                    exerciseRequest.isSetError(),
                                    workout
                            );
                            updatedExercises.add(exerciseNew);
                          }
                        }
                      }

                    workout.getExercises().clear();
                    workout.getExercises().addAll(updatedExercises);

                    Workout savedWorkout = workoutRepository.save(workout);
                    return ResponseEntity.ok(mapWorkoutToResponse(savedWorkout));
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

    public WorkoutResponse mapWorkoutToResponse(Workout workout){
        List<Exercise> exercises = workout.getExercises() == null ? Collections.emptyList() : workout.getExercises();

        List<ExerciseResponse> exerciseResponses = exercises.stream()
                .map(ex -> new ExerciseResponse(ex.getId(), ex.getName(), ex.getReps(), ex.getSets(),ex.getWeight(), ex.isSetError()))
                .collect(Collectors.toList());

        return new WorkoutResponse(workout.getId(), workout.getName(),workout.getDate(), exerciseResponses);
    }
}
