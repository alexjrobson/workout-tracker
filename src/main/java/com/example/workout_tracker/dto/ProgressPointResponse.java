package com.example.workout_tracker.dto;

import java.time.LocalDate;

public class ProgressPointResponse {
    private LocalDate date;
    private Long workoutId;
    private String workoutName;
    private Double topWeight;
    private Integer topReps;
    private Double volume;
    private Double estimated1Rm;
    private String vsPrevious;

    public ProgressPointResponse(LocalDate date, Long workoutId, String workoutName,
                                 Double topWeight, Integer topReps, Double volume,
                                 Double estimated1Rm, String vsPrevious) {
        this.date = date;
        this.workoutId = workoutId;
        this.workoutName = workoutName;
        this.topWeight = topWeight;
        this.topReps = topReps;
        this.volume = volume;
        this.estimated1Rm = estimated1Rm;
        this.vsPrevious = vsPrevious;
    }

    public LocalDate getDate() {
        return date;
    }

    public Long getWorkoutId() {
        return workoutId;
    }

    public String getWorkoutName() {
        return workoutName;
    }

    public Double getTopWeight() {
        return topWeight;
    }

    public Integer getTopReps() {
        return topReps;
    }

    public Double getVolume() {
        return volume;
    }

    public Double getEstimated1Rm() {
        return estimated1Rm;
    }

    public String getVsPrevious() {
        return vsPrevious;
    }
}
