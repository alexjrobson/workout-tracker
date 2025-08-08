package com.example.workout_tracker.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class WorkoutRequest {

    @NotNull(message ="Name is required")
    @Size(min = 1, max = 255, message ="Name must be between 1 and 255 characters")
    private String name;

    @NotNull(message = "Date is required")
    private LocalDate date;

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
