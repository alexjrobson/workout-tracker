package com.example.workout_tracker.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(name = "workout_status", nullable = false)
    private WorkoutStatus status = WorkoutStatus.PLANNED;

    private Integer sessionRpe;

    @Column(length = 2000)
    private String notes;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "workout", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<WorkoutExercise> exercises = new ArrayList<>();

    public Workout() {
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

    public WorkoutStatus getStatus() {
        return status;
    }

    public void setStatus(WorkoutStatus status) {
        this.status = status;
    }

    public Integer getSessionRpe() {
        return sessionRpe;
    }

    public void setSessionRpe(Integer sessionRpe) {
        this.sessionRpe = sessionRpe;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<WorkoutExercise> getExercises() {
        return exercises;
    }

    public void setExercises(List<WorkoutExercise> exercises) {
        this.exercises = exercises;
    }

    public void addExercise(WorkoutExercise exercise) {
        exercises.add(exercise);
        exercise.setWorkout(this);
    }
}
