package com.example.workout_tracker.model;

import jakarta.persistence.*;

@Entity
public class Exercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private int reps;
    private int sets;
    private double weight;
    private boolean setError;


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

    public int getReps() {
        return reps;
    }

    public void setReps(int reps) {
        this.reps = reps;
    }

    public int getSets() {
        return sets;
    }

    public void setSets(int sets) {
        this.sets = sets;
    }

    public Workout getWorkout() {
        return workout;
    }

    public void setWorkout(Workout workout) {
        this.workout = workout;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public boolean isSetError() {
        return setError;
    }

    public void setSetError(boolean setError) {
        this.setError = setError;
    }


    public Exercise(){

    }

    public Exercise(String name, int reps, int sets,double weight, boolean setError, Workout workout) {
        this.name = name;
        this.reps = reps;
        this.sets = sets;
        this.weight = weight;
        this.setError = setError;
        this.workout = workout;
    }
}


