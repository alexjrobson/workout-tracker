package com.example.workout_tracker;

import com.example.workout_tracker.model.Exercise;
import com.example.workout_tracker.model.Workout;
import com.example.workout_tracker.repository.ExerciseRepository;
import com.example.workout_tracker.repository.WorkoutRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@Transactional
public class WorkoutRepositoryTest {

    @Autowired
    private WorkoutRepository workoutRepository;

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Test
    void testWorkoutWithExercises() {
        Workout workout = new Workout();
        workout.setName("Chest Day");
        workout.setDate(LocalDate.now());

        Exercise ex1 = new Exercise("Bench Press", 10, 3, 100.0, false, workout);
        Exercise ex2 = new Exercise("Incline Dumbbell Press", 12, 3, 80.0, true,workout);

        workout.setExercises(List.of(ex1, ex2));

        workoutRepository.save(workout);

        Workout fetchedWorkout = workoutRepository.findById(workout.getId()).orElseThrow();

        assertEquals("Chest Day", fetchedWorkout.getName());
        assertNotNull(fetchedWorkout.getExercises());
        assertEquals(2, fetchedWorkout.getExercises().size());

        for (Exercise ex : fetchedWorkout.getExercises()) {
            assertEquals(fetchedWorkout.getId(), ex.getWorkout().getId());
        }

    }


}
