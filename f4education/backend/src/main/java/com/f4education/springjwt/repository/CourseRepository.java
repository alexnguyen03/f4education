package com.f4education.springjwt.repository;

import com.f4education.springjwt.models.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Integer> {
	List<Course> findAllByAdmin_AdminId(String adminId);

	List<Course> findAllByCourseName(String courseName);
}
