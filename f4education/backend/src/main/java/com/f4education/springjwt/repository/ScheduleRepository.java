package com.f4education.springjwt.repository;

import java.time.OffsetDateTime;
import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.f4education.springjwt.models.Schedule;
import com.f4education.springjwt.payload.request.ScheduleTeacherDTO;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Integer> {
	@Query("SELECT sc FROM Schedule sc WHERE sc.classes.classId = :classId")
	public List<Schedule> findAllScheduleByClassId(Integer classId);

	@Query("SELECT COUNT(sch) FROM Schedule sch WHERE sch.classes.classId = :classId "
			+ "AND sch.studyDate BETWEEN :startDate AND :endDate")
	Integer findTotalClassInSchedule(@Param("classId") Integer classId, @Param("startDate") Date startDate,
			@Param("endDate") Date endDate);

	@Query("SELECT new com.f4education.springjwt.payload.request.ScheduleTeacherDTO(sc) FROM Schedule sc WHERE sc.classes.teacher.user.id = :accountId ORDER BY sc.studyDate ASC")
	public List<ScheduleTeacherDTO> findAllScheduleTeacherByID(Integer accountId);

	@Query("SELECT sc FROM Schedule sc WHERE sc.classes.classId = :classId AND sc.studyDate = :studyDate")
	public Schedule findAllScheduleByClassIdAndStudyDate(@Param("classId") Integer classId,
			@Param("studyDate") OffsetDateTime studyDate);

	@Query(value = "SELECT s.scheduleId, s.studyDate, s.isPractice, s.classes.classId, s.sessions.sessionId "
			+ "FROM Schedule s " + "JOIN Classes c ON s.classes.classId = c.classId "
			+ "LEFT JOIN Attendance a ON s.studyDate = a.attendanceDate AND a.classes.classId = c.classId AND a.student.studentId = :studentId "
			+ "WHERE c.classId = :classId")
	List<Object[]> findScheduleWithAttendance(@Param("classId") Integer classId, @Param("studentId") String studentId);
}
