package com.example.workout_tracker.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ExerciseRequest {

    @NotNull(message = "Name is required")
    @Size(min =1, max =255, message = "Name must be between 1 and 255 characters")
    private String name;

    @NotNull(message = "ID is required")
    private Long id;


    @Min(value = 1, message = "Reps must be at least 1")
    private int reps;

    @Min(value = 1, message = "Sets must be at least 1")
    private int sets;

    @NotNull(message = "Workout ID is required")
    private Long workoutId;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getId() {return id;}

    public void setId(Long id) {this.id = id;}

    public int getReps() {
        return reps;
    }

    public void setReps(int reps) {
        this.reps = reps;
    }

    public int getSets() {
        return sets;
    }

    public void setSets(int sets) {
        this.sets = sets;
    }

    public Long getWorkoutId() {
        return workoutId;
    }

    public void setWorkoutId(Long workoutId) {
        this.workoutId = workoutId;
    }
}
