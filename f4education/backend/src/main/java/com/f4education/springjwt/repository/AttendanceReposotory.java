package com.f4education.springjwt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.f4education.springjwt.models.Attendance;

@Repository
public interface AttendanceReposotory extends JpaRepository<Attendance, Integer> {
	@Query("SELECT at FROM Attendance at WHERE at.student.studentId = :studentId")
	List<Attendance> findAllAttendanceByStudentId(@Param("studentId") String studentId);
}
