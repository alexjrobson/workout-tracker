package com.example.workout_tracker.dto;

import com.example.workout_tracker.model.WorkoutStatus;

import java.time.LocalDate;
import java.util.List;

public class WorkoutResponse {
    private Long id;
    private String name;
    private LocalDate date;
    private WorkoutStatus status;
    private Integer sessionRpe;
    private String notes;
    private int failedSets;
    private int totalSets;
    private double volume;
    private List<WorkoutExerciseResponse> exercises;

    public WorkoutResponse(Long id, String name, LocalDate date, WorkoutStatus status,
                           Integer sessionRpe, String notes, int failedSets, int totalSets,
                           double volume, List<WorkoutExerciseResponse> exercises) {
        this.id = id;
        this.name = name;
        this.date = date;
        this.status = status;
        this.sessionRpe = sessionRpe;
        this.notes = notes;
        this.failedSets = failedSets;
        this.totalSets = totalSets;
        this.volume = volume;
        this.exercises = exercises;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public LocalDate getDate() {
        return date;
    }

    public WorkoutStatus getStatus() {
        return status;
    }

    public Integer getSessionRpe() {
        return sessionRpe;
    }

    public String getNotes() {
        return notes;
    }

    public int getFailedSets() {
        return failedSets;
    }

    public int getTotalSets() {
        return totalSets;
    }

    public double getVolume() {
        return volume;
    }

    public List<WorkoutExerciseResponse> getExercises() {
        return exercises;
    }
}
