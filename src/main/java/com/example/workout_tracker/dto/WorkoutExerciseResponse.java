package com.example.workout_tracker.dto;

import java.util.List;

public class WorkoutExerciseResponse {
    private Long id;
    private Long catalogId;
    private String name;
    private String muscleGroup;
    private Integer sortOrder;
    private Integer targetSets;
    private Integer targetReps;
    private Double targetWeight;
    private List<WorkoutSetResponse> sets;

    public WorkoutExerciseResponse(Long id, Long catalogId, String name, String muscleGroup,
                                   Integer sortOrder, Integer targetSets, Integer targetReps,
                                   Double targetWeight, List<WorkoutSetResponse> sets) {
        this.id = id;
        this.catalogId = catalogId;
        this.name = name;
        this.muscleGroup = muscleGroup;
        this.sortOrder = sortOrder;
        this.targetSets = targetSets;
        this.targetReps = targetReps;
        this.targetWeight = targetWeight;
        this.sets = sets;
    }

    public Long getId() {
        return id;
    }

    public Long getCatalogId() {
        return catalogId;
    }

    public String getName() {
        return name;
    }

    public String getMuscleGroup() {
        return muscleGroup;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public Integer getTargetSets() {
        return targetSets;
    }

    public Integer getTargetReps() {
        return targetReps;
    }

    public Double getTargetWeight() {
        return targetWeight;
    }

    public List<WorkoutSetResponse> getSets() {
        return sets;
    }
}
