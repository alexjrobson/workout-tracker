package com.example.workout_tracker.controller;

import com.example.workout_tracker.model.Exercise;
import com.example.workout_tracker.repository.ExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/exercises")
public class ExerciseController {

    @Autowired
    private ExerciseRepository repo;

    @GetMapping
    public List<Exercise> getAllExcercises(){
        return repo.findAll();
    }
}
