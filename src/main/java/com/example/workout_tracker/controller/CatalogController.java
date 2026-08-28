package com.example.workout_tracker.controller;

import com.example.workout_tracker.dto.CatalogExerciseResponse;
import com.example.workout_tracker.model.ExerciseCatalog;
import com.example.workout_tracker.repository.ExerciseCatalogRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/catalog/exercises")
public class CatalogController {

    private final ExerciseCatalogRepository catalogRepository;

    public CatalogController(ExerciseCatalogRepository catalogRepository) {
        this.catalogRepository = catalogRepository;
    }

    @GetMapping
    public List<CatalogExerciseResponse> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String muscleGroup) {
        String query = q == null ? "" : q.trim();
        String muscle = muscleGroup == null ? "" : muscleGroup.trim();

        List<ExerciseCatalog> results;
        if (!muscle.isEmpty() && !query.isEmpty()) {
            results = catalogRepository.findByMuscleGroupIgnoreCaseAndNameContainingIgnoreCaseOrderByNameAsc(
                    muscle, query);
        } else if (!muscle.isEmpty()) {
            results = catalogRepository.findByMuscleGroupIgnoreCaseOrderByNameAsc(muscle);
        } else if (!query.isEmpty()) {
            results = catalogRepository.findByNameContainingIgnoreCaseOrderByNameAsc(query);
        } else {
            results = catalogRepository.findAllByOrderByMuscleGroupAscNameAsc();
        }

        return results.stream()
                .map(item -> new CatalogExerciseResponse(
                        item.getId(), item.getName(), item.getMuscleGroup(), item.getEquipment()))
                .collect(Collectors.toList());
    }
}
