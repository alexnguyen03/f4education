package com.f4education.springjwt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.f4education.springjwt.models.Schedule;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Integer> {
    @Query("SELECT sc FROM Schedule sc WHERE sc.classes.classId = :classId")
    public List<Schedule> findAllScheduleByClassId(Integer classId);
}
