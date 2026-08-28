package com.example.workout_tracker.repository;

import com.example.workout_tracker.model.User;
import com.example.workout_tracker.model.Workout;
import com.example.workout_tracker.model.WorkoutStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WorkoutRepository extends JpaRepository<Workout, Long> {
    List<Workout> findByUserOrderByDateDescIdDesc(User user);

    Optional<Workout> findByIdAndUser(Long id, User user);

    List<Workout> findByUserAndStatusOrderByDateDescIdDesc(User user, WorkoutStatus status);
}
