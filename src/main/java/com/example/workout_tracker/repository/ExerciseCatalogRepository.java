package com.example.workout_tracker.repository;

import com.example.workout_tracker.model.ExerciseCatalog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExerciseCatalogRepository extends JpaRepository<ExerciseCatalog, Long> {
    Optional<ExerciseCatalog> findByNameIgnoreCase(String name);

    List<ExerciseCatalog> findByNameContainingIgnoreCaseOrderByNameAsc(String q);

    List<ExerciseCatalog> findByMuscleGroupIgnoreCaseOrderByNameAsc(String muscleGroup);

    List<ExerciseCatalog> findByMuscleGroupIgnoreCaseAndNameContainingIgnoreCaseOrderByNameAsc(
            String muscleGroup, String q);

    List<ExerciseCatalog> findAllByOrderByMuscleGroupAscNameAsc();
}
