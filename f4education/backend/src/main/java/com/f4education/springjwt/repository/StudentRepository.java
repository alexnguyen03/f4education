package com.f4education.springjwt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.f4education.springjwt.models.Course;
import com.f4education.springjwt.models.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, String> {
	@Query("SELECT t FROM Student t WHERE t.studentId = ?1")
	Student getStudentDTOByID(String studentId);
}