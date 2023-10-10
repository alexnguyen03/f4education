package com.f4education.springjwt.repository;

import com.f4education.springjwt.models.RegisterCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegisterCourseRepository extends JpaRepository<RegisterCourse, Integer> {
	@Query("SELECT rc FROM RegisterCourse rc WHERE rc.student.studentId = :studentId")
	List<RegisterCourse> findByStudentId(@Param("studentId") Integer studentId);

}
