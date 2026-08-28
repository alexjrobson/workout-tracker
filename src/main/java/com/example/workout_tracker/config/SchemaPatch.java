package com.example.workout_tracker.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@Order(1)
public class SchemaPatch implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public SchemaPatch(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        jdbcTemplate.execute("ALTER TABLE workout ADD COLUMN IF NOT EXISTS workout_status varchar(32)");
        jdbcTemplate.execute("UPDATE workout SET workout_status = 'PLANNED' WHERE workout_status IS NULL");
        jdbcTemplate.execute("ALTER TABLE workout ADD COLUMN IF NOT EXISTS session_rpe integer");
        jdbcTemplate.execute("ALTER TABLE workout ADD COLUMN IF NOT EXISTS notes varchar(2000)");
        jdbcTemplate.execute("ALTER TABLE workout ADD COLUMN IF NOT EXISTS user_id bigint");
    }
}
