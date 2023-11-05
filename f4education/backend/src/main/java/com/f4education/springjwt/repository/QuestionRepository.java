package com.f4education.springjwt.repository;

import com.f4education.springjwt.models.Question;
import com.f4education.springjwt.models.QuestionDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

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

    @Query(value = "SELECT TOP 60 *  FROM Question q where q.course_id =:courseId ORDER BY NEWID()", nativeQuery = true)

    public List<Question> findAllByCourseId(@Param("courseId") Integer courseId);
}