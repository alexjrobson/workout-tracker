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
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@Transactional
public class WorkoutRepositoryTest {

    @Autowired
    private WorkoutRepository workoutRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void testWorkoutWithExercises() {
        User user = new User();
        user.setUsername("test-lifter-" + UUID.randomUUID());
        user.setPassword("secret");
        userRepository.save(user);

        Workout workout = new Workout();
        workout.setName("Chest Day");
        workout.setDate(LocalDate.now());
        workout.setStatus(WorkoutStatus.PLANNED);
        workout.setUser(user);

        WorkoutExercise bench = new WorkoutExercise();
        bench.setName("Barbell Bench Press");
        bench.setSortOrder(0);
        bench.setTargetSets(3);
        bench.setTargetReps(10);
        bench.setTargetWeight(100.0);

        WorkoutSet set = new WorkoutSet();
        set.setSetNumber(1);
        set.setReps(10);
        set.setWeight(100.0);
        set.setFailed(false);
        bench.addSet(set);
        workout.addExercise(bench);

        workoutRepository.save(workout);

        Workout fetched = workoutRepository.findById(workout.getId()).orElseThrow();
        assertEquals("Chest Day", fetched.getName());
        assertEquals(user.getId(), fetched.getUser().getId());
        assertNotNull(fetched.getExercises());
        assertEquals(1, fetched.getExercises().size());
        assertEquals(1, fetched.getExercises().get(0).getSets().size());
        assertEquals(fetched.getId(), fetched.getExercises().get(0).getWorkout().getId());
    }
}
