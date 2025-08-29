package com.example.workout_tracker.model;

import jakarta.persistence.*;

// Represents a single exercise in a workout session. Stores reps, sets, weights, any failed sets
// Linked to the parent Workout.java

@Entity
public class Exercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Integer reps;
    private Integer sets;
    private Double weight;
    private Boolean setError;


    //Each exercise belongs to a single workout
    @ManyToOne
    @JoinColumn(name = "workout_id")
    private Workout workout;

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

    public Integer getReps() {
        return reps;
    }

    public void setReps(Integer reps) {
        this.reps = reps;
    }

    public Integer getSets() {
        return sets;
    }

    public void setSets(Integer sets) {
        this.sets = sets;
    }

    public Workout getWorkout() {
        return workout;
    }

    public void setWorkout(Workout workout) {
        this.workout = workout;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public Boolean isSetError() {
        return setError;
    }

    public void setSetError(Boolean setError) {
        this.setError = setError;
    }


    public Exercise(){

    }

    public Exercise(String name, Integer reps, Integer sets, Double weight, Boolean setError, Workout workout) {
        this.name = name;
        this.reps = reps;
        this.sets = sets;
        this.weight = weight;
        this.setError = setError;
        this.workout = workout;
    }
}


