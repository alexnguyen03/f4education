package com.f4education.springjwt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.f4education.springjwt.models.Course;
import com.f4education.springjwt.models.Teacher;
import com.f4education.springjwt.payload.request.TeacherDTO;

public interface TeacherRepository extends JpaRepository<Teacher, String> {

	@Query("SELECT new com.f4education.springjwt.payload.request.TeacherDTO(o) FROM Teacher o")
	List<TeacherDTO> getAllTeachersDTO();

	@Query("SELECT new com.f4education.springjwt.payload.request.TeacherDTO(o) FROM Teacher o WHERE o.teacherId = ?1")
	TeacherDTO getTeacherDTOByID(String teacherId);
}
