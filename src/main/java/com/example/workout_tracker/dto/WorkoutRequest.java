package com.example.workout_tracker.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;

//DTO for creating or updating a workout. Includes workout metadata and a list of exercises

public class WorkoutRequest {

    @NotNull(message ="Name is required")
    @Size(min = 1, max = 255, message ="Name must be between 1 and 255 characters")
    private String name;

    @NotNull(message = "Date is required")
    private LocalDate date;

    private List<ExerciseRequest> exercises;

    public List<ExerciseRequest> getExercises() {
        return exercises;
    }

    public void setExercises(List<ExerciseRequest> exercises) {
        this.exercises = exercises;
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
}
