package com.example.workout_tracker.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

//Represents a complete workout session, stores the date, name, and all the Exercise.java performed during the session

@Entity
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Workout() {

    }

    //One workout can contain multiple exercises.
    @OneToMany(mappedBy ="workout", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Exercise> exercises = new ArrayList<>();

    public List<Exercise> getExercises(){
        return exercises;
    }
    public void setExercises(List<Exercise> exercises){ this.exercises = exercises;}

    public void addExercise (Exercise exercise){
        exercises.add(exercise);
        exercise.setWorkout(this);
    }

    public void removeExercise(Exercise exercise){
        exercises.remove(exercise);
        exercise.setWorkout(null);
    }

}
