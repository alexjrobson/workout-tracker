package com.example.workout_tracker.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import java.util.List;

public class WorkoutExerciseRequest {
    private Long id;
    private Long catalogId;

    @Size(min = 1, max = 255)
    private String name;

    private Integer sortOrder;

    @Min(1)
    private Integer targetSets;

    @Min(1)
    private Integer targetReps;

    private Double targetWeight;

    @Valid
    private List<WorkoutSetRequest> sets;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCatalogId() {
        return catalogId;
    }

    public void setCatalogId(Long catalogId) {
        this.catalogId = catalogId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public Integer getTargetSets() {
        return targetSets;
    }

    public void setTargetSets(Integer targetSets) {
        this.targetSets = targetSets;
    }

    public Integer getTargetReps() {
        return targetReps;
    }

    public void setTargetReps(Integer targetReps) {
        this.targetReps = targetReps;
    }

    public Double getTargetWeight() {
        return targetWeight;
    }

    public void setTargetWeight(Double targetWeight) {
        this.targetWeight = targetWeight;
    }

    public List<WorkoutSetRequest> getSets() {
        return sets;
    }

    public void setSets(List<WorkoutSetRequest> sets) {
        this.sets = sets;
    }
}
