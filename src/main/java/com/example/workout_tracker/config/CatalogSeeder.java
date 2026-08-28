package com.example.workout_tracker.config;

import com.example.workout_tracker.model.ExerciseCatalog;
import com.example.workout_tracker.repository.ExerciseCatalogRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Order(2)
public class CatalogSeeder implements CommandLineRunner {

    private final ExerciseCatalogRepository catalogRepository;

    public CatalogSeeder(ExerciseCatalogRepository catalogRepository) {
        this.catalogRepository = catalogRepository;
    }

    @Override
    public void run(String... args) {
        List<ExerciseCatalog> seed = List.of(
                new ExerciseCatalog("Back Squat", "Legs", "Barbell"),
                new ExerciseCatalog("Front Squat", "Legs", "Barbell"),
                new ExerciseCatalog("Romanian Deadlift", "Hamstrings", "Barbell"),
                new ExerciseCatalog("Conventional Deadlift", "Posterior", "Barbell"),
                new ExerciseCatalog("Hip Thrust", "Glutes", "Barbell"),
                new ExerciseCatalog("Walking Lunge", "Legs", "Dumbbell"),
                new ExerciseCatalog("Leg Press", "Legs", "Machine"),
                new ExerciseCatalog("Leg Extension", "Quads", "Machine"),
                new ExerciseCatalog("Lying Leg Curl", "Hamstrings", "Machine"),
                new ExerciseCatalog("Standing Calf Raise", "Calves", "Machine"),
                new ExerciseCatalog("Barbell Bench Press", "Chest", "Barbell"),
                new ExerciseCatalog("Incline Dumbbell Press", "Chest", "Dumbbell"),
                new ExerciseCatalog("Dumbbell Fly", "Chest", "Dumbbell"),
                new ExerciseCatalog("Push-Up", "Chest", "Bodyweight"),
                new ExerciseCatalog("Dip", "Chest", "Bodyweight"),
                new ExerciseCatalog("Overhead Press", "Shoulders", "Barbell"),
                new ExerciseCatalog("Seated Dumbbell Press", "Shoulders", "Dumbbell"),
                new ExerciseCatalog("Lateral Raise", "Shoulders", "Dumbbell"),
                new ExerciseCatalog("Face Pull", "Rear delts", "Cable"),
                new ExerciseCatalog("Pull-Up", "Back", "Bodyweight"),
                new ExerciseCatalog("Chin-Up", "Back", "Bodyweight"),
                new ExerciseCatalog("Barbell Row", "Back", "Barbell"),
                new ExerciseCatalog("One-Arm Dumbbell Row", "Back", "Dumbbell"),
                new ExerciseCatalog("Lat Pulldown", "Back", "Cable"),
                new ExerciseCatalog("Seated Cable Row", "Back", "Cable"),
                new ExerciseCatalog("Barbell Curl", "Biceps", "Barbell"),
                new ExerciseCatalog("Dumbbell Curl", "Biceps", "Dumbbell"),
                new ExerciseCatalog("Hammer Curl", "Biceps", "Dumbbell"),
                new ExerciseCatalog("Triceps Pushdown", "Triceps", "Cable"),
                new ExerciseCatalog("Skull Crusher", "Triceps", "Barbell"),
                new ExerciseCatalog("Close-Grip Bench Press", "Triceps", "Barbell"),
                new ExerciseCatalog("Hanging Leg Raise", "Core", "Bodyweight"),
                new ExerciseCatalog("Cable Crunch", "Core", "Cable"),
                new ExerciseCatalog("Plank", "Core", "Bodyweight"),
                new ExerciseCatalog("Farmer Carry", "Full body", "Dumbbell"),
                new ExerciseCatalog("Kettlebell Swing", "Posterior", "Kettlebell"),
                new ExerciseCatalog("Goblet Squat", "Legs", "Dumbbell"),
                new ExerciseCatalog("Bulgarian Split Squat", "Legs", "Dumbbell"),
                new ExerciseCatalog("Pec Deck", "Chest", "Machine"),
                new ExerciseCatalog("Rear Delt Fly", "Rear delts", "Dumbbell")
        );

        for (ExerciseCatalog item : seed) {
            if (catalogRepository.findByNameIgnoreCase(item.getName()).isEmpty()) {
                catalogRepository.save(item);
            }
        }
    }
}
