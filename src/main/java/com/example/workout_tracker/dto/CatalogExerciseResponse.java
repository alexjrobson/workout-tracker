package com.example.workout_tracker.dto;

public class CatalogExerciseResponse {
    private Long id;
    private String name;
    private String muscleGroup;
    private String equipment;

    public CatalogExerciseResponse(Long id, String name, String muscleGroup, String equipment) {
        this.id = id;
        this.name = name;
        this.muscleGroup = muscleGroup;
        this.equipment = equipment;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getMuscleGroup() {
        return muscleGroup;
    }

    public String getEquipment() {
        return equipment;
    }
}
