package com.example.workout_tracker.dto;

public class WorkoutSetResponse {
    private Long id;
    private Integer setNumber;
    private Integer reps;
    private Double weight;
    private Boolean failed;

    public WorkoutSetResponse(Long id, Integer setNumber, Integer reps, Double weight, Boolean failed) {
        this.id = id;
        this.setNumber = setNumber;
        this.reps = reps;
        this.weight = weight;
        this.failed = failed;
    }

    public Long getId() {
        return id;
    }

    public Integer getSetNumber() {
        return setNumber;
    }

    public Integer getReps() {
        return reps;
    }

    public Double getWeight() {
        return weight;
    }

    public Boolean getFailed() {
        return failed;
    }
}
