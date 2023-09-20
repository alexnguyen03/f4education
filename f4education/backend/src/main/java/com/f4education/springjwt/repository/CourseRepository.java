package com.f4education.springjwt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.f4education.springjwt.models.Course;

public interface CourseRepository extends JpaRepository<Course, Integer> {
	List<Course> findAllByAdmin_AdminId(String adminId);
	
	@Query("SELECT c FROM Course c WHERE c.subject.subjectName = :subjectName")
	List<Course> getCourseBySubjectName(@Param("subjectName") String subjectName);
}
