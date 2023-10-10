package com.f4education.springjwt.repository;

import com.f4education.springjwt.models.Course;
import com.f4education.springjwt.payload.request.CourseDTO;
import com.f4education.springjwt.payload.request.ThoiLuongRange;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Integer> {
	List<Course> findAllByAdmin_AdminId(String adminId);

	List<Course> findAllByCourseName(String courseName);

	@Query("SELECT c FROM Course c JOIN c.subject s WHERE s.subjectName IN (:subjectNames)")
	List<Course> findBySubjectNames(@Param("subjectNames") List<String> subjectNames);

	@Query("SELECT k FROM Course k WHERE k.courseDuration >= :minThoiLuong AND k.courseDuration <= :maxThoiLuong")
	List<Course> findByThoiLuongInRange(@Param("minThoiLuong") Integer minThoiLuong,
			@Param("maxThoiLuong") Integer maxThoiLuong);

	@Query("SELECT c FROM Course c ORDER BY c.courseId DESC LIMIT 10")
	List<Course> findTop10LatestCourses();
}
