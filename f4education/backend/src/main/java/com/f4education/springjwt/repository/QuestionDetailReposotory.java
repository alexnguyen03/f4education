package com.f4education.springjwt.repository;

import com.f4education.springjwt.models.QuestionDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionDetailReposotory extends JpaRepository<QuestionDetail, Integer> {
    @Query("SELECT qd FROM QuestionDetail qd WHERE qd.question.questionId = :questionId")
    List<QuestionDetail> findAllQuestionDetailByQuestionId(@Param("questionId") Integer questionId);
}
