package com.example.workout_tracker.controller;

import com.example.workout_tracker.model.Workout;
import com.example.workout_tracker.repository.WorkoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
