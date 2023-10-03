package com.f4education.springjwt.repository;

import com.f4education.springjwt.models.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Integer> {
	List<Course> findAllByAdmin_AdminId(String adminId);

	List<Course> findAllByCourseName(String courseName);

	@Query("SELECT c FROM Course c ORDER BY c.courseId DESC LIMIT 10")
	List<Course> findTop10LatestCourses();
}
