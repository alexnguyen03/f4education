package com.f4education.springjwt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.f4education.springjwt.models.QuestionDetail;

@Repository
public interface QuestionDetailReposotory extends JpaRepository<QuestionDetail, Integer> {
	@Query("SELECT qd FROM QuestionDetail qd " + "JOIN Question q ON qd.question.questionId = q.questionId "
			+ "JOIN Course c ON q.course.courseId = c.courseId " + "JOIN RegisterCourse rc ON c.courseId = rc.course.courseId "
			+ "WHERE rc.student.studentId = :studentId AND rc.course.courseId = q.course.courseId AND rc.classes.classId IS NOT NULL")
	List<QuestionDetail> findQuestionDetailByStudentId(@Param("studentId") String studentId);
}
