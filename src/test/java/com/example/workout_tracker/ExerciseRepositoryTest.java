package com.example.workout_tracker;

import com.example.workout_tracker.model.User;
import com.example.workout_tracker.model.Workout;
import com.example.workout_tracker.model.WorkoutExercise;
import com.example.workout_tracker.model.WorkoutSet;
import com.example.workout_tracker.model.WorkoutStatus;
import com.example.workout_tracker.repository.UserRepository;
import com.example.workout_tracker.repository.WorkoutRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@Transactional
public class ExerciseRepositoryTest {

    @Autowired
    private WorkoutRepository workoutRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void testSaveExerciseWithWorkout() {
        User user = new User();
        user.setUsername("set-logger-" + UUID.randomUUID());
        user.setPassword("secret");
        userRepository.save(user);

        Workout workout = new Workout();
        workout.setName("Push");
        workout.setDate(LocalDate.now());
        workout.setStatus(WorkoutStatus.COMPLETED);
        workout.setUser(user);

        WorkoutExercise exercise = new WorkoutExercise();
        exercise.setName("Barbell Bench Press");
        exercise.setTargetSets(3);
        exercise.setTargetReps(10);
        exercise.setTargetWeight(100.0);

        WorkoutSet set = new WorkoutSet();
        set.setSetNumber(1);
        set.setReps(10);
        set.setWeight(100.0);
        set.setFailed(false);
        exercise.addSet(set);
        workout.addExercise(exercise);

        workoutRepository.save(workout);

        Workout fetched = workoutRepository.findById(workout.getId()).orElseThrow();
        WorkoutExercise saved = fetched.getExercises().get(0);
        assertEquals("Barbell Bench Press", saved.getName());
        assertEquals(10, saved.getSets().get(0).getReps());
        assertEquals(100.0, saved.getSets().get(0).getWeight());
        assertFalse(saved.getSets().get(0).getFailed());
        assertNotNull(saved.getWorkout());
        assertEquals(workout.getId(), saved.getWorkout().getId());
    }
}
