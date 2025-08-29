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

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class ExerciseRepositoryTest {

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Autowired
    private WorkoutRepository workoutRepository;

    @Test
    void testSaveExerciseWithWorkout(){

        Workout workout = new Workout();
        workout.setDate(LocalDate.now());
        workoutRepository.save(workout);

        Exercise exercise = new Exercise("Bench Press", 10, 3, 100.0, true, workout);
        exerciseRepository.save(exercise);

        List<Exercise> exercises = exerciseRepository.findAll();
        assertEquals(1, exercises.size());
        assertEquals("Bench Press", exercises.get(0).getName());
        assertEquals(10, exercises.get(0).getReps());
        assertEquals(3, exercises.get(0).getSets());
        assertEquals(100, exercises.get(0).getWeight());
        assertTrue(exercises.get(0).isSetError());


        assertNotNull(exercises.get(0).getWorkout());
        assertEquals(workout.getId(), exercises.get(0).getWorkout().getId());
    }
}
