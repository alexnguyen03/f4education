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

	@Query("SELECT COUNT(at.attendanceId) FROM Attendance at WHERE at.student.studentId = :studentId AND at.classes.classId = :classId")
	Integer countAttendanceByClassAndStudent(@Param("studentId") String studentId, @Param("classId") Integer classId);

	@Query("SELECT at.student.studentId, COUNT(at.student.studentId) FROM Attendance AS at WHERE at.classes.classId = :classId GROUP BY at.student.studentId")
	public List<Object[]> getAllByClassId(@Param("classId") Integer classId);

	@Query("SELECT at FROM Attendance at WHERE at.student.studentId = :studentId AND at.classes.classId = :classId")
	List<Attendance> findAllAttendanceByStudentIdAndClassId(@Param("studentId") String studentId,
			@Param("classId") Integer classId);
}
