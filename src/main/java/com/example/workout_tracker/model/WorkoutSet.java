package com.example.workout_tracker.model;

import jakarta.persistence.*;

@Entity
@Table(name = "workout_set")
public class WorkoutSet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer setNumber;
    private Integer reps;
    private Double weight;
    private Boolean failed = false;

    @ManyToOne(optional = false)
    @JoinColumn(name = "workout_exercise_id")
    private WorkoutExercise workoutExercise;

    public WorkoutSet() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getSetNumber() {
        return setNumber;
    }

    public void setSetNumber(Integer setNumber) {
        this.setNumber = setNumber;
    }

    public Integer getReps() {
        return reps;
    }

    public void setReps(Integer reps) {
        this.reps = reps;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public Boolean getFailed() {
        return failed;
    }

    public void setFailed(Boolean failed) {
        this.failed = failed != null && failed;
    }

    public WorkoutExercise getWorkoutExercise() {
        return workoutExercise;
    }

    public void setWorkoutExercise(WorkoutExercise workoutExercise) {
        this.workoutExercise = workoutExercise;
    }
}
