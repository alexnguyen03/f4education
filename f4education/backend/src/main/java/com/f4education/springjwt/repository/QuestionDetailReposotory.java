package com.f4education.springjwt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.f4education.springjwt.models.QuestionDetail;

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
	        "AND e.finishDate = CURRENT_DATE")
	List<QuestionDetail> findQuestionDetailByStudentId(@Param("studentId") String studentId);
}
