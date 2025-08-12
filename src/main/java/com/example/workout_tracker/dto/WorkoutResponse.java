package com.example.workout_tracker.dto;

import java.time.LocalDate;
import java.util.List;

public class WorkoutResponse {
    private Long id;
    private String name;
    private LocalDate date;
    private List<ExerciseResponse> exercises;


    public WorkoutResponse(Long id, String name, LocalDate date, List<ExerciseResponse> exercises){
        this.id = id;
        this.name = name;
        this.date = date;
        this.exercises = exercises;

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public List<ExerciseResponse> getExercises() {
        return exercises;
    }

    public void setExercises(List<ExerciseResponse> exercises) {
        this.exercises = exercises;
    }
}
