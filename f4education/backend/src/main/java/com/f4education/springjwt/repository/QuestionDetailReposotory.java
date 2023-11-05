package com.f4education.springjwt.repository;

import com.f4education.springjwt.models.QuestionDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;

@Repository
public interface QuestionDetailReposotory extends JpaRepository<QuestionDetail, Integer> {
	@Query("SELECT qd FROM QuestionDetail qd " +
	        "JOIN qd.question q " +
	        "JOIN q.course c " +
	        "JOIN c.registerCourses rc " +
	        "JOIN q.examinations e " +
	        "WHERE rc.student.studentId = :studentId " +
	        "AND rc.course.courseId = q.course.courseId " +
	        "AND rc.classes.classId IS NOT NULL " +
//	        "AND e.finishDate = CURRENT_DATE "+
	         "AND e.finishDate >= CURRENT_TIMESTAMP")
	List<QuestionDetail> findQuestionDetailByStudentId(@Param("studentId") String studentId);
}