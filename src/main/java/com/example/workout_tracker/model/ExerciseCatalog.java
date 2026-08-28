package com.example.workout_tracker.model;

import jakarta.persistence.*;

@Entity
@Table(name = "exercise_catalog")
public class ExerciseCatalog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String muscleGroup;

    @Column(nullable = false)
    private String equipment;

    public ExerciseCatalog() {
    }

    public ExerciseCatalog(String name, String muscleGroup, String equipment) {
        this.name = name;
        this.muscleGroup = muscleGroup;
        this.equipment = equipment;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMuscleGroup() {
        return muscleGroup;
    }

    public void setMuscleGroup(String muscleGroup) {
        this.muscleGroup = muscleGroup;
    }

    public String getEquipment() {
        return equipment;
    }

    public void setEquipment(String equipment) {
        this.equipment = equipment;
    }
}
