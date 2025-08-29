package com.example.workout_tracker.dto;

//DTO used to send exercise data to the frontend. Mirrors Exercise entity but is decoupled from the database model

public class ExerciseResponse {
    private Long id;
    private String name;
    private Integer reps;
    private Integer sets;
    private Double weight;
    private Boolean setError;

    public ExerciseResponse(Long id,String name, Integer reps, Integer sets, Double weight, Boolean setError){
        this.id = id;
        this.name = name;
        this.reps = reps;
        this.sets = sets;
        this.weight = weight;
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

    public Double getWeight() {return weight;}

    public void setWeight(Double weight) {this.weight = weight;}

    public Boolean isSetError() {
        return setError;
    }

    public void setSetError(Boolean setError) {
        this.setError = setError;
    }
}

