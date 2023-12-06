package com.f4education.springjwt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.f4education.springjwt.models.Evaluate;

public interface EvaluateRepository extends JpaRepository<Evaluate, Integer> {
	@Query("SELECT e FROM Evaluate e WHERE e.registerCourse.course.courseId = :courseId")
	List<Evaluate> findAllEvaluateByCourseId(@Param("courseId") Integer courseId);

	@Query("SELECT ev FROM Evaluate ev WHERE ev.rating >= 4 ORDER BY ev.reviewDate DESC LIMIT 10")
	List<Evaluate> findTop10LatestEvaluate();
}