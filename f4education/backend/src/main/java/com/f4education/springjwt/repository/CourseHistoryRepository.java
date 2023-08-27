package com.f4education.springjwt.repository;

import com.f4education.springjwt.models.CourseHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseHistoryRepository extends JpaRepository<CourseHistory, Integer> {
}
