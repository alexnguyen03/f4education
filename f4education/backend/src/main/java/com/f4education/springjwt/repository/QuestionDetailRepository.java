package com.f4education.springjwt.repository;

import com.f4education.springjwt.models.QuestionDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionDetailRepository extends JpaRepository<QuestionDetail, Integer> {
	@Query("SELECT qd FROM QuestionDetail qd WHERE qd.question.questionId = :questionId")
	List<QuestionDetail> findAllQuestionDetailByQuestionId(@Param("questionId") Integer questionId);

	@Query("SELECT qd FROM QuestionDetail qd " +
			"JOIN qd.question q " +
			"JOIN q.course c " +
			"JOIN c.registerCourses rc " +
			"WHERE rc.course.courseId = q.course.courseId " +
			"AND rc.classes.classId = :classId")
	public List<QuestionDetail> findQuestionDetailByStudentId(@Param("classId") Integer classId);
}