package com.example.workout_tracker.dto;

public class ExerciseResponse {
    private Long id;
    private String name;
    private int reps;
    private int sets;

    public ExerciseResponse(Long id,String name, int reps, int sets){
        this.id = id;
        this.name = name;
        this.reps = reps;
        this.sets = sets;
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
}
