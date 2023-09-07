package com.f4education.springjwt.repository;

import com.f4education.springjwt.models.CourseHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseHistoryRepository extends JpaRepository<CourseHistory, Integer> {

	List<CourseHistory> findAllByCourseCourseId(Integer courseId);
}
