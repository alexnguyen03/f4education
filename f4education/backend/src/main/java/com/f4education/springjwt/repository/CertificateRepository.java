package com.f4education.springjwt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.f4education.springjwt.models.Certificate;

public interface CertificateRepository extends JpaRepository<Certificate, Integer> {
	@Query("SELECT c FROM Certificate c WHERE c.registerCourse.student.studentId = :studentId")
	List<Certificate> findAllByStudenId(@Param("studentId") String studentId);

	@Query("SELECT c FROM Certificate c WHERE c.registerCourse.registerCourseId = :registerCourseId "
			+ "AND c.registerCourse.student.studentId = :studentId")
	Certificate findAllByRegisterCourseIdAndStudenId(@Param("registerCourseId") Integer registerCourseId,
			@Param("studentId") String studentId);
}