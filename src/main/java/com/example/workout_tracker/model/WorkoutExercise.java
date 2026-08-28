package com.example.workout_tracker.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workout_exercise")
public class WorkoutExercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Integer sortOrder;
    private Integer targetSets;
    private Integer targetReps;
    private Double targetWeight;

    @ManyToOne
    @JoinColumn(name = "catalog_id")
    private ExerciseCatalog catalog;

    @ManyToOne(optional = false)
    @JoinColumn(name = "workout_id")
    private Workout workout;

    @OneToMany(mappedBy = "workoutExercise", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("setNumber ASC")
    private List<WorkoutSet> sets = new ArrayList<>();

    public WorkoutExercise() {
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

    public ExerciseCatalog getCatalog() {
        return catalog;
    }

    public void setCatalog(ExerciseCatalog catalog) {
        this.catalog = catalog;
    }

    public Workout getWorkout() {
        return workout;
    }

    public void setWorkout(Workout workout) {
        this.workout = workout;
    }

    public List<WorkoutSet> getSets() {
        return sets;
    }

    public void setSets(List<WorkoutSet> sets) {
        this.sets = sets;
    }

    public void addSet(WorkoutSet set) {
        sets.add(set);
        set.setWorkoutExercise(this);
    }
}
