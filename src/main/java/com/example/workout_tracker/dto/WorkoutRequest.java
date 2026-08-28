package com.example.workout_tracker.dto;

import com.example.workout_tracker.model.WorkoutStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;

public class WorkoutRequest {

    @NotNull(message = "Name is required")
    @Size(min = 1, max = 255, message = "Name must be between 1 and 255 characters")
    private String name;

    @NotNull(message = "Date is required")
    private LocalDate date;

    private WorkoutStatus status;

    @Min(1)
    @Max(10)
    private Integer sessionRpe;

    @Size(max = 2000)
    private String notes;

    @Valid
    private List<WorkoutExerciseRequest> exercises;

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

    public WorkoutStatus getStatus() {
        return status;
    }

    public void setStatus(WorkoutStatus status) {
        this.status = status;
    }

    public Integer getSessionRpe() {
        return sessionRpe;
    }

    public void setSessionRpe(Integer sessionRpe) {
        this.sessionRpe = sessionRpe;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public List<WorkoutExerciseRequest> getExercises() {
        return exercises;
    }

    public void setExercises(List<WorkoutExerciseRequest> exercises) {
        this.exercises = exercises;
    }
}
