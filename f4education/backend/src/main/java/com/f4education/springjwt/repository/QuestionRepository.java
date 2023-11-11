package com.f4education.springjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.f4education.springjwt.models.Question;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Integer> {
    // List những câu hoỉ không trùng lập courseName
    // @Query("SELECT q FROM Question q WHERE q.questionId IN (" +
    // "SELECT MIN(q2.questionId) FROM Question q2 WHERE q2.courseName " +
    // "IS NOT NULL GROUP BY q2.courseName)")
    // List<Question> findDistinctByCourseName();
    //
    //
    // @Query("SELECT q FROM Question q WHERE q.courseName = :courseName")
    // List<Question> findByCourseName(String courseName);
    //
    @Query("SELECT MAX(q.questionId) FROM Question q")
    Integer getMaxQuestionId();

    @Query(value = "SELECT q  FROM Question q WHERE q.course.courseId = :courseId ")
    public Question findByCourseId(@Param("courseId") Integer courseId);
}