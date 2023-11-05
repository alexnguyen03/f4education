package com.f4education.springjwt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.f4education.springjwt.models.CourseDetail;

public interface CourseDetailRepository extends JpaRepository<CourseDetail, Integer> {
	@Query("SELECT c FROM CourseDetail c WHERE c.course.courseId = :courseId")
	List<CourseDetail> findAllByCourseId(@Param("courseId") Integer courseId);
}
